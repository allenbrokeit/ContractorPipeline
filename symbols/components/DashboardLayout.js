export const DashboardLayout = {
  extends: 'Flex',
  padding: 'C',
  flexDirection: 'column',
  gap: 'B',

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
