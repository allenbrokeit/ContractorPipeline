const currentDateStr = new Date().toISOString()

export default {
  // Global dashboard states
  currentDate: currentDateStr,
  targetMonthlyThreshold: 1500,

  // UI State toggles
  isContractModalOpen: false,
  isMenuOpen: false,
  selectedProjectId: null,
  contractSortBy: 'recent',

  // Entity Data
  clients: [
    { id: 'c_1', name: 'Acme Corp', industry: 'SaaS', contactEmail: 'contact@acmecorp.com', contactPhone: '555-0101' },
    { id: 'c_2', name: 'Globex Inc', industry: 'Logistics', contactEmail: 'info@globex.com', contactPhone: '555-0102' },
    { id: 'c_3', name: 'Soylent Corp', industry: 'Food & Beverage', contactEmail: 'hello@soylent.com', contactPhone: '555-0103' },
    { id: 'c_4', name: 'Initech', industry: 'FinTech', contactEmail: 'sales@initech.com', contactPhone: '555-0104' },
    { id: 'c_5', name: 'Umbrella Corp', industry: 'Biotech', contactEmail: 'secure@umbrella.com', contactPhone: '555-0105' }
  ],
  
  projects: [
    {
      id: 'p_1',
      clientId: 'c_2',
      title: 'QA Automation Framework Setup',
      status: 'Lead',
      monthlyValue: 2000,
      durationMonths: 3,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    {
      id: 'p_2',
      clientId: 'c_3',
      title: 'Frontend Replatforming',
      status: 'Negotiating',
      monthlyValue: 5000,
      durationMonths: 6,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    {
      id: 'p_3',
      clientId: 'c_1',
      title: 'Monthly Security Audits',
      status: 'Pitched',
      monthlyValue: 800,
      durationMonths: 12,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    {
      id: 'p_4',
      clientId: 'c_4',
      title: 'Payment Gateway Integration',
      status: 'Lead',
      monthlyValue: 3500,
      durationMonths: 2,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    {
      id: 'p_5',
      clientId: 'c_5',
      title: 'Legacy API Migration',
      status: 'Negotiating',
      monthlyValue: 4200,
      durationMonths: 6,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    {
      id: 'p_6',
      clientId: 'c_2',
      title: 'Cloud Infrastructure Audit',
      status: 'Pitched',
      monthlyValue: 1500,
      durationMonths: 1,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    {
      id: 'p_7',
      clientId: 'c_4',
      title: 'Mobile App Wireframing',
      status: 'Lead',
      monthlyValue: 1800,
      durationMonths: 2,
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    },
    {
      id: 'ac_1',
      clientId: 'c_1',
      title: 'Retainer: Dev Support',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(),
      durationMonths: 3,
      monthlyValue: 1000,
      status: 'Active'
    },
    {
      id: 'ac_2',
      clientId: 'c_4',
      title: 'Core Infrastructure Setup',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(),
      durationMonths: 3,
      monthlyValue: 2500,
      status: 'Pending'
    },
    {
      id: 'ac_3',
      clientId: 'c_5',
      title: 'Data Science Retainer',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 3, 1).toISOString(),
      durationMonths: 6,
      monthlyValue: 3000,
      status: 'Pending'
    },
    {
      id: 'ac_4',
      clientId: 'c_2',
      title: 'Performance Troubleshooting',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
      durationMonths: 1,
      monthlyValue: 4000,
      status: 'Pending'
    }
  ]
}