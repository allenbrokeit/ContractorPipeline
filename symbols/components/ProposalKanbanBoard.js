export const ProposalKanbanBoard = {
  extends: 'Flex',
  props: { gap: 'A', width: '100%', overflowX: 'auto', paddingBottom: 'A' },
  
  childExtends: {
    extends: 'Flex',
    props: {
      flexDirection: 'column',
      gap: 'Y',
      minWidth: '280px',
      flex: 1,
      background: 'rgba(30, 41, 59, 0.4)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      padding: 'A',
      borderRadius: 'Z'
    },
    
    Header: {
      tag: 'h3',
      props: { text: (el, s) => s.title, color: 'textPrimary', paddingBottom: 'Y', borderBottom: '1px solid', borderColor: 'border' }
    },

    Cards: {
      extends: 'Flex',
      props: { flexDirection: 'column', gap: 'Y', paddingTop: 'Y' },
      childExtends: {
        extends: 'Flex',
        props: {
          flexDirection: 'column',
          gap: 'X',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          padding: 'Z',
          borderRadius: 'Y',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease, border 0.2s ease',
          ':hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }
        },
        Title: { props: { text: (el, s) => s.title, color: 'textPrimary', fontWeight: 'bold' } },
        Client: {
          props: (el, s) => {
            const client = s.root.clients?.find(c => c.id === s.clientId)
            return { text: client?.name, color: 'textSecondary', fontSize: 'Z' }
          }
        },
        Value: { props: { text: (el, s) => `$${s.estimatedMonthlyValue}/mo (${s.status === 'Closed' ? s.proposedDurationMonths + ' mos' : 'TBD'})`, color: 'secured', fontSize: 'Y', fontWeight: '600' } },
        
        Actions: {
          extends: 'Flex',
          props: { gap: 'X', marginTop: 'X' },
          childExtends: {
            tag: 'button',
            props: {
              padding: 'V X',
              background: 'blue.2',
              color: 'white',
              border: '1px solid blue',
              borderRadius: 'W',
              cursor: 'pointer',
              fontSize: 'Y',
              text: (el, s) => s.label,
              onClick: (event, el) => {
                const action = el.parent.parent.state
                const rootState = el.getRoot().state
                
                if (el.state.actionContent === 'Won') {
                  // Trigger Contract Modal
                  el.getRoot().state.update({
                    isContractModalOpen: true,
                    selectedProposalId: action.id
                  })
                } else {
                  // Dispatch Mock API update
                  const proposals = rootState.proposals.map(p => {
                    if (p.id === action.id) {
                      return { ...p, status: el.state.actionContent }
                    }
                    return p
                  })
                  rootState.update({ proposals })
                  
                  // Mock DB Call
                  setTimeout(() => console.log(`[Mock DB] updated proposal ${action.id} to ${el.state.actionContent}`), 300)
                }
              }
            }
          },
          // Compute possible next actions based on current column
          children: (el, s) => {
            const status = s.status
            if (status === 'Lead') return [{ state: { label: 'Pitch', actionContent: 'Pitched' } }]
            if (status === 'Pitched') return [{ state: { label: 'Negotiate', actionContent: 'Negotiating' } }]
            if (status === 'Negotiating') return [{ state: { label: 'Mark Won', actionContent: 'Won' } }]
            return []
          }
        }
      },
      // Pass states from root filtered by current column title
      children: (el, s) => {
        return (s.root.proposals || []).filter(p => p.status === s.title).map(p => ({ state: p }))
      }
    }
  },

  children: [
    { state: { title: 'Lead' } },
    { state: { title: 'Pitched' } },
    { state: { title: 'Negotiating' } }
  ]
}
