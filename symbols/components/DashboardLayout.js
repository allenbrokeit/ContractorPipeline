export const DashboardLayout = {
  extend: 'Flex',
  props: {
    padding: 'C',
    background: 'bgPrimary',
    minHeight: '100vh',
    width: '100%',
    fontFamily: 'system-ui, sans-serif',
    flexDirection: 'column',
    gap: 'B'
  },
  
  Header: {
    tag: 'h1',
    props: {
      text: 'Contractor Pipeline & Forecaster',
      color: 'white',
      margin: '0 0 B 0'
    }
  },

  Grid: {
    extend: 'Grid',
    props: {
      gridTemplateColumns: '1fr',
      gap: 'B'
    },
    
    TopSection: {
      extend: 'Flex',
      props: { flexDirection: 'column', gap: 'A' },
      FinancialHealthGauge: { extend: 'FinancialHealthGauge' },
      TimelineGantt: { extend: 'TimelineGantt' }
    },

    BottomSection: {
      extend: 'Flex',
      props: { flexDirection: 'column', gap: 'A' },
      SectionTitle: { tag: 'h2', props: { text: 'Active Pipeline', color: 'white' } },
      ProposalKanbanBoard: { extend: 'ProposalKanbanBoard' }
    }
  },

  ContractFormModal: { extend: 'ContractFormModal' }
}
