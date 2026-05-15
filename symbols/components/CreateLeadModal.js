export const CreateLeadModal = {
  flow: 'y',
  display: (el, s) => s.root.isCreateLeadModalOpen ? 'flex' : 'none',
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'black .5',
  backdropFilter: 'blur(8px)',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,

  state: {
    clientName: '',
    newClientIndustry: '',
    newClientEmail: '',
    newClientPhone: '',
    projectTitle: '',
    monthlyValue: 0,
    durationMonths: 3,
    startDate: new Date().toISOString().split('T')[0]
  },

  Dialog: {
    flow: 'y',
    background: 'gray .9',
    backdropFilter: 'blur(16px)',
    border: '1px solid',
    borderColor: 'white .15',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    padding: 'B',
    borderRadius: 'Z',
    width: 'H',
    gap: 'A',
    maxHeight: '90vh',
    overflowY: 'auto',

    Header: {
      tag: 'h2',
      text: 'Create New Lead',
      margin: 0,
      color: 'textPrimary'
    },

    FormField_1: {
      Label: { text: 'Client Name' },
      Input: {
        type: 'text',
        list: 'client-list',
        placeholder: 'Search or enter new client...',
        value: (el, s) => s.clientName,
        onInput: (event, el, s) => s.update({ clientName: event.target.value })
      },
      DataList: {
        tag: 'datalist',
        id: 'client-list',
        childExtends: {
          tag: 'option',
          value: (el, s) => s.name
        },
        children: (el, s) => (s.root.clients || []).map(c => ({ state: { name: c.name } }))
      }
    },

    NewClientFields: {
      flow: 'y',
      gap: 'A',
      hide: (el, s) => {
        if (!s.clientName) return true
        const isExisting = (s.root.clients || []).some(c => c.name.toLowerCase() === s.clientName.trim().toLowerCase())
        return isExisting
      },
      FormField_1: {
        Label: { text: 'Industry' },
        Input: {
          type: 'text',
          value: (el, s) => s.newClientIndustry,
          onInput: (event, el, s) => s.update({ newClientIndustry: event.target.value })
        }
      },
      FormField_2: {
        Label: { text: 'Email' },
        Input: {
          type: 'email',
          value: (el, s) => s.newClientEmail,
          onInput: (event, el, s) => s.update({ newClientEmail: event.target.value })
        }
      },
      FormField_3: {
        Label: { text: 'Phone' },
        Input: {
          type: 'tel',
          value: (el, s) => s.newClientPhone,
          onInput: (event, el, s) => s.update({ newClientPhone: event.target.value })
        }
      }
    },

    FormField_2: {
      Label: { text: 'Project Title' },
      Input: {
        type: 'text',
        value: (el, s) => s.projectTitle,
        onInput: (event, el, s) => s.update({ projectTitle: event.target.value })
      }
    },

    FormField_3: {
      Label: { text: 'Monthly Value ($)' },
      Input: {
        type: 'number',
        min: 0,
        value: (el, s) => s.monthlyValue,
        onInput: (event, el, s) => {
          const val = parseFloat(event.target.value) || 0
          s.update({ monthlyValue: val })
        }
      }
    },

    FormField_4: {
      Label: { text: 'Duration (Months)' },
      Input: {
        type: 'number',
        min: 1,
        value: (el, s) => s.durationMonths,
        onInput: (event, el, s) => {
          const val = parseInt(event.target.value, 10) || 1
          s.update({ durationMonths: val })
        }
      }
    },

    FormField_5: {
      Label: { text: 'Start Date' },
      Input: {
        type: 'date',
        style: {
          colorScheme: 'dark',
          '::-webkit-calendar-picker-indicator': { filter: 'invert(1) brightness(2)' }
        },
        color: 'white',
        value: (el, s) => s.startDate,
        onInput: (event, el, s) => s.update({ startDate: event.target.value })
      }
    },

    Actions: {
      flow: 'x',
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
        onClick: (evt, el, s) => {
          el.getRoot().state.update({ isCreateLeadModalOpen: false }, { preventFetch: true })
          s.update({
            clientName: '', newClientIndustry: '', newClientEmail: '', newClientPhone: '',
            projectTitle: '', monthlyValue: 0, durationMonths: 3, startDate: new Date().toISOString().split('T')[0]
          })
        }
      },
      CreateLead: {
        tag: 'button',
        text: 'Create Lead',
        padding: 'Z A',
        background: 'secured',
        border: 'none',
        color: 'black',
        borderRadius: 'W',
        cursor: 'pointer',
        onClick: (evt, el, s) => {
          const rState = el.getRoot().state
          
          const trimmedName = s.clientName.trim()
          if (!s.projectTitle || s.monthlyValue <= 0 || !trimmedName) return

          const existingClient = (rState.clients || []).find(c => c.name.toLowerCase() === trimmedName.toLowerCase())
          let finalClientId
          let newClientObj = null
          
          if (existingClient) {
            finalClientId = existingClient.id
          } else {
            finalClientId = `c_${Date.now()}`
            
            let formattedPhone = s.newClientPhone || ''
            let digitsOnly = formattedPhone.replace(/\D/g, '')
            if (digitsOnly) {
              if (digitsOnly.length === 10) {
                formattedPhone = `+1 (${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
              } else if (digitsOnly.length === 11) {
                formattedPhone = `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 11)}`
              } else {
                const match = digitsOnly.match(/.{1,4}/g)
                if (match) formattedPhone = `+1 ${match.join(' ')}`
              }
            }

            newClientObj = {
              id: finalClientId,
              name: trimmedName,
              industry: s.newClientIndustry,
              contactEmail: s.newClientEmail,
              contactPhone: formattedPhone
            }
          }

          const newProject = {
            id: `p_${Date.now()}`,
            clientId: finalClientId,
            title: s.projectTitle,
            status: 'Lead',
            monthlyValue: s.monthlyValue,
            durationMonths: s.durationMonths,
            startDate: new Date(s.startDate).toISOString()
          }
          
          rState.update({
            projects: [...rState.projects, newProject],
            clients: newClientObj ? [...rState.clients, newClientObj] : rState.clients,
            isCreateLeadModalOpen: false
          })
          
          s.update({
            clientName: '', newClientIndustry: '', newClientEmail: '', newClientPhone: '',
            projectTitle: '', monthlyValue: 0, durationMonths: 3, startDate: new Date().toISOString().split('T')[0]
          })
        }
      }
    }
  }
}
