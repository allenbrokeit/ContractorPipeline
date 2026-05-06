export default {
  // Global dashboard states
  currentDate: new Date().toISOString(),
  targetMonthlyThreshold: 1500,

  // UI State toggles
  isContractModalOpen: false,
  selectedProposalId: null,

  // Entity Data
  clients: [
    { id: 'c_1', name: 'Acme Corp', industry: 'SaaS' },
    { id: 'c_2', name: 'Globex Inc', industry: 'Logistics' },
    { id: 'c_3', name: 'Soylent Corp', industry: 'Food & Beverage' },
    { id: 'c_4', name: 'Initech', industry: 'FinTech' },
    { id: 'c_5', name: 'Umbrella Corp', industry: 'Biotech' }
  ],
  
  proposals: [
    {
      id: 'p_1',
      clientId: 'c_2',
      title: 'QA Automation Framework Setup',
      status: 'Lead',
      estimatedMonthlyValue: 2000,
      proposedDurationMonths: 3
    },
    {
      id: 'p_2',
      clientId: 'c_3',
      title: 'Frontend Replatforming',
      status: 'Negotiating',
      estimatedMonthlyValue: 5000,
      proposedDurationMonths: 6
    },
    {
      id: 'p_3',
      clientId: 'c_1',
      title: 'Monthly Security Audits',
      status: 'Pitched',
      estimatedMonthlyValue: 800,
      proposedDurationMonths: 12
    },
    {
      id: 'p_4',
      clientId: 'c_4',
      title: 'Payment Gateway Integration',
      status: 'Lead',
      estimatedMonthlyValue: 3500,
      proposedDurationMonths: 2
    },
    {
      id: 'p_5',
      clientId: 'c_5',
      title: 'Legacy API Migration',
      status: 'Negotiating',
      estimatedMonthlyValue: 4200,
      proposedDurationMonths: 6
    },
    {
      id: 'p_6',
      clientId: 'c_2',
      title: 'Cloud Infrastructure Audit',
      status: 'Pitched',
      estimatedMonthlyValue: 1500,
      proposedDurationMonths: 1
    },
    {
      id: 'p_7',
      clientId: 'c_4',
      title: 'Mobile App Wireframing',
      status: 'Lead',
      estimatedMonthlyValue: 1800,
      proposedDurationMonths: 2
    }
  ],

  contracts: [
    {
      id: 'ac_1',
      clientId: 'c_1',
      proposalId: null,
      title: 'Retainer: Dev Support',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(), // Started last month
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).toISOString(),   // Ends next month
      durationMonths: 3,
      monthlyValue: 1000,
      status: 'Active'
    },
    {
      id: 'ac_2',
      clientId: 'c_4',
      proposalId: 'p_old_1',
      title: 'Core Infrastructure Setup',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(), // Starts next month
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 4, 15).toISOString(),   // Ends in 4 months
      durationMonths: 3,
      monthlyValue: 2500,
      status: 'Active'
    },
    {
      id: 'ac_3',
      clientId: 'c_5',
      proposalId: 'p_old_2',
      title: 'Data Science Retainer',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1).toISOString(), // Starts in 3 months
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 9, 0).toISOString(),   // Runs 6 months
      durationMonths: 6,
      monthlyValue: 3000,
      status: 'Active'
    },
    {
      id: 'ac_4',
      clientId: 'c_2',
      proposalId: 'p_old_3',
      title: 'Performance Troubleshooting',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(), // Starts next month
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0).toISOString(),   // Runs 1 month
      durationMonths: 1,
      monthlyValue: 4000,
      status: 'Active'
    }
  ]
}
