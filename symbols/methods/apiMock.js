// Simulating SQLite backend calls
export const updateProposalStatus = (event, element, state) => {
  const { id, status } = element.props
  const rootState = element.getRoot().state
  
  // Optimistic UI Update
  const proposals = rootState.proposals.map(p => {
    if (p.id === id) {
      return { ...p, status }
    }
    return p
  })
  rootState.update({ proposals })

  // Synthetic backend call delay
  setTimeout(() => {
    console.log(`[SQLite UPDATE MOCK] UPDATE Proposals SET status = '${status}' WHERE id = '${id}'`)
    // Normally, if it failed, we'd revert the state here natively.
  }, 400)
}

export const convertProposalToContract = (event, element, state) => {
  const rootState = element.getRoot().state
  const { proposalId, startDate, durationMonths } = element.props
  
  const proposal = rootState.proposals.find(p => p.id === proposalId)
  if (!proposal) return

  // Calculate End Date
  const start = new Date(startDate)
  const endDate = new Date(start.getFullYear(), start.getMonth() + durationMonths, 0).toISOString()

  const newContract = {
    id: `ac_${Date.now()}`,
    clientId: proposal.clientId,
    proposalId: proposal.id,
    title: proposal.title,
    startDate: start.toISOString(),
    endDate,
    durationMonths,
    monthlyValue: proposal.estimatedMonthlyValue,
    status: 'Active'
  }

  // Optimistic Update
  rootState.update({
    contracts: [...rootState.contracts, newContract],
    isContractModalOpen: false,
    selectedProposalId: null
  })

  // Simulated DB Write
  setTimeout(() => {
    console.log(`[SQLite INSERT MOCK] INSERT INTO Contracts...`, newContract)
  }, 500)
}

export const openContractModal = (event, element) => {
  const rootState = element.getRoot().state
  const { id } = element.props
  
  rootState.update({
    isContractModalOpen: true,
    selectedProposalId: id
  })
}

export const closeModal = (event, element) => {
  element.getRoot().state.update({
    isContractModalOpen: false,
    selectedProposalId: null
  })
}
