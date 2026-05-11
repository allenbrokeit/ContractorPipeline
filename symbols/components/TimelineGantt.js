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
      ]
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
        minHeight: '24px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 'W',
        
        Block: {
          display: (el, s) => {
            const currentYear = new Date().getFullYear()
            const start = new Date(s.startDate)
            const diffMonths = (start.getFullYear() - currentYear) * 12 + start.getMonth()
            const overflowLeft = diffMonths < 0 ? Math.abs(diffMonths) : 0
            const visualDuration = Math.max(0, s.durationMonths - overflowLeft)
            return visualDuration <= 0 ? 'none' : 'flex'
          },
          marginLeft: (el, s) => {
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
          minHeight: '100%',
          padding: 'Z Y',
          textAlign: 'center',
          boxSizing: 'border-box',
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
          onClick: (e, el, s) => {
            el.getRootState().update({ selectedProjectId: s.id })
            
            let route = '/'
            if (s.status === 'Lead') route = '/lead'
            else if (s.status === 'Pitched') route = '/pitched'
            else if (s.status === 'Negotiating') route = '/negotiating'
            else if (s.status === 'Active' || s.status === 'Pending') route = '/contracts'
            else if (s.status === 'Declined') route = '/inactive'
            
            el.router(route, el.getRoot())
          },
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
      const projects = (s.root.projects || []).filter(p => p.status !== 'Declined')
      return projects.map(p => {
        const isProposal = ['Lead', 'Pitched', 'Negotiating'].includes(p.status)
        return {
          ...p,
          isProposal
        }
      })
    }
  }
}
