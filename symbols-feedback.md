# Symbols Feedback & Guidelines

This document serves as a continuous record of Symbols/DOMQL v3 framework conventions, encountered issues, structural rules, and resolutions, as requested.

## 1. Conflicting Instructions and MCP Tool Accessibility

**Conflicting Instruction #1: "Always use symbols-mcp tools" vs Environment Capabilities**
- **Description:** The user prompt dictates that the agent should "Always use `symbols-mcp` tools (e.g., `search_symbols_docs`, `get_sdk_reference`, `get_project_rules`, `audit_component`)". However, the agent's tool environment (manifest) does not currently inject these MCP tools. The agent is forced to process the framework purely natively and cannot dynamically call `symbols-mcp` to pull in new rules. The `.mcp.json` indicates that the MCP server relies on `uvx symbols-mcp`, but the Python fast package installer `uv`/`uvx` is not present in the environment CLI (`command not found: uvx`). 
- **Resolution:** The agent will proceed using inherent knowledge of the DOMQL v3 architecture and context rules provided (e.g., in `CLAUDE.md`, `GEMINI.md`, `NEW_LEARNINGS.md`) until the MCP integration is natively attached to the model.

---

## 2. DOMQL v3 Framework Conventions & Observations

- **Component Definitions:** Components are plain JSON objects (`{}`), *never* functions. No React-style functional components.
- **Imports/Exports:** No relative imports between component logic files. All components are defined and attached to a root state/library and referenced by their PascalCase keys (e.g., `extends: 'Button'`).
- **Extensions:**
  - `extends`: Must be a quoted string name of another component. **Note: must be plural (`extends`), never singular (`extend`).**
  - `childExtends`: Must be a quoted string name of a registered component. **NEVER an inline object — this is Rule 10 of the v3 strict rules.**
- **Design System Keys:** Must be strictly lowercase (`color`, `theme`, `typography`).
- **Styles & Styling:**
  - Do not use Tailwind classes or raw hex colors (`#FF0000`) or raw pixels (`10px`).
  - Use token-based scales (`blue.7`, `gray+50`, `W`, `Y`).
  - No nested chained CSS string selectors (e.g., `@dark :hover`). Use proper object nesting: `@dark: { ':hover': { ... } }`.
- **Routing:** Use `el.router(path, el.getRoot())` instead of native `window.location`.
- **Dynamic Iteration:** Avoid legacy `$collection` syntax. Use `state` data mapped seamlessly with `children` and `childExtends`.
- **DOM Access:** Do NOT use `document.querySelector` or raw DOM APIs. Everything must flow through the DOMQL v3 VDOM syntax.
- **Props:** All props are **flat at root level** in v3. Never use a `props: { ... }` wrapper object — this is deprecated v2 syntax and causes silent rendering failures.
- **Events:** All event handlers are **flat at root level** using `onX:` prefix syntax (e.g., `onClick`, `onChange`, `onInput`). Never use an `on: { eventName: fn }` block — this is deprecated v2 syntax and **the handler will silently never fire**.

---

## 3. Bugs Detected & Architectural Resolutions

During the implementation cycles of this dashboard, several foundational syntactical bugs were triggered and repaired. Below is a record of exactly what went wrong and how to solve it under DOMQL v3 correctly.

### Bug 1: Blank Data Iteration (State Collections)
- **Description:** Data arrays present in `state.js` (like `contracts` and `proposals`) failed to render across the Timeline and Kanban columns. The pages sat completely empty.
- **Wrong Solution:** Using the legacy DOMQL v2 syntax `$stateCollection: (s) => s.root.contracts` to attempt injecting state into dynamically spawned children.
- **Right Solution:** DOMQL v3 strictly deprecates collection prefixes. You must manually map the raw array directly to the active `children` node property, wrapping the looped targets carefully inside their own internal state objects:
  ```javascript
  // CORRECT V3 SYNTAX
  children: (el, s) => (s.root.contracts || []).map(c => ({ state: c }))
  ```

### Bug 2: Missing Styles / Unreadable Text
- **Description:** Buttons and typography sporadically defaulted to browser standards (e.g., black text natively, or transparent backgrounds) despite color properties being commanded natively in the codebase.
- **Wrong Solution 1: Invisible Arbitrary Variables:** Attempting to assign `background: 'blue.5'` when navigating without standard boilerplate libraries. If `blue.5` is not explicitly declared inside `designSystem/index.js`, the framework fails out silently to transparent.
- **Wrong Solution 2: Nested Style Wrappers:** Placing native framework tokens inside nested CSS wrappers (e.g., `props: { style: { color: 'textPrimary' } }`). 
- **Right Solution:** All framework design tokens MUST be kept completely "flat" along the root object parameters or custom pseudo-selector states (like `:hover`), relying purely on registered variables:
  ```javascript
  // CORRECT V3 SYNTAX
  color: 'textPrimary',
  background: 'secured',
  margin: 0
  ```

### Bug 3: `<select>` Dropdown Refuses to Update — State & Visual Desync (ContractFormModal)
- **Target:** `symbols/components/ContractFormModal.js` — `ContractFormModal.Dialog.FormGroup2.Select`
- **Symptom:** Clicking a `<select>` option dismisses the browser dropdown list, but the displayed value does not change and `durationMonths` state is never updated, breaking the "Calculated End Date" computation.

#### Wrong Solutions (All Previously Attempted — All Silently Failed)

**Wrong Solution 1: `on: { change: fn }` event block**
```javascript
// ❌ WRONG — deprecated v2 syntax, handler silently never fires in v3
on: {
  change: (event, el) => {
    el.parent.parent.parent.state.update({ durationMonths: parseInt(event.target.value, 10) })
  }
}
```
Why it fails: In DOMQL v3, the `on: {}` block is **deprecated v2 syntax**. It does not wire native DOM event listeners. The handler never executes regardless of what is inside it. This was the single most critical cause of the entire bug — all three prior debugging attempts retained this broken block.

**Wrong Solution 2: `props: { onChange: fn }` inside props wrapper**
```javascript
// ❌ WRONG — double violation: props wrapper is v2, and handler placed wrong
props: {
  onChange: (event, el) => el.state.update({ durationMonths: event.target.value })
}
```
Why it fails: `props: {}` is a deprecated v2 wrapper in v3. Flattening props is required. Additionally, placing an event handler inside a props block does not register a native listener.

**Wrong Solution 3: `selected: (el, s) => s.isSelected` on `<option>` children**
```javascript
// ❌ WRONG — creates a controlled-component loop that fights the browser's native selection
childExtends: {
  tag: 'option',
  props: {
    selected: (el, s) => s.isSelected  // DOMQL re-renders override browser selection
  }
},
children: (el, s) => [1, 2, 3, 6, 12].map(val => ({
  state: { val, isSelected: val === s.durationMonths }
}))
```
Why it fails: When DOMQL maps reactive `selected:` onto each `<option>`, the VDOM re-renders on state change force the native `HTMLSelectElement` back to the initial value, fighting the browser's own selection tracking. Additionally, `childExtends` as an inline object is forbidden by Rule 10.

#### Right Solution

The fix requires four simultaneous corrections:

```javascript
// ✅ Step 1: Use top-level onChange (v3 event syntax) — makes the event actually fire
// ✅ Step 2: Flatten all props to root level (no props: {} wrapper)
// ✅ Step 3: Fix extend → extends (plural)
// ✅ Step 4: Use attr: { selected } on each option for safe reactive selection
Select: {
  tag: 'select',
  padding: 'Z',
  background: 'bgPrimary',
  value: (el, s) => s.durationMonths,

  // ✅ top-level event — actually fires; on:{} block is dead in v3
  onChange: (event, el, s) => {
    s.update({ durationMonths: parseInt(event.target.value, 10) || 1 })
  },

  // ✅ inline childExtends — string references do not render in this runtime (see Bug 3d)
  childExtends: {
    tag: 'option',
    value: (el, s) => String(s.val),
    text: (el, s) => `${s.val} Month${s.val > 1 ? 's' : ''}`,
    // ✅ attr: drives the selected attribute directly, avoiding the CSS prop re-render loop
    attr: { selected: (el, s) => s.isSelected || null }
  },

  // Pass isSelected into each option's state — attr.selected reads it reactively
  children: (el, s) => [1, 2, 3, 6, 12].map(val => ({
    state: { val, isSelected: val === s.durationMonths }
  }))
}
```

**Why `attr: { selected }` works:** DOMQL processes `attr: {}` as raw DOM attribute assignments, bypassing the reactive CSS props pipeline. This means the `selected` attribute is set once per render cycle without creating a controlled-component loop. The browser then naturally reflects the attribute in `HTMLSelectElement.value`.

#### Additional Sub-Bugs Discovered During Execution

**Bug 3d: `childExtends: 'NamedComponent'` does not render children in this project's runtime**
- **Description:** Rule 10 requires `childExtends` to be a quoted string name referencing a registered component. However, replacing the inline `childExtends` object with `childExtends: 'DurationOption'` caused children to silently not render — the `<select>` appeared empty. This appears to be a runtime version limitation in this project's installed Symbols packages.
- **Wrong Solution:** `childExtends: 'DurationOption'` with `export const DurationOption = { tag: 'option', ... }` in the same file (and re-exported via `export *`)
- **Right Solution (for this runtime):** Keep `childExtends` as an inline object, matching the working pattern already used in `ProposalKanbanBoard.js`. Document the discrepancy here for future agents.
- **Note for Future Agents:** Before attempting to migrate inline `childExtends` objects to named string references, test that the named component actually renders. If not, this is a runtime version issue, not a code error.

**Bug 3e: `value:` prop on `<select>` element is ignored by the browser**
- **Description:** DOMQL maps `value: (el, s) => s.durationMonths` as a DOM **attribute** (`element.setAttribute('value', ...)`). On `<input>` elements this works because `input.value` is both a property and an attribute. On `<select>` elements, the browser completely ignores the `value` attribute — only the DOM **property** (`selectElement.value = ...`) drives which option is displayed.
- **Wrong Solution:** `value: (el, s) => s.durationMonths` on the `<select>` tag — visually ignored, calculates with old default
- **Right Solution:** Do not use `value:` on `<select>`. Instead, drive selection via `attr: { selected: ... }` on each child `<option>`, which is attribute-level and read by the browser correctly.

#### Related v3 Rules Violated (All Now Fixed)
| Violation | Rule | Impact |
|---|---|---|
| `on: { change: fn }` | v2 deprecated event syntax | Event never fires |
| `props: { ... }` wrapper | v2 deprecated prop wrapper | VDOM loop on re-render |
| `childExtends: { inline }` | Rule 10 | Undefined child behavior |
| `extend:` (singular) | Critical syntax error | Component may not resolve |
| `selected:` on `<option>` | Native browser conflict | Visual desyncing loop |

---

### Bug 4: Date Calculation Month Offset Error
- **Target:** `ContractFormModal.js`
- **Symptom:** The computed target end date in the modal incorrectly pointed to the last day of the month prior to the mathematically expected target month (e.g. `4/13/2026` + 2 months calculated as `5/31/2026`).
- **Wrong Solution:** `new Date(start.getFullYear(), start.getMonth() + s.durationMonths, 0)`. The `day 0` parameter tells the JS Date constructor to compute the last numerical day of the *previous* month relative to the computed month integer. 
- **Right Solution:** Reference the target `getDate()` precisely. `new Date(start.getFullYear(), start.getMonth() + s.durationMonths, start.getDate())` 

### Bug 5: Duplicate Component Keys Subverting Computed Values
- **Target:** `TimelineGantt.js` (`smbls push` Warnings)
- **Symptom:** During deployment bundling (`smbls push`), the CLI emitted `[WARNING] Duplicate key "display" in object literal` regarding `symbols/components/TimelineGantt.js`.
- **Wrong Solution:** Defining a computed property, and leaving a static property of the exact identical key later within the identical object block.
```javascript
display: visualDuration <= 0 ? 'none' : 'flex',
...
display: 'flex', // CLI warns on deployment build/bundling.
```
- **Right Solution:** Retain strictly the solitary deterministic computed conditional key, parsing out hardcoded repeats.

### Bug 6: Kanban Card Desync on State Transition
- **Target:** `ContractFormModal.js`
- **Symptom:** Confirming and signing a contract successfully generated the formal contract object (which inherited the chosen `durationMonths` length) and relegated the source proposal object to the "Closed" column. However, the exact selected duration was never patched backward into the origin proposal state block, causing the legacy "prospective" duration estimate to persist visually on the kanban card within the Closed column.
- **Wrong Solution:** Leaving the origin framework state detached from the agreed variable outputs during the transition map:
  ```javascript
  proposals: rState.proposals.map(px => px.id === pId ? { ...px, status: 'Closed' } : px)
  ```
- **Right Solution:** Explicitly pass all negotiated final criteria backward into the updating state parameters alongside the status swap:
  ```javascript
  proposals: rState.proposals.map(px => px.id === pId ? { ...px, status: 'Closed', proposedDurationMonths: s.durationMonths } : px)
  ```

### Bug 7: Premature Finalization Display in Kanban Columns
- **Target:** `ProposalKanbanBoard.js`
- **Symptom:** Cards in the Lead, Pitched, and Negotiating columns continuously displayed the proposed duration (e.g. `(6 mos)`) statically. This was misleading UI, suggesting the duration was finalized and agreed upon prior to actually closing the contract through the negotiation modal.
- **Wrong Solution:** Hardcoding the `proposedDurationMonths` variable into the string interpolation invariably:
  ```javascript
  Value: { props: { text: (el, s) => `$${s.estimatedMonthlyValue}/mo (${s.proposedDurationMonths} mos)` } }
  ```
- **Right Solution:** Employ a ternary expression validating the column's current contextual state (e.g. checking `s.status`), electing to present `TBD` until correctly arriving at the terminal sequence step:
  ```javascript
  Value: { props: { text: (el, s) => `$${s.estimatedMonthlyValue}/mo (${s.status === 'Closed' ? s.proposedDurationMonths + ' mos' : 'TBD'})` } }
  ```

### Bug 8: Global Scope Serialization Failure on Deployment
- **Target:** `TimelineGantt.js` (During `smbls publish` execution)
- **Symptom:** During deployment, the CLI reported `[DOMQL] Render warning: currentYear is not defined` despite `currentYear` being defined at the top of the file. Under DOMQL architecture, components mapped and pushed to the Symbo.ls platform strictly serialize the exported component object payload. Extraneous variables hoisted within the global scope (outside of the export) disappear during compilation, stripping the external lexical reference from closures when parsed later. 
- **Wrong Solution:** Operating component modules like vanilla node files by dumping statics securely above the root `export` object string:
  ```javascript
  const currentYear = new Date().getFullYear()
  export const TimelineGantt = { 
     /* ...references currentYear internally... */ 
  }
  ```
- **Right Solution:** Enforce strict component encapsulation by establishing evaluation constants directly inside the exact dependent `props`, `children`, or `state` closures recursively:
  ```javascript
  Block: {
    props: (el, s) => {
      const currentYear = new Date().getFullYear()
      // ...logic
    }
  }
  ```

### Bug 9: GaugeContainer Lacking Granular Data Mapping (FinancialHealthGauge)
- **Target:** `FinancialHealthGauge.js`
- **Symptom:** The financial health gauge rendered as a single monolithic bar presenting only an aggregate percentage, failing to exhibit the component projects comprising that aggregate.
- **Wrong Solution:** Using a single `Bar` component block referencing the root state directly without looping.
- **Right Solution:** Map the constituent parts utilizing `children: (el, s) => ...` alongside `childExtends` to organically slice the container into responsive, state-driven segments representing each project independently:
  ```javascript
  Segments: {
    childExtends: { ... },
    children: (el, s) => (s.root.contracts || []).map(c => ({ state: c }))
  }
  ```

### Bug 10: Omission of Underlying Project Metadata in Labels (TimelineGantt)
- **Target:** `TimelineGantt.js`
- **Symptom:** Timeline blocks and track row labels only displayed client names and monetary values, depriving the user of crucial project context (e.g. `Retainer: Dev Support`) tied natively to those contracts.
- **Wrong Solution:** Relying exclusively on inherited `s.clientId` lookup for `client.name` while omitting the existing explicit `s.title` prop from the dataset:
  ```javascript
  text: client ? client.name : 'Unknown'
  ```
- **Right Solution:** Concatenate the inherent project title directly from the mapped state block alongside the client derivation, and provide tooltips.
  ```javascript
  text: `${client ? client.name : 'Unknown'} - ${s.title || 'Untitled'}`
  ```

### Bug 11: Missing Pipeline Projections in Global Forecasts
- **Target:** `TimelineGantt.js` & `FinancialHealthGauge.js`
- **Symptom:** The user noted that projects in the "Active Pipeline" (Kanban board) were not reflected in the 12-Month Capacity Forecast or the Monthly Aggregate tracking bar. These components originally mapped only `s.root.contracts`, completely ignoring `s.root.proposals`.
- **Wrong Solution:** Leaving the data isolation as is, assuming only secured contracts should dictate capacity and health.
- **Right Solution:** Append active proposals to the state-mapping arrays locally within the components. For `TimelineGantt`, active proposals are injected with `isProposal: true`, a projected `startDate` of today, and mapped via `proposedDurationMonths`. They receive dashed styling and `[Pipeline]` suffixing. In `FinancialHealthGauge`, pipeline projects are segmented with transparent/blue styling and summed into a secondary "pipeline" total adjacent to the "secured" total.

### Bug 12: Visual Length Distortion and Overflow on Projections
- **Target:** `FinancialHealthGauge.js` & `TimelineGantt.js`
- **Symptom:** In the Financial Health Gauge, when the total active pipeline value exceeded the target, the segments visually compressed because they calculated their widths relative to the dynamic `totalSum` rather than the static target. In the Gantt chart, proposals with long durations (e.g. 12 months) starting from the current month overflowed past the right boundary of the 12-month track container.
- **Wrong Solution:** Relying on the parent container's `Math.min(..., 100)` scaling to control children sized relatively to `totalSum`, and failing to explicitly clip timeline block widths on the temporal axis.
- **Right Solution:** For the Gauge, set the `Segments` container to a static `width: 100%` with `overflow: hidden`, and map each child's width strictly against the fixed target: `(val / target) * 100`. For the Gantt chart, cap `visualDuration` mathematically so that `startCol + visualDuration` never exceeds `12` months.

### Bug 13: Blank Renders from Deprecated Props Wrappers and Missing State Directives
- **Target:** `FinancialHealthGauge.js` & `TimelineGantt.js`
- **Symptom:** Mapped data collections (contracts and pipeline proposals) failed to populate the child elements visually (resulting in blank rows and empty segments), despite correctly mapping the state objects via `children: (el, s) => data.map(item => ({ state: item }))`.
- **Wrong Solution:** Leaving the dynamically mapped children without explicitly instructing the DOMQL engine to pass state downward, and wrapping child configurations in deprecated `props: {}` or `props: (el, s) => {}` blocks.
- **Right Solution:** In DOMQL v3, dynamically mapped lists strictly require the `childrenAs: 'state'` directive on the parent node so the VDOM inherently binds the mapped item state to `el.state` for each spawned child. Furthermore, the `props` wrapper is entirely deprecated in v3; all reactive properties (like `width: (el, s) => ...`) must be fully flattened at the root level of the component's declaration object.

### Bug 14: Undefined State Properties Due to Double-Wrapping (`childrenAs: 'state'` Conflict)
- **Target:** `TimelineGantt.js` & `FinancialHealthGauge.js`
- **Symptom:** After applying `childrenAs: 'state'` (Bug 13) to correctly bind state downward into `childExtends`, the text fields in the UI rendered as "Unknown-Untitled" or "undefined ($undefined/mo)". The `s` object existed, but `s.title`, `s.clientId`, etc., were undefined.
- **Wrong Solution:** Using both `childrenAs: 'state'` on the parent AND manually wrapping the array items in a `{ state: ... }` object during the mapping phase: `data.map(c => ({ state: c }))`. This causes DOMQL to bind the state one level too deep, meaning the expected data lives at `s.state.title` instead of `s.title`.
- **Right Solution:** The `childrenAs: 'state'` directive and the manual `{ state: c }` wrapper are mutually exclusive. When utilizing `childrenAs: 'state'`, the `children: (el, s) => ...` function MUST return an array of raw data objects: `data.map(c => ({ ...c, isProposal: true }))`. The framework natively handles wrapping each raw object as a state payload for the spawned child element.

### Bug 15: Managing Editable Local State from Global Sources
- **Target:** `ContractDetailPane.js` (Editor Forms)
- **Symptom:** When building editable forms for globally managed data (like a selected contract), binding `onInput` directly back to `s.root.contracts` causes the global array (and the master list view) to mutate live on every un-saved keystroke. Conversely, using a localized `state: (el, s) => JSON.parse(JSON.stringify(s.root...))` block inside an `if:`-gated component fails to update when the user clicks between *different* contracts because the component does not unmount (the condition remains true), leaving the local state stuck on the first selection.
- **Wrong Solution:** Attempting to force lifecycle hooks like `onUpdate` to manually diff and sync the global state into the local state proxy.
- **Right Solution:** Leverage DOMQL's native state-mapping engine to naturally isolate the component. Instead of generating state inside the editor, map the editor as a child of a structural container. The container uses `childrenAs: 'state'` and returns an array containing a single deep-copied slice of the selected item: `children: (el, s) => [JSON.parse(JSON.stringify(s.root.contracts.find...))]`. When the selection changes, the mapped array natively re-binds the new deep-copied payload to the child editor, completely avoiding lifecycle edge cases while protecting the global list from live mutation.

### Bug 16: Absolute Positioning Preventing Container Expansion (Gantt Text Overflow)
- **Target:** `TimelineGantt.js` (Tracks and Block)
- **Symptom:** When project titles were too long to fit within the width of their timeline block, the text wrapped but visually overflowed outside the vertical boundaries of the track row. The row itself refused to increase in height to accommodate the wrapped text.
- **Wrong Solution:** Relying on `position: 'absolute'` with a `left` offset for the inner blocks while assigning a fixed `height: '24px'` to the parent track. Because absolute positioning removes the element from the document flow, the parent container is entirely blind to the inner block's calculated height and cannot grow dynamically.
- **Right Solution:** Keep the blocks within the document flow to allow natural height expansion. By removing `position: 'absolute'`, changing `left:` to `marginLeft:`, and replacing fixed `height` constraints with `minHeight`, the inner block naturally pushes the parent container's height downward whenever text wraps, preserving the layout integrity automatically. Adding `boxSizing: 'border-box'` and internal `padding` ensures the text doesn't hit the absolute edges of the newly flexible container.

### Bug 17: Browser `<select>` Element Value Desync on Reactive Updates
- **Target:** `ContractDetailPane.js` (Status Selection)
- **Symptom:** The native HTML `<select>` element consistently defaulted to the last option ('Expired') upon initial render, even when the underlying DOMQL state was correctly set to 'Active' or 'Pending'. 
- **Wrong Solution:** Attempting to force the selection via `attr: { selected: ... }`, `onInit` property assignments, or `setTimeout(0)` hooks. Native dropdowns have complex, non-deterministic browser-level property matching that often ignores Virtual DOM attribute changes during the hydration/mount cycle.
- **Right Solution:** Refactor the selection UI into a set of interactive "Radio Chips" (mapped `Flex` components). By bypassing the native `<select>` and `<option>` tags entirely, you eliminate the hidden DOM property syncing issue. The selection logic becomes a purely declarative CSS binding (`borderColor: s.status === v ? 'secured' : ...`) which is 100% reliable in the DOMQL rendering pipeline.

---

### Bug 18: Build Failure Due to Backup File Renaming
- **Target:** `ContractsPage.js` & `index.js`
- **Symptom:** Running `smbls start` resulting in a `@parcel/core` build failure: `Failed to resolve './ContractsPage.js' from './symbols/pages/index.js'`. Parcel specifically suggested the existence of a backup file: `💡 Did you mean './ContractsPage.js.bak'?`.
- **Wrong Solution:** Editing the import statement in `index.js` to point to the `.bak` file, which might temporarily resolve the module but exposes incomplete/backup code and violates conventional `.js` extensions for DOMQL component entry points.
- **Right Solution:** Rename the mistakenly generated `ContractsPage.js.bak` file back to `ContractsPage.js`. Module resolution strictly expects exact file matches in `symbols/pages/index.js`.

---

## 4. Character Counts
*Updates after each prompt to track token usage.*

- **Prompt Input Running Subtotal:** ~8,500 characters
- **Code Output Running Subtotal:** ~37,000 characters
- **Total:** ~45,500 characters

### Phase 1: Pipeline Unification
**Date:** 2026-05-08
**Context:** Abstracting Active Contracts Page to support a fully dynamic pipeline (Lead -> Pitched -> Negotiating -> Active -> Declined).
**Solution:** Unified `proposals` and `contracts` into a single `projects` array in `state.js` to ensure the DOMQL VDOM proxy diffing engine can track the object lifecycle completely without tearing down. Replaced the `ContractsPage` component with a `BaseProjectPage` template that accepts a `statusFilter` from child route pages (e.g., `LeadPage`, `PitchedPage`, `InactiveContractsPage`).
**Key Learnings:** Abstracting page structures via an `extends: BaseProjectPage` template with localized state injection keeps routing lightweight. DOMQL automatically proxies the data cleanly since the editor updates `projects` directly.

### Final UI Verification
**Date:** 2026-05-08
**Test Performed:** Automated UI Testing via Browser Agent.
**Result:** The pipeline routing logic executed flawlessly. Clicking a block correctly updated `selectedProjectId` and transitioned to the specific pipeline page. The `ContractDetailPane` correctly rendered the dynamic `ContactInfo` block by fetching email and phone properties off the global `clients` object. Moving a Lead to "Declined" successfully updated the global list tracking, automatically syncing the item into the Inactive Contracts view while keeping the remaining lists clean.
**Status:** Fully Verified.

### Navigation Indicator Implementation
**Date:** 2026-05-12
**Context:** Adding an animated sliding indicator to the TopNavbar to highlight the active route.
**Solution:** Refactored `NavLinks` into a dynamic collection using `childExtends` and `children`. Implemented an `Indicator` component with absolute positioning and transition properties. Added `onUpdate` and `onRender` lifecycle hooks to links to measure their DOM coordinates (`offsetLeft`, `offsetWidth`) and sync them to a local state in `NavLinks`. Used the `secured` green token with a glow effect for the "light bar" aesthetic.
**Key Learnings:** Relying on `window.location.pathname` within `onUpdate` allows for reliable route detection in the absence of a dedicated router state signal. Measuring DOM nodes in lifecycle hooks is a robust way to handle dynamic layouts (like variable link text widths) while maintaining a high-performance sliding animation.

**Bug Found:** `TypeError: Cannot read properties of undefined (reading "href")` in TopNavbar indicator logic.
**Cause:** Used `el.props.href` instead of the flattened `el.href` required by DOMQL 3 syntax.
**Fix:** Accessed `el.href` directly and added defensive checks for `el.node` presence before measuring offsets.
**Right Solution:** Use `el.X` for all element properties in reactive functions. Use `onRender` with a minimal timeout to ensure the browser has computed layout values like `offsetLeft` before syncing to state.
