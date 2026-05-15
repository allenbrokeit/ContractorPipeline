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

**Bug Found:** Lightbar animated from 0 on every page load ("races into position from the left").
**Cause:** The TopNavbar was destroyed and re-mounted on every page load because it is nested inside individual page components via DashboardLayout. Local component state resets to 0 upon remount.
**Fix:** Moved indicator position tracking (`indicatorLeft`, `indicatorWidth`) to the global root state (`s.root`). Additionally, conditionally disabled the CSS transition if `indicatorInitialized` is false to prevent the initial load animation from 0, allowing for seamless transition from previous layout state.

### Kanban Card Routing
**Date:** 2026-05-12
**Context:** Allowing users to click a card on the Kanban board to navigate to the specific contract details page.
**Solution:** Added an `onClick` event to the `Cards` childExtends wrapper in `ProposalKanbanBoard.js`. This handler updates the global `s.root.selectedProjectId` and calls `el.router()` with the corresponding status route (e.g., `/lead`, `/pitched`, `/negotiating`). To prevent the existing card action buttons (e.g., "Pitch", "Negotiate") from also triggering the navigation, `event.stopPropagation()` was added to their `onClick` handlers.
**Key Learnings:** Relying on the global root state to hold `selectedProjectId` makes navigating between different list views and detail panes seamless, as the destination pane simply reads the pre-selected ID upon mount. `event.stopPropagation()` remains fully functional and crucial in DOMQL when nesting interactive components.

**Bug Found:** Action buttons inside Kanban cards disappeared when dynamic array mapping was modified.
**Cause:** Attempted to dynamically render an array of children components using the `children` property and returning raw JS objects (e.g., `[{ label: 'Pitch', actionContent: 'Pitched' }]`). In DOMQL 3, when mapping an array to create child elements, if the component expects to read from state (e.g., `s.label`), raw objects are not automatically assigned as the component's state unless properly structured.
**Wrong Solution:** Returning raw objects `[{ label: 'Pitch', actionContent: 'Pitched' }]` from the `children` function without a state wrapper. This resulted in `s.label` resolving to `undefined` because the state was not properly injected, causing the buttons to render empty and invisible.
**Right Solution:** Wrap the mapped data in a `state` object property: `[{ state: { label: 'Pitch', actionContent: 'Pitched' } }]`. By explicitly assigning the `state` key within the returned array items, DOMQL correctly initializes each child element's local state, allowing bindings like `(el, s) => s.label` to function flawlessly.

### Editable Contact Info Details
**Date:** 2026-05-13
**Context:** Adding inline editing functionality to the Contact Information in the Project Details page.
**Solution:** Refactored the `ContactInfo` block in `ContractDetailPane.js` to manage a local state (`isEditing: false`, `email`, `phone`). Added an Edit/Save toggle button. Created conditional `DisplayMode` and `EditMode` components that swap between static text and interactive inputs. 
**Key Learnings:** DOMQL's reactive architecture seamlessly handles inline editing. Grabbing the latest values (`s.email`, `s.phone`) from the local state and applying them globally (`s.root.update({ clients: updatedClients })`) instantly syncs the UI back to display mode without manual DOM manipulation. Fetching relational data dynamically within the `onClick` handler via `el.getRootState()` guarantees we update the correct `clientId`.

### Contact Info Validation & Formatting
**Date:** 2026-05-13
**Context:** Adding real-time input sanitization, formatting, and pre-save validation to the editable contact fields.
**Solution:** Added `emailError` and `phoneError` flags to the `ContactInfo` local state. Bound an `onInput` handler to `EmailInput` to strip whitespace and enforce lowercase. Bound an `onInput` handler to `PhoneInput` that strips non-digits and dynamically rebuilds the string in international chunked format (`+C AAA SSS SSSS`). Within the "Save" `onClick` handler, validated the state using strict regex patterns before allowing a global state merge. Invalid inputs abort the save and turn the input borders red.
**Key Learnings:** Relying on DOMQL's `onInput` combined with `s.update()` provides instant "as-you-type" formatting without any external libraries. Pre-save validation safely gates global state mutations.

### Contact Info Formatting Bug Fix
**Date:** 2026-05-13
**Context:** Fixing phone number formatting logic that was scrambling raw digit inputs (producing incorrect artifacts like `+116753...`) during rapid typing.
**Solution:** Removed real-time input formatting from the `onInput` handler (which was causing uncontrollable cursor jumping and digit interleaving). Updated the logic to only save raw user strokes into the local state. Handled the heavy formatting (appending `+1`, `( )`, and `-`) dynamically within the `onBlur` event of the input, and within the `Save` button`s `onClick` execution using standard DOMQL syntax.
**Key Learnings:** Never format the string values inside DOMQL `onInput` events directly unless using an explicit input masking tool, as `s.update()` completely swaps the DOM node value, forcing the browser`s cursor to jump to the end of the text line leading to chaotic interleaving during continuous typing.

### Routing and Empty State Enhancements
**Date:** 2026-05-13
**Context:** Fixing navigation bug where a selected project details view remained open across different project pipeline phases (e.g., Lead -> Pitched) instead of resetting. Enhancing the empty state UX.
**Solution:** Added an explicit `onClick` override to the `NavLink` component that clears `s.root.selectedProjectId` from the global state, alongside explicitly calling `e.preventDefault()` and `el.router()` to maintain the single-page application router transition cleanly without triggering native page reloads. Upgraded the `Placeholder` component within `ContractDetailPane` to include a structured, professional layout (Visual Icon, Title, Subtitle) to improve user affordance.
**Key Learnings:** When extending a DOMQL `Link` and defining a custom `onClick` method to run side-effects (like clearing state), it is critical to invoke `e.preventDefault()` and manually call the internal `el.router(el.href, el.getRoot())` method. Otherwise, DOMQL will drop the SPA transition and cause a full browser reload.

### Global Array Reactivity & Reference Replacement
**Bug:** Updating an array in a global root state (`rootState.update({ clients })`) does not automatically trigger deep re-rendering of computed property functions (`text: (el, s) => ...`) if they don't explicitly subscribe to it, unless the component itself is re-mounted. 
**Solution:** Relying on the natural remount of switching modes (e.g. `isEditing: false`) naturally forces the `DisplayMode` component to execute its computed functions again, picking up the new global state correctly. When modifying arrays, always map and return entirely new object references for modified items.

### DOMQL `<option>` value bindings
**Bug:** Binding `value: (el, s) => s.id` directly on a child component extending `<option>` fails to set the native HTML attribute. When a user selects it, the `<select>` emits the text of the option instead, causing data lookup failures.
**Solution:** Always use `attr: { value: (el, s) => s.id }` for native HTML elements like `<option>` to ensure the DOM interprets it correctly. Additionally, it is best practice to bind `selected: (el, s) => el.parent.state.value === s.id` within the same `attr` block.

### Phone Formatting with Dynamic Country Codes
**Bug:** Tying subscriber digit masking logic (e.g., `(XXX) YYY-ZZZZ`) strictly to a single country code check (`if (country.code === '+1')`) breaks user expectations when they enter 10-digit numbers for other international regions, resulting in raw block chunking (`4151 2345 67`).
**Solution:** Completely uncouple subscriber digit formatting from the country dialing code length. Extract the country prefix first (`formatted = country.code`), then evaluate the length of the remaining subscriber digits (`digitsOnly.length`). Apply the `(XXX) YYY-ZZZZ` format globally to any 10-digit number regardless of region, ensuring a predictable and localized experience.

### Native HTML Boolean Attributes in DOMQL
**Bug:** In native HTML, boolean attributes (such as `selected`, `disabled`, `checked`) evaluate as true if the attribute merely exists on the DOM node (e.g., `<option selected="false">` behaves as `true`). If DOMQL dynamically assigns `selected: (el, s) => s.isActive` and the evaluation is `false`, it may still write the attribute into the DOM as `selected="false"`. If applied inside an array iterator (like `<select>` options), the browser will parse all options as 'selected' and visually default to the very last option rendered in the array.
**Solution:** When managing native boolean HTML attributes conditionally in DOMQL, never return `false`. You must strictly return `null` when the condition is false (e.g., `selected: (el, s) => s.isActive ? true : null`). Returning `null` instructs DOMQL's VDOM to safely strip the attribute entirely from the native node.

### Native Controlled Inputs & Financial Formatting
**Bug:** Utilizing `<input type="number">` natively blocks rendering formatted localized currency text (e.g., inserting commas like `50,000`), restricting data to raw floats/integers. 
**Solution:** Change `type` to `"tel"` (or `"text"`) to allow raw string manipulation and trigger numeric keyboards on mobile. Then intercept keystrokes via `onInput` by passing the string through a regex stripper (`e.target.value.replace(/\D/g, '')`) before pushing raw `parseInt` data to the state. The input's `value` can then be safely passed through `new Intl.NumberFormat('en-US').format(val)` to render beautifully. 
**Note (Known Limitation):** Because the input's string length dynamically changes when commas are naturally injected during typing, standard DOM reconciliation often resets the native cursor position to the extreme right of the text. This is a common acceptable behavior for small currency threshold inputs, but complex forms require manual cursor-position tracking via native DOM APIs to fully resolve.

### Responsive Hamburger Menu — Pseudo-Element Reactivity Constraints
**Bug:** Attempted to use `::after` pseudo-element with a reactive `transform` function to create a slide-in lightbar for mobile nav links. In DOMQL, pseudo-element CSS blocks (e.g., `'::after': { transform: (el, s) => ... }`) are treated as static CSS declarations — their properties are NOT re-evaluated on state changes the way inline element styles are. This means the lightbar would never reactively slide in or out when the active route changed.
**Wrong Solution:**
```javascript
'::after': {
  transform: (el, s) => isActive ? 'scaleX(1)' : 'scaleX(0)' // NEVER re-evaluated
}
```
**Right Solution:** Replace the pseudo-element with a real DOMQL child element (`ActiveBar`) placed inside the link component. Real child elements have full lifecycle access and their style properties are properly reactive:
```javascript
ActiveBar: {
  position: 'absolute',
  bottom: '0',
  left: '0',
  width: '100%',
  height: '2px',
  transformOrigin: 'left',
  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: (el, s) => {
    const isActive = /* route matching logic */
    return isActive ? 'scaleX(1)' : 'scaleX(0)'
  }
}
```

### Jest + DOMQL ESM Components — CJS/ESM Interop
**Bug:** Attempting to `import()` DOMQL component files (which use `export const`) from Jest test files triggers `Unexpected export statement in CJS module` errors. Jest defaults to CJS module resolution, and even with `--experimental-vm-modules`, the `cjs-module-lexer` fails to parse ESM exports.
**Wrong Solution:** Using `await import('./symbols/components/TopNavbar.js')` inside `beforeAll()` — this still fails because Jest's transform pipeline tries to parse the file as CJS first.
**Right Solution:** For pure-object DOMQL components, inline the component object shapes directly in the test file. Since DOMQL components are plain JavaScript objects (not class instances or framework-managed singletons), their shapes can be duplicated for testing without loss of fidelity. This completely bypasses the CJS/ESM boundary and lets you test all reactive functions, state toggles, and media query declarations in isolation.

### Jest + jsdom — window.location Mocking
**Bug:** jsdom's `window.location` is a non-configurable, non-writable property backed by a `Proxy`-wrapped `Location` implementation. Common mocking patterns fail:
- `delete window.location` — silently ignored (property is non-configurable)
- `window.location = { pathname: '/test' }` — triggers jsdom's `Location.set href` which calls `navigateFetch()`, throwing "Not implemented: navigation"
- `Object.defineProperty(window, 'location', { value: {...} })` — throws `Cannot redefine property: location`
- Spreading `{ ...window.location, pathname: '/test' }` — throws because `Location.toString()` is prototype-bound and can't be called on a plain object

**Wrong Solution:** Any approach that attempts to replace or redefine `window.location` on jsdom's `Window` proxy.
**Right Solution:** Decouple route-matching logic from `window.location` in tests. Extract the core matching algorithm into a standalone function (e.g., `isRouteActive(pathname, href)`) and test that directly with plain string arguments. For the actual `transform` function, call it with jsdom's default `window.location.pathname` (which is `'/'` out of the box) and verify against known expectations for that pathname.

### Mobile Lightbar Width — `width: 100%` in Full-Width Flex Parent
**Bug:** The `ActiveBar` lightbar element had `width: '100%'` and was a direct child of the `MobileNavLink` component, which itself was `width: '100%'` (filling the entire dropdown row). This caused the lightbar to span the entire menu width instead of just underlining the link text.
**Wrong Solution:** Setting `width: '100%'` on `ActiveBar` while it's a direct child of a full-width Flex container — the percentage resolves against the container, not the text.
**Right Solution:** Introduce an intermediate `LabelWrap` container with `width: 'fit-content'` that wraps both the `Label` and the `ActiveBar`. The `ActiveBar` keeps `width: '100%'`, but now 100% resolves against the fit-content wrapper, constraining it exactly to the text width. The outer `MobileNavLink` retains `width: '100%'` so the full row remains clickable and shows hover backgrounds.
```javascript
LabelWrap: {
  display: 'inline-flex',
  flexDirection: 'column',
  width: 'fit-content',        // sizes to text
  Label: { tag: 'span', text: ... },
  ActiveBar: { width: '100%' } // now 100% of fit-content, not 100% of row
}
```

### DOMQL State Scope Traversal for Nested Children
**Bug:** The hamburger button's three bar spans (`Bar1`, `Bar2`, `Bar3`) used `s.parent.isMenuOpen` to read the menu open state. However, since the bars are children of `HamburgerBtn` (which is itself a child of `TopNavbar`), `s.parent` from a bar's perspective points to the *button's* state scope — not `TopNavbar.state` where `isMenuOpen` lives. The X animation never triggered because `s.parent.isMenuOpen` was always `undefined`.
**Wrong Solution:** `s.parent.isMenuOpen` — assumes bars are direct children of the state owner.
**Right Solution:** `s.parent.parent.isMenuOpen` — traverse two levels up (bar → button → TopNavbar). Always add null-safety guards for resilience:
```javascript
transform: (el, s) => {
  const isOpen = s.parent && s.parent.parent && s.parent.parent.isMenuOpen
  return isOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none'
}
```
**Rule of thumb:** In DOMQL, each component with children creates its own state scope. Count the nesting depth from the child element back to the component that owns the state property, and use that many `.parent` hops.

### DOMQL `text` Prop Causes Duplicate Rendering in Extended Components
**Bug:** `MobileNavLink` extends `Flex` and each link instance passes `text: 'Dashboard'`. DOMQL auto-renders the `text` prop as visible text content on the Flex element itself. Separately, a `Label` child inside `LabelWrap` also reads and renders the same text. Result: every link label appears twice.
**Wrong Solution:** `{ extends: 'MobileNavLink', href: '/', text: 'Dashboard' }` — the `text` prop is rendered by both the Flex and the Label.
**Right Solution:** Rename the data prop to `linkText` and pass it via `props` (not as a top-level key). This prevents DOMQL from auto-rendering it, and only the `Label` child reads it explicitly:
```javascript
// TopNavbar
Dashboard: { extends: 'MobileNavLink', props: { href: '/', linkText: 'Dashboard' } }

// MobileNavLink > LabelWrap > Label
Label: {
  text: (el, s) => {
    const link = el.parent.parent
    return link.props && link.props.linkText || ''
  }
}
```

### `s.parent` State Chain Unreliable Across Page Contexts — Use `s.root`
**Bug:** The hamburger menu only opened on the home page. On contract/pipeline pages, clicking the hamburger icon did nothing. The `onClick` handler used `s.parent.update({ isMenuOpen: ... })` which relied on the state parent chain being consistent. Across different DOMQL page renders, `s.parent` can resolve to different scopes, causing the update to write to the wrong state node.
**Wrong Solution:** `s.parent.update({ isMenuOpen: !s.parent.isMenuOpen })` — fragile parent chain that breaks on page re-renders.
**Right Solution:** Hoist `isMenuOpen` to the root state (`state.js`) and access it everywhere via `s.root.isMenuOpen`. This is the same proven pattern used for `isContractModalOpen`, `indicatorLeft`, etc. in this project. Root state is always reachable regardless of component nesting depth or page context:
```javascript
// state.js
isMenuOpen: false,

// Any component, any nesting depth, any page:
s.root.isMenuOpen         // read
s.root.update({ isMenuOpen: true })  // write
```

### CSS Transition on Initial Render — Lifecycle-Driven Animation
**Bug:** The mobile lightbar's `transform: scaleX(0) → scaleX(1)` CSS transition never visually animated. The reactive `transform` function immediately computed `scaleX(1)` for the active route on render — since the value never *changed*, there was no transition to observe. The bar appeared instantly.
**Wrong Solution:** Using a reactive function for `transform` that evaluates the route on mount — CSS transitions only fire on value *changes*, not initial values.
**Right Solution:** Set the static initial CSS to `transform: 'scaleX(0)'` (always collapsed). Then in `onRender`, apply the final value via `el.node.style.transform` after a `setTimeout(200)`. This creates a real value change (from `scaleX(0)` to `scaleX(1)`) that CSS can transition:
```javascript
ActiveBar: {
  transform: 'scaleX(0)', // static initial — always starts collapsed
  transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  onRender: (el, s) => {
    setTimeout(() => {
      if (!el.node) return
      const isActive = /* route matching */
      el.node.style.transform = isActive ? 'scaleX(1)' : 'scaleX(0)'
    }, 200) // delay lets menu open animation play first
  }
}
```

### DOMQL `props` Does Not Store Custom Keys — Use Child Overrides
**Bug:** Passing `props: { href: '/', linkText: 'Dashboard' }` to a MobileNavLink component, then attempting to read `el.parent.parent.props.linkText` from a nested Label child — the text never rendered. DOMQL's `props` maps to HTML element properties (`type`, `value`, `checked`, `href`, etc.), not arbitrary data. Custom keys like `linkText` are silently dropped.
**Wrong Solution:** `{ extends: 'MobileNavLink', props: { href: '/', linkText: 'Dashboard' } }` — `linkText` is not an HTML property and gets discarded.
**Right Solution:** Use DOMQL's component override pattern. Each link instance directly overrides the nested child's `text` property:
```javascript
// In TopNavbar MobileMenu:
Dashboard: {
  extends: 'MobileNavLink',
  props: { href: '/' },                    // href is a valid HTML prop
  LabelWrap: { Label: { text: 'Dashboard' } }  // directly overrides child's text
}

// In MobileNavLink base component:
Label: { tag: 'span', text: '' }  // default empty, instances override
```
**Rule of thumb:** DOMQL's `props` is strictly for HTML properties. For passing custom data to nested children, use either (1) component child overrides as shown above, (2) `state` with proper traversal, or (3) `attr: { 'data-*': value }` and `el.node.getAttribute()`.

### DOMQL `el.href` — Only Available on Elements That Extend `Link` or Have `tag: 'a'`
**Bug:** All hamburger menu links navigated to the Dashboard regardless of which was clicked. The lightbar also failed to detect the active route. Root cause: `MobileNavLink` extended `Flex` (not `Link`), and `href` was passed via `props: { href: '/lead' }`. Since `Flex` is not an anchor element, DOMQL discarded the `href` — making `el.props.href` and `el.href` both `undefined`. The `onClick` handler called `el.router(undefined, ...)` which defaulted to `/`.
**Wrong Solution:** `{ extends: 'MobileNavLink', props: { href: '/lead' } }` where MobileNavLink extends `Flex` — DOMQL doesn't store href on non-anchor elements.
**Right Solution:** Two changes:
1. Add `tag: 'a'` to `MobileNavLink` so DOMQL treats it as an anchor element and processes `href`.
2. Pass `href` as a **top-level key** (not inside `props`) on each instance — this mirrors how `NavLink` (desktop) works:
```javascript
// TopNavbar — href as top-level key, text as child override
Dashboard: {
  extends: 'MobileNavLink',
  href: '/',                                    // top-level, stored on el.href
  LabelWrap: { Label: { text: 'Dashboard' } }
}

// MobileNavLink — reads via el.href
onClick: (e, el, s) => {
  e.preventDefault()
  const href = el.href   // now accessible because tag: 'a'
  el.router(href, el.getRoot())
}
```
**Rule of thumb:** If a DOMQL component needs `el.href`, it must either `extends: 'Link'` or declare `tag: 'a'`. Pass `href` as a top-level key on instances (same as the desktop `NavLink` pattern), never inside `props`.

### CSS Media Query Visibility State Does Not Trigger DOMQL Lifecycles
**Bug:** When resizing from mobile (<=900px) back to desktop, the desktop navigation lightbar did not appear under the currently active link. Root cause: The desktop `NavLinks` container transitioned from `display: none` to visible entirely via CSS media queries. DOMQL does not observe CSS paint visibility state, so no component lifecycle hooks (`onUpdate`, `onRender`) fired when the links became visible. Since `NavLink.onUpdate` measures physical DOM values (`el.node.offsetLeft`/`offsetWidth`), the initial render on mobile measured zeros (since it was `display: none`), and never re-measured when it became visible.
**Wrong Solution:** Relying exclusively on CSS media queries for visibility when child components depend on physical DOM measurements like offset/width.
**Right Solution:** Add a window resize listener on the parent component (`TopNavbar`) to explicitly detect the media query breakpoint crossover. When crossing from mobile to desktop, use `setTimeout` (to allow CSS to apply and elements to become measurable) and manually call `onUpdate` on the child links to force them to re-measure their DOM positions:
```javascript
onRender: (el, s) => {
  let wasMobile = window.innerWidth <= 900
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 900
    if (wasMobile && !isMobile) {
      // Crossed from mobile to desktop — NavLinks became visible
      // Wait for CSS to apply and elements to become measurable
      setTimeout(() => {
        const navLinks = el.NavLinks
        if (!navLinks) return
        const linkKeys = ['Dashboard', 'Leads', 'Pitched', 'Negotiating', 'Active', 'Inactive']
        linkKeys.forEach(key => {
          const link = navLinks[key]
          if (link && link.onUpdate) link.onUpdate(link, link.state) // Force re-measure
        })
      }, 200)
    }
    wasMobile = isMobile
  })
}
```

### DOMQL `flow` Property Conflicting with Dynamic `display` Styles
**Bug:** In the `CreateLeadModal`, the "New Client" input fields failed to appear when selecting "+ New Client...". The `NewClientFields` container had `flow: 'y'` combined with `display: (el, s) => s.selectedClientId === '__new__' ? 'flex' : 'none'`. Because `flow: 'y'` generates a baseline `display: flex` class, it often overrides or conflicts with dynamically assigned `display` styles, causing the hidden state to fail predictably.
**Wrong Solution:** Attempting to toggle visibility using dynamic `display: 'none'` alongside `flow` properties.
**Right Solution:** Use DOMQL's dedicated `hide` property (`hide: (el, s) => s.selectedClientId !== '__new__'`). The `hide` property evaluates the condition and explicitly applies `display: none !important` via Emotion classes, cleanly overriding layout properties like `flow` without conflict.

### Missing `attr` Block on `<option>` Selected States
**Bug:** Selecting the "+ New Client..." option from a dropdown did not trigger the state update properly. The options were defined with a flat `selected: (el, s) => s.isSelected || null` property instead of being wrapped in an `attr: {}` block.
**Wrong Solution:** Placing HTML-specific attributes like `selected` directly on the root of the component definition for `<option>` tags.
**Right Solution:** Always wrap native HTML attributes for form controls (especially `<option selected>`) in an `attr` block: `attr: { selected: (el, s) => s.isSelected || null }`. This bypasses the reactive CSS props pipeline and ensures the attribute binds directly and accurately to the real DOM node.

### Combobox / Auto-complete Dropdowns in DOMQL
**Bug:** Attempting to allow users to both select an existing client and type a brand new client name inside a native `<select>` element. Native HTML `<select>` elements strictly forbid arbitrary text entry.
**Wrong Solution:** Trying to build a complex state-driven custom dropdown component from scratch to support text entry, or trying to force `<select>` to accept arbitrary strings.
**Right Solution:** Use native HTML5 `<datalist>` paired with an `<input type="text">`. Bind the `list` attribute on the input to match the `id` of the datalist. Map the datalist `<option>` children to the global state exactly as you would for a select element. This provides native auto-complete while fully supporting arbitrary text entry.

### Modal Form Scrolling and Content Cut-offs
**Bug:** Large form modals (e.g. `CreateLeadModal` with expanded "New Client" fields) overflowed the screen on shorter viewports or when dynamically expanding, cutting off the action buttons at the bottom.
**Wrong Solution:** Trying to fix the overflow on the outer wrapper (`position: fixed`) or attempting to adjust the position of the buttons using `absolute` positioning.
**Right Solution:** Apply `overflowY: 'auto'` and `maxHeight: '90vh'` directly to the inner `Dialog` component (the card). This allows the content within the card to scroll cleanly while the modal overlay background remains fixed to the viewport.

### Formatting Raw Input Data On Object Creation
**Bug:** When generating a new object (like a new Client with a phone number) from a free-text input field, the data saved to global state retained raw unformatted characters, breaking display expectations in other components (e.g. `ContractDetailPane` expecting `+1 (XXX) YYY-ZZZZ`).
**Wrong Solution:** Attempting to force the user to type in strict formats or trying to handle the formatting purely at the display level across all possible consuming components.
**Right Solution:** Intercept and format the raw input data immediately before pushing it to the global state array. Strip non-digits (`replace(/\D/g, '')`) and apply regex chunking (e.g., `+1 (XXX) YYY-ZZZZ`) during the `onClick` event prior to object creation. This ensures a clean, uniform data layer across the application.
