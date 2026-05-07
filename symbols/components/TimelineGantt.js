export const TimelineGantt = {
  extends: 'Flex',
  padding: 'A',
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: 'Z',
  flexDirection: 'column',
  gap: 'A',
  marginBottom: 'B',
  transition: 'box-shadow 0.2s ease, border 0.2s ease',
  ':hover': {
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  Header: {
    tag: 'h2',
    text: '12-Month Capacity Forecast',
    margin: 0,
    color: 'textPrimary'
  },

  Grid: {
    extends: 'Grid',
    gridTemplateColumns: '150px repeat(4, 1fr)',
    gap: 'X',
    borderBottom: '1px solid',
    borderColor: 'border',
    paddingBottom: 'Y',
    color: 'textSecondary',
    fontSize: 'Z',
    
    Label: { text: 'Client / Duration' },
    Months: {
      display: 'contents',
      childExtends: {
        text: (el, s) => s.title,
        textAlign: 'center',
        fontWeight: '500'
      },
      childrenAs: 'state',
      children: () => [
        { title: 'Q1 (Jan-Mar)' },
        { title: 'Q2 (Apr-Jun)' },
        { title: 'Q3 (Jul-Sep)' },
        { title: 'Q4 (Oct-Dec)' }
      ].map(q => ({ state: { title: q.title } }))
    }
  },

  Rows: {
    extends: 'Flex',
    flexDirection: 'column',
    gap: 'Y',
    paddingTop: 'Y',
    
    childExtends: {
      extends: 'Grid',
      gridTemplateColumns: '150px repeat(4, 1fr)',
      gap: 'X',
      alignItems: 'center',
      
      ClientLabel: {
        text: (el, s) => {
          const client = s.root.clients?.find(c => c.id === s.clientId)
          return `${client ? client.name : 'Unknown'} - ${s.title || 'Untitled'}`
        },
        color: 'textPrimary',
        fontSize: 'Z',
        fontWeight: '600'
      },
      Tracks: {
        extends: 'Flex',
        gridColumn: '2 / span 4',
        position: 'relative',
        height: '24px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 'W',
        
        Block: {
          position: 'absolute',
          display: (el, s) => {
            const currentYear = new Date().getFullYear()
            const start = new Date(s.startDate)
            const diffMonths = (start.getFullYear() - currentYear) * 12 + start.getMonth()
            const overflowLeft = diffMonths < 0 ? Math.abs(diffMonths) : 0
            const visualDuration = Math.max(0, s.durationMonths - overflowLeft)
            return visualDuration <= 0 ? 'none' : 'flex'
          },
          left: (el, s) => {
            const currentYear = new Date().getFullYear()
            const start = new Date(s.startDate)
            const diffMonths = (start.getFullYear() - currentYear) * 12 + start.getMonth()
            const startCol = Math.max(0, diffMonths)
            return `${(startCol / 12) * 100}%`
          },
          width: (el, s) => {
            const currentYear = new Date().getFullYear()
            const start = new Date(s.startDate)
            const diffMonths = (start.getFullYear() - currentYear) * 12 + start.getMonth()
            const startCol = Math.max(0, diffMonths)
            const overflowLeft = diffMonths < 0 ? Math.abs(diffMonths) : 0
            let visualDuration = Math.max(0, s.durationMonths - overflowLeft)
            if (startCol + visualDuration > 12) {
              visualDuration = Math.max(0, 12 - startCol)
            }
            return `${(visualDuration / 12) * 100}%`
          },
          height: '100%',
          background: (el, s) => s.isProposal ? 'rgba(59,130,246,0.3)' : 'linear-gradient(90deg, rgba(59,130,246,0.85) 0%, rgba(37,99,235,0.85) 100%)',
          backdropFilter: 'blur(4px)',
          border: (el, s) => s.isProposal ? '1px dashed rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.15)',
          boxShadow: (el, s) => s.isProposal ? 'none' : '0 4px 12px rgba(37,99,235,0.2)',
          borderRadius: 'W',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 'Y',
          text: (el, s) => `${s.title} ($${s.monthlyValue}/mo)${s.isProposal ? ' [Pipeline]' : ''}`,
          attr: { title: (el, s) => s.title },
          cursor: 'pointer',
          transition: 'transform 0.2s ease, filter 0.2s ease, z-index 0s',
          ':hover': {
            transform: 'scale(1.02)',
            filter: 'brightness(1.15)',
            zIndex: 10
          }
        }
      }
    },
    childrenAs: 'state',
    children: (el, s) => {
      const contracts = s.root.contracts || []
      const pipeline = (s.root.proposals || [])
        .filter(p => p.status !== 'Closed')
        .map(p => ({
          ...p,
          isProposal: true,
          startDate: new Date().toISOString(), // Assuming proposals start immediately for the forecast
          durationMonths: p.proposedDurationMonths,
          monthlyValue: p.estimatedMonthlyValue
        }))
      return [...contracts, ...pipeline]
    }
  }
}
