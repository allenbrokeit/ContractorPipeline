export const DashboardLayout = {
  extends: 'Flex',
  padding: 'C',
  flexDirection: 'column',
  gap: 'B',

  Grid: {
    extends: 'Grid',
    props: {
      gridTemplateColumns: '1fr',
      gap: 'B'
    },
    
    TopSection: {
      extends: 'Flex',
      props: { flexDirection: 'column', gap: 'A' },
      FinancialHealthGauge: { extends: 'FinancialHealthGauge' },
      TimelineGantt: { extends: 'TimelineGantt' }
    },

    BottomSection: {
      extends: 'Flex',
      props: { flexDirection: 'column', gap: 'A' },
      HeaderRow: {
        extends: 'Flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        SectionTitle: { tag: 'h2', text: 'Active Pipeline', color: 'white' },
        CreateLeadButton: {}
      },
      ProposalKanbanBoard: { extends: 'ProposalKanbanBoard' }
    }
  },

  ContractFormModal: { extends: 'ContractFormModal' },
  CreateLeadModal: {}
}
