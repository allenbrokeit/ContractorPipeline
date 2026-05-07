export const ContractDetailPane = {
  extends: 'Flex',
  flex: 1,
  padding: 'C',
  flexDirection: 'column',
  background: 'rgba(15, 23, 42, 0.2)',
  
  Placeholder: {
    extends: 'Flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    if: (el, s) => !s.root.selectedContractId,
    text: 'Select a contract to view details',
    color: 'textSecondary',
    fontSize: 'C'
  },
  
  EditorContainer: {
    extends: 'Flex',
    flex: 1,
    if: (el, s) => !!s.root.selectedContractId,
    
    childExtends: {
      extends: 'Flex',
      flexDirection: 'column',
      flex: 1,
      gap: 'B',
      
      Header: {
        extends: 'Flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: 'B',
        
        Title: {
          tag: 'h1',
          text: 'Edit Contract',
          color: 'white',
          margin: 0
        },
        
        ClientName: {
          color: 'textSecondary',
          fontSize: 'B',
          text: (el, s) => {
            const client = s.root.clients?.find(c => c.id === s.clientId)
            return client ? client.name : ''
          }
        }
      },
      
      Form: {
        extends: 'Flex',
        flexDirection: 'column',
        gap: 'B',
        maxWidth: '600px',
        
        TitleGroup: {
          extends: 'Flex',
          flexDirection: 'column',
          gap: 'Y',
          Label: { tag: 'label', text: 'Project Title', color: 'textSecondary' },
          Input: {
            tag: 'input',
            padding: 'Z',
            background: 'bgPrimary',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'W',
            value: (el, s) => s.title,
            onInput: (e, el, s) => s.update({ title: e.target.value })
          }
        },
        
        StatusGroup: {
          extends: 'Flex',
          flexDirection: 'column',
          gap: 'Y',
          Label: { tag: 'label', text: 'Status', color: 'textSecondary' },
          Select: {
            tag: 'select',
            padding: 'Z',
            background: 'bgPrimary',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'W',
            onChange: (e, el, s) => s.update({ status: e.target.value }),
            childExtends: {
              tag: 'option',
              value: (el, s) => s.val,
              text: (el, s) => s.label,
              attr: { selected: (el, s) => s.isSelected || null }
            },
            childrenAs: 'state',
            children: (el, s) => [
              { val: 'Active', label: 'Active', isSelected: s.status === 'Active' },
              { val: 'Renegotiating', label: 'Renegotiating', isSelected: s.status === 'Renegotiating' },
              { val: 'Expired', label: 'Expired', isSelected: s.status === 'Expired' }
            ]
          }
        },
        
        DateValueGroup: {
          extends: 'Grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'B',
          
          StartDate: {
            extends: 'Flex', flexDirection: 'column', gap: 'Y',
            Label: { tag: 'label', text: 'Start Date', color: 'textSecondary' },
            Input: {
              tag: 'input', type: 'date',
              padding: 'Z', background: 'bgPrimary', color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'W',
              style: { colorScheme: 'dark' },
              value: (el, s) => s.startDate ? s.startDate.split('T')[0] : '',
              onInput: (e, el, s) => s.update({ startDate: new Date(e.target.value).toISOString() })
            }
          },
          Duration: {
            extends: 'Flex', flexDirection: 'column', gap: 'Y',
            Label: { tag: 'label', text: 'Duration (Months)', color: 'textSecondary' },
            Input: {
              tag: 'input', type: 'number', min: '1',
              padding: 'Z', background: 'bgPrimary', color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'W',
              value: (el, s) => s.durationMonths,
              onInput: (e, el, s) => s.update({ durationMonths: parseInt(e.target.value, 10) || 1 })
            }
          },
          MonthlyValue: {
            extends: 'Flex', flexDirection: 'column', gap: 'Y',
            Label: { tag: 'label', text: 'Monthly Value ($)', color: 'textSecondary' },
            Input: {
              tag: 'input', type: 'number', min: '0',
              padding: 'Z', background: 'bgPrimary', color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'W',
              value: (el, s) => s.monthlyValue,
              onInput: (e, el, s) => s.update({ monthlyValue: parseInt(e.target.value, 10) || 0 })
            }
          }
        }
      },
      
      Actions: {
        extends: 'Flex',
        gap: 'A',
        marginTop: 'B',
        
        Save: {
          tag: 'button',
          text: 'Save Changes',
          padding: 'Z A',
          background: 'secured',
          color: 'black',
          border: 'none',
          borderRadius: 'W',
          cursor: 'pointer',
          onClick: (e, el, s) => {
            const rootState = el.getRootState()
            const start = new Date(s.startDate)
            const endDate = new Date(start.getFullYear(), start.getMonth() + s.durationMonths, start.getDate()).toISOString()
            
            const contracts = rootState.contracts.map(c => {
              if (c.id === s.id) {
                // Merge the localized editable state back into the real contract
                return { ...s.parse(), endDate }
              }
              return c
            })
            
            rootState.update({ contracts })
          }
        }
      }
    },
    childrenAs: 'state',
    children: (el, s) => {
      const contract = s.root.contracts?.find(c => c.id === s.root.selectedContractId)
      // Return a deep copy in an array of 1. The deep copy prevents
      // un-saved keystrokes from mutating the live list view.
      return contract ? [JSON.parse(JSON.stringify(contract))] : []
    }
  }
}