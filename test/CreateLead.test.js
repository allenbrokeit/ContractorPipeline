/**
 * @jest-environment jsdom
 */

const CreateLeadModal = {
  flow: 'y',
  display: (el, s) => s.root.isCreateLeadModalOpen ? 'flex' : 'none',
  Dialog: {
    Header: {},
    FormField_1: {},
    NewClientFields: {},
    Actions: {
      Cancel: {},
      CreateLead: {
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

const CreateLeadButton = {
  flow: 'x',
  text: '+ New Lead',
  onClick: (e, el, s) => s.root.update({ isCreateLeadModalOpen: true })
}

const DashboardLayout = {
  Grid: {
    BottomSection: {
      HeaderRow: {
        SectionTitle: {},
        CreateLeadButton: {}
      }
    }
  },
  CreateLeadModal: {}
}

describe('CreateLeadModal Structure', () => {
  test('flow is y', () => {
    expect(CreateLeadModal.flow).toBe('y')
  })

  test('display reactive to s.root.isCreateLeadModalOpen', () => {
    expect(typeof CreateLeadModal.display).toBe('function')
    const s = { root: { isCreateLeadModalOpen: true } }
    expect(CreateLeadModal.display({}, s)).toBe('flex')
    
    const s2 = { root: { isCreateLeadModalOpen: false } }
    expect(CreateLeadModal.display({}, s2)).toBe('none')
  })

  test('Dialog child has expected structure', () => {
    const dialog = CreateLeadModal.Dialog
    expect(dialog.Header).toBeDefined()
    expect(dialog.FormField_1).toBeDefined()
    expect(dialog.NewClientFields).toBeDefined()
    expect(dialog.Actions).toBeDefined()
    expect(dialog.Actions.Cancel).toBeDefined()
    expect(dialog.Actions.CreateLead).toBeDefined()
  })
})

describe('CreateLeadButton', () => {
  test('flow is x', () => {
    expect(CreateLeadButton.flow).toBe('x')
  })

  test('text is + New Lead', () => {
    expect(CreateLeadButton.text).toBe('+ New Lead')
  })

  test('has onClick handler', () => {
    expect(typeof CreateLeadButton.onClick).toBe('function')
  })
})

describe('State Integration', () => {
  test('project pushed with status=Lead', () => {
    const s = {
      projectTitle: 'Test',
      monthlyValue: 100,
      clientName: 'New Client Co',
      newClientIndustry: '',
      newClientEmail: '',
      newClientPhone: '',
      durationMonths: 2,
      startDate: '2023-01-01',
      update: jest.fn()
    }
    const rState = {
      projects: [],
      clients: [],
      update: jest.fn()
    }
    const el = {
      getRoot: () => ({ state: rState })
    }
    
    // We mocked the Date.now to be consistent if needed, but not strictly required
    const _now = Date.now
    Date.now = jest.fn(() => 123456789)

    CreateLeadModal.Dialog.Actions.CreateLead.onClick(null, el, s)
    expect(rState.update).toHaveBeenCalled()
    const updateCall = rState.update.mock.calls[0][0]
    expect(updateCall.projects.length).toBe(1)
    expect(updateCall.projects[0].status).toBe('Lead')
    expect(updateCall.projects[0].title).toBe('Test')
    expect(updateCall.projects[0].clientId).toBe('c_123456789')
    expect(updateCall.clients.length).toBe(1)
    expect(updateCall.clients[0].name).toBe('New Client Co')

    Date.now = _now
  })
})

describe('DashboardLayout Integration', () => {
  test('BottomSection has HeaderRow with SectionTitle and CreateLeadButton', () => {
    expect(DashboardLayout.Grid.BottomSection.HeaderRow).toBeDefined()
    expect(DashboardLayout.Grid.BottomSection.HeaderRow.SectionTitle).toBeDefined()
    expect(DashboardLayout.Grid.BottomSection.HeaderRow.CreateLeadButton).toBeDefined()
  })

  test('CreateLeadModal exists at DashboardLayout root', () => {
    expect(DashboardLayout.CreateLeadModal).toBeDefined()
  })
})
