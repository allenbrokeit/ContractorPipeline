export const ContractFormModal = {
  extends: 'Flex',
  display: (el, s) => s.root.isContractModalOpen ? 'flex' : 'none',
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(8px)',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,

  // Local state to manage the form before submission
  state: {
    startDate: new Date().toISOString().split('T')[0],
    durationMonths: 3
  },

  Dialog: {
    extends: 'Flex',
    flexDirection: 'column',
    background: 'rgba(30, 41, 59, 0.9)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    padding: 'B',
    borderRadius: 'Z',
    width: '400px',
    gap: 'A',

    Header: {
      tag: 'h2',
      text: 'Convert to Contract',
      margin: 0,
      color: 'textPrimary'
    },

    RefInfo: {
      color: 'textSecondary',
      text: (el, s) => {
        if (!s.root.selectedProposalId) return ''
        const p = s.root.proposals.find(x => x.id === s.root.selectedProposalId)
        return `Proposal: ${p?.title}`
      }
    },

    FormGroup1: {
      extends: 'Flex',
      flexDirection: 'column',
      gap: 'Y',
      Label: { tag: 'label', text: 'Start Date', color: 'textSecondary', fontSize: 'Z' },
      Input: {
        tag: 'input',
        type: 'date',
        style: {
          color: '#F8FAFC',
          colorScheme: 'dark',
          '::-webkit-calendar-picker-indicator': {
            filter: 'invert(1) brightness(2)'
          }
        },
        padding: 'Z',
        background: 'bgPrimary',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'W',
        value: (el, s) => s.startDate,
        onInput: (event, el, s) => {
          s.update({ startDate: event.target.value })
        }
      }
    },

    FormGroup2: {
      extends: 'Flex',
      flexDirection: 'column',
      gap: 'Y',
      Label: { tag: 'label', text: 'Duration (Months)', color: 'textSecondary', fontSize: 'Z' },
      Select: {
        tag: 'select',
        style: {
          color: '#F8FAFC',
          colorScheme: 'dark'
        },
        padding: 'Z',
        background: 'bgPrimary',
        border: '1px solid',
        borderColor: 'border',
        borderRadius: 'W',
        // NOTE: childExtends uses an inline object here intentionally.
        // childExtends: 'DurationOption' (named component) does not render children
        // in this project's runtime version. The inline pattern matches the working
        // pattern in ProposalKanbanBoard.js. Documented in symbols-feedback.md.
        childExtends: {
          tag: 'option',
          value: (el, s) => String(s.val),
          text: (el, s) => `${s.val} Month${s.val > 1 ? 's' : ''}`,
          // Use attr: for selected — DOMQL processes attribute-level bindings
          // directly on the DOM node without going through the reactive CSS prop
          // pipeline, avoiding the re-render loop that caused the visual desync.
          attr: { selected: (el, s) => s.isSelected || null }
        },
        // ✅ v3 top-level event handler — replaces deprecated on: { change: fn } syntax.
        // The on:{} block does NOT wire up native DOM events in v3; this is why all
        // previous attempts silently failed. onChange fires correctly at root level.
        onChange: (event, el, s) => {
          const val = parseInt(event.target.value, 10) || 1
          s.update({ durationMonths: val })
        },
        // Pass durationMonths into each option's state so attr.selected can compute
        children: (el, s) => [1, 2, 3, 6, 12].map(val => ({
          state: { val, isSelected: val === s.durationMonths }
        }))
      }
    },

    Calculation: {
      color: 'secured',
      fontSize: 'Y',
      text: (el, s) => {
        if (!s.startDate) return ''
        const start = new Date(s.startDate)
        const endDate = new Date(start.getFullYear(), start.getMonth() + s.durationMonths, start.getDate())
        return `Calculated End Date: ${endDate.toLocaleDateString()}`
      }
    },

    Actions: {
      extends: 'Flex',
      gap: 'Z',
      justifyContent: 'flex-end',
      marginTop: 'Z',
      Cancel: {
        tag: 'button',
        text: 'Cancel',
        padding: 'Z A',
        background: 'transparent',
        border: '1px solid',
        borderColor: 'border',
        color: 'textSecondary',
        borderRadius: 'W',
        cursor: 'pointer',
        onClick: (evt, el) => {
          el.getRoot().state.update({ isContractModalOpen: false, selectedProposalId: null })
        }
      },
      Confirm: {
        tag: 'button',
        text: 'Confirm & Sign',
        padding: 'Z A',
        background: 'secured',
        border: 'none',
        color: 'black',
        borderRadius: 'W',
        cursor: 'pointer',
        onClick: (evt, el, s) => {
          const rState = el.getRoot().state
          const pId = rState.selectedProposalId
          const prop = rState.proposals.find(p => p.id === pId)

          if (prop) {
            const start = new Date(s.startDate)
            const endDate = new Date(start.getFullYear(), start.getMonth() + s.durationMonths, start.getDate()).toISOString()

            const newContract = {
              id: `ac_${Date.now()}`,
              clientId: prop.clientId,
              proposalId: prop.id,
              title: prop.title,
              startDate: start.toISOString(),
              endDate,
              durationMonths: s.durationMonths,
              monthlyValue: prop.estimatedMonthlyValue,
              status: 'Active'
            }

            rState.update({
              contracts: [...rState.contracts, newContract],
              proposals: rState.proposals.map(px => px.id === pId ? { ...px, status: 'Closed', proposedDurationMonths: s.durationMonths } : px),
              isContractModalOpen: false,
              selectedProposalId: null
            })
          }
        }
      }
    }
  }
}
