export const ContractListPane = {
  extends: 'Flex',
  flexDirection: 'column',
  background: 'rgba(15, 23, 42, 0.4)',
  borderRight: '1px solid rgba(255, 255, 255, 0.05)',
  height: '100%',
  
  Header: {
    extends: 'Flex',
    flexDirection: 'column',
    padding: 'B',
    gap: 'Z',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    
    Title: { tag: 'h2', text: 'Active Contracts', color: 'textPrimary', margin: 0 },
    
    SortSelect: {
      tag: 'select',
      padding: 'Z',
      background: 'bgPrimary',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'W',
      onChange: (e, el, s) => el.getRootState().update({ contractSortBy: e.target.value }),
      childExtends: {
        tag: 'option',
        value: (el, s) => String(s.val),
        text: (el, s) => s.label,
        attr: { selected: (el, s) => s.val === el.getRootState().contractSortBy || null }
      },
      childrenAs: 'state',
      children: () => [
        { val: 'recent', label: 'Recently Added' },
        { val: 'name', label: 'Client Name' },
        { val: 'value', label: 'Highest Value' }
      ]
    }
  },
  
  List: {
    extends: 'Flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flex: 1,
    
    childExtends: {
      extends: 'Flex',
      flexDirection: 'column',
      padding: 'B',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      cursor: 'pointer',
      background: (el, s) => el.getRootState().selectedContractId === s.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
      transition: 'background 0.2s',
      ':hover': { background: 'rgba(255, 255, 255, 0.05)' },
      onClick: (e, el, s) => el.getRootState().update({ selectedContractId: s.id }),
      
      ClientName: {
        color: 'textPrimary',
        fontWeight: 'bold',
        text: (el, s) => {
          const client = el.getRootState().clients?.find(c => c.id === s.clientId)
          return client ? client.name : 'Unknown'
        }
      },
      ProjectTitle: {
        color: 'textSecondary',
        fontSize: 'Z',
        text: (el, s) => s.title,
        margin: 'X 0'
      },
      Meta: {
        extends: 'Flex',
        justifyContent: 'space-between',
        fontSize: 'Y',
        Status: {
          color: (el, s) => s.status === 'Active' ? 'secured' : 'textSecondary',
          text: (el, s) => s.status
        },
        Value: {
          color: 'white',
          text: (el, s) => `$${s.monthlyValue}/mo`
        }
      }
    },
    childrenAs: 'state',
    children: (el, s) => {
      const contracts = [...(s.root.contracts || [])]
      const sortBy = s.root.contractSortBy || 'recent'
      
      if (sortBy === 'name') {
        contracts.sort((a, b) => {
          const clientA = s.root.clients?.find(c => c.id === a.clientId)?.name || ''
          const clientB = s.root.clients?.find(c => c.id === b.clientId)?.name || ''
          return clientA.localeCompare(clientB)
        })
      } else if (sortBy === 'value') {
        contracts.sort((a, b) => b.monthlyValue - a.monthlyValue)
      } else {
        // recent: assuming larger ID or later date. Reversing since newer are appended.
        contracts.reverse()
      }
      
      return contracts
    }
  }
}