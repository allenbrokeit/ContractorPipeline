# CREATE LEAD FEATURE — IMPLEMENTATION PLAN

## META
- framework: symbols-app/domql-v3
- bundler: parcel
- symbols_dir: ./symbols
- mcp_tools_required: get_project_rules, audit_component, search_symbols_docs
- frank_rules: enforce FA301-FA902, verify_frankability after each file write

---

## DATA MODEL

### project entity shape (state.js)
```
{id, clientId, title, status, monthlyValue, durationMonths, startDate}
```
### client entity shape (state.js)
```
{id, name, industry, contactEmail, contactPhone}
```
### new lead requires all project fields + clientId FK
### status MUST be 'Lead' — hardcoded on creation
### id pattern: `p_${Date.now()}`

---

## STATE CHANGES

### file: symbols/state.js
- ADD: `isCreateLeadModalOpen: false` to root UI state toggles (after line 10)
- NO new arrays or collections needed — new lead pushes to existing `projects[]`

---

## COMPONENT INVENTORY

### 1. CreateLeadButton (NEW)
- file: symbols/components/CreateLeadButton.js
- export: `CreateLeadButton`
- extends: 'Flex' (tag implicitly div, acts as styled button wrapper)
- REUSE pattern from ProposalKanbanBoard Actions childExtends (lines 71-93)
- design tokens: background='secured', color='black', borderRadius='W', padding='Z A', cursor='pointer'
- hover: translateY(-2px), boxShadow glow matching FinancialHealthGauge hover
- text: '+ New Lead'
- onClick: `(e, el, s) => s.root.update({ isCreateLeadModalOpen: true })`
- transition: 'transform 0.2s ease, box-shadow 0.2s ease'

### 2. CreateLeadModal (NEW)
- file: symbols/components/CreateLeadModal.js
- export: `CreateLeadModal`
- extends: 'Flex' (fullscreen overlay like ContractFormModal)
- CLONE structure from ContractFormModal.js (lines 1-187)
- visibility: `display: (el, s) => s.root.isCreateLeadModalOpen ? 'flex' : 'none'`
- position: fixed, inset 0, background rgba(0,0,0,0.5), backdropFilter blur(8px), zIndex 1000

#### Dialog child structure:
```
Dialog
├── Header          tag:'h2', text:'Create New Lead'
├── ClientSelect    FormGroup w/ select, children from s.root.clients
│   └── childExtends: tag:'option', text:s.name, attr.value:s.id
│   └── NewClientOption: tag:'option', value:'__new__', text:'+ New Client...'
├── NewClientFields (conditional: if s.selectedClientId === '__new__')
│   ├── ClientName  input text
│   ├── Industry    input text
│   ├── Email       input email
│   └── Phone       input tel
├── ProjectTitle    FormGroup w/ input text
├── MonthlyValue    FormGroup w/ input number, min 0
├── DurationMonths  FormGroup w/ input number, min 1
├── StartDate       FormGroup w/ input date, style:{colorScheme:'dark'}
├── Actions
│   ├── Cancel      onClick: s.root.update({isCreateLeadModalOpen:false}), reset local state
│   └── CreateLead  onClick: validate, build project obj, push to projects[], close modal
```

#### local state:
```
state: {
  selectedClientId: '',
  newClientName: '',
  newClientIndustry: '',
  newClientEmail: '',
  newClientPhone: '',
  projectTitle: '',
  monthlyValue: 0,
  durationMonths: 3,
  startDate: new Date().toISOString().split('T')[0]
}
```

#### CreateLead onClick logic:
```
1. validate: projectTitle non-empty, monthlyValue > 0, clientId selected or new fields filled
2. if selectedClientId === '__new__':
   a. create newClient = {id:`c_${Date.now()}`, name, industry, contactEmail, contactPhone}
   b. clientId = newClient.id
   c. append to s.root.clients
3. build newProject = {
     id: `p_${Date.now()}`,
     clientId,
     title: projectTitle,
     status: 'Lead',        // HARDCODED — ensures pipeline compatibility
     monthlyValue,
     durationMonths,
     startDate: new Date(startDate).toISOString()
   }
4. s.root.update({
     projects: [...s.root.projects, newProject],
     clients: (newClient ? [...s.root.clients, newClient] : s.root.clients),
     isCreateLeadModalOpen: false
   })
5. reset local state
```

#### style tokens (match ContractFormModal + theme):
- Dialog: background='rgba(30, 41, 59, 0.9)', backdropFilter='blur(16px)', border='1px solid rgba(255, 255, 255, 0.15)', boxShadow dark, padding='B', borderRadius='Z', width='450px', gap='A'
- Labels: color='textSecondary', fontSize='Z'
- Inputs: padding='Z', background='bgPrimary', color='white', border='1px solid rgba(255,255,255,0.1)', borderRadius='W'
- Cancel: background='transparent', border='1px solid', borderColor='border', color='textSecondary'
- CreateLead: background='secured', color='black', border='none'
- All buttons: padding='Z A', borderRadius='W', cursor='pointer'

### 3. FormField (NEW — reusable)
- file: symbols/components/FormField.js
- export: `FormField`
- extends: 'Flex'
- flexDirection: 'column', gap: 'Y'
- children: Label (tag:'label', color:'textSecondary', fontSize:'Z') + Input slot
- PURPOSE: DRY extraction — ContractDetailPane Form has 5+ identical label+input groups, CreateLeadModal has 6+
- instances override Label.text and Input props per-field

---

## DASHBOARD INTEGRATION

### file: symbols/components/DashboardLayout.js

#### Replace standalone SectionTitle with HeaderRow:
```
HeaderRow: {
  extends: 'Flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  SectionTitle: { tag: 'h2', text: 'Active Pipeline', color: 'white' },
  CreateLeadButton: {}
}
```
- REPLACES existing standalone SectionTitle (line 24)
- Button sits right-aligned next to "Active Pipeline" heading
- Rationale: ProposalKanbanBoard is self-contained data component; placing CTA in DashboardLayout keeps layout separate from data

#### Add modal mount point:
- ADD `CreateLeadModal: {}` at root level (same pattern as existing `ContractFormModal: {}` on line 29)
- Fixed-position overlay controlled by `s.root.isCreateLeadModalOpen`

---

## COMPONENT REGISTRATION

### file: symbols/components/index.js
- ADD: `export * from './FormField.js'`
- ADD: `export * from './CreateLeadButton.js'`
- ADD: `export * from './CreateLeadModal.js'`

---

## FRANK RULES COMPLIANCE CHECKLIST

- [ ] FA301: all color values use design tokens or theme aliases — no raw hex in components
- [ ] FA302: spacing uses letter tokens (V,W,X,Y,Z,A,B,C,D) — no raw px
- [ ] FA304: borderRadius uses tokens — no raw values
- [ ] FA501: no document.querySelector or raw DOM methods
- [ ] FA502: no window.location mutations — use el.router()
- [ ] FA601: extends values are quoted strings
- [ ] FA801: no imports between project component files — reference by PascalCase key
- [ ] FA806: event handlers at top-level (onClick, onInput) — not inside on:{}
- [ ] FA902: components are plain objects — never functions or classes

---

## EXECUTION ORDER

```
STEP 1: state.js — add isCreateLeadModalOpen:false
STEP 2: FormField.js — create reusable form field component
STEP 3: CreateLeadButton.js — create CTA button component
STEP 4: CreateLeadModal.js — create modal with full form
STEP 5: index.js (components) — register all 3 new exports
STEP 6: DashboardLayout.js — replace SectionTitle with HeaderRow, add CreateLeadModal
STEP 7: audit_component() — validate each new component against frank rules
STEP 8: verify_frankability(symbols_dir) — full project bundle check
STEP 9: manual browser test — open modal, fill form, submit, verify Lead column updates
STEP 10: Jest tests — add CreateLeadModal unit tests
```

---

## TEST PLAN

### file: CreateLead.test.js (root)
```
describe('CreateLeadModal Structure')
  - extends Flex
  - display reactive to s.root.isCreateLeadModalOpen
  - Dialog child has Header, ClientSelect, ProjectTitle, MonthlyValue, DurationMonths, StartDate, Actions
  - Actions has Cancel and CreateLead children

describe('CreateLeadButton')
  - extends Flex
  - text is '+ New Lead'
  - has onClick handler

describe('State Integration')
  - isCreateLeadModalOpen defaults to false
  - new project pushed with status='Lead'
  - project shape matches existing entity: {id,clientId,title,status,monthlyValue,durationMonths,startDate}

describe('DashboardLayout Integration')
  - BottomSection has HeaderRow with SectionTitle and CreateLeadButton
  - CreateLeadModal exists at DashboardLayout root
```

---

## VALIDATION GATES

1. `audit_component(code)` on each new .js file before writing
2. `verify_frankability('/Users/g.allenjohnson/Desktop/dev/ContractorPipeline/symbols')` after all files written
3. `npm test` — all existing 27 tests pass + new tests pass
4. Browser verification at localhost:1234:
   a. button visible on dashboard near Lead column
   b. click opens modal with correct styling
   c. form submission creates project visible in Lead column on kanban
   d. navigating to /lead page shows new lead in ContractListPane
   e. selecting new lead shows it in ContractDetailPane
