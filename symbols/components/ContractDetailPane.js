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
    if: (el, s) => !s.root.selectedProjectId,
    text: 'Select a project to view details',
    color: 'textSecondary',
    fontSize: 'C'
  },
  
  EditorContainer: {
    extends: 'Flex',
    flex: 1,
    if: (el, s) => !!s.root.selectedProjectId,
    
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
        
        TitleGroup: {
          extends: 'Flex',
          flexDirection: 'column',
          gap: 'Z',
          Title: {
            tag: 'h1',
            text: 'Project Details',
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

        ContactInfo: {
          extends: 'Flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 'Z',
          Email: {
            color: 'textSecondary',
            fontSize: 'Z',
            text: (el, s) => {
              const client = s.root.clients?.find(c => c.id === s.clientId)
              return client?.contactEmail || 'No Email'
            }
          },
          Phone: {
            color: 'textSecondary',
            fontSize: 'Z',
            text: (el, s) => {
              const client = s.root.clients?.find(c => c.id === s.clientId)
              return client?.contactPhone || 'No Phone'
            }
          }
        }
      },
      
      Form: {
        extends: 'Flex',
        flexDirection: 'column',
        gap: 'B',
        maxWidth: '700px',
        
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
          StatusOptions: {
            extends: 'Flex',
            gap: 'Z',
            flexWrap: 'wrap',
            childExtends: {
              extends: 'Flex',
              padding: 'Z Y',
              borderRadius: 'V',
              cursor: 'pointer',
              fontSize: 'Z',
              fontWeight: '600',
              border: '1px solid',
              borderColor: (el, s) => el.parent.state.status === s.val ? 'secured' : 'rgba(255,255,255,0.1)',
              background: (el, s) => el.parent.state.status === s.val ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              color: (el, s) => el.parent.state.status === s.val ? 'secured' : 'textSecondary',
              transition: 'all 0.2s ease',
              text: (el, s) => s.label,
              onClick: (e, el, s) => el.parent.state.update({ status: s.val, isStatusManuallySet: true })
            },
            childrenAs: 'state',
            children: [
              { val: 'Lead', label: 'Lead' },
              { val: 'Pitched', label: 'Pitched' },
              { val: 'Negotiating', label: 'Negotiating' },
              { val: 'Pending', label: 'Pending' },
              { val: 'Active', label: 'Active' },
              { val: 'Declined', label: 'Declined' }
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
              onInput: (e, el, s) => {
                const newStart = new Date(e.target.value).toISOString();
                s.update({ startDate: newStart });
              }
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
              onInput: (e, el, s) => {
                const dur = parseInt(e.target.value, 10) || 1;
                s.update({ durationMonths: dur });
              }
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
              onInput: (e, el, s) => {
                s.update({ monthlyValue: parseInt(e.target.value, 10) || 0 })
              }
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
            const projects = rootState.projects.map(c => {
              if (c.id === s.id) {
                // Merge the localized editable state back into the real project
                return { ...s.parse() }
              }
              return c
            })
            rootState.update({ projects })
          }
        }
      }
    },
    childrenAs: 'state',
    children: (el, s) => {
      const project = s.root.projects?.find(c => c.id === s.root.selectedProjectId)
      return project ? [JSON.parse(JSON.stringify(project))] : []
    }
  }
}