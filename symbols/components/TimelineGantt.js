export const TimelineGantt = {
  extend: 'Flex',
  props: {
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
    }
  },
  
  Header: {
    tag: 'h2',
    props: { text: '12-Month Capacity Forecast', margin: 0, color: 'textPrimary' }
  },

  Grid: {
    extend: 'Grid',
    props: {
      gridTemplateColumns: '150px repeat(4, 1fr)',
      gap: 'X',
      borderBottom: '1px solid',
      borderColor: 'border',
      paddingBottom: 'Y',
      color: 'textSecondary',
      fontSize: 'Z'
    },
    Label: { props: { text: 'Client / Duration' } },
    Months: {
      props: { display: 'contents' },
      childExtends: {
        props: (el, s) => ({
          text: s.title,
          textAlign: 'center',
          fontWeight: '500'
        })
      },
      children: () => [
        { title: 'Q1 (Jan-Mar)' },
        { title: 'Q2 (Apr-Jun)' },
        { title: 'Q3 (Jul-Sep)' },
        { title: 'Q4 (Oct-Dec)' }
      ].map(q => ({ state: { title: q.title } }))
    }
  },

  Rows: {
    extend: 'Flex',
    props: { flexDirection: 'column', gap: 'Y', paddingTop: 'Y' },
    childExtends: {
      extend: 'Grid',
      props: {
        gridTemplateColumns: '150px repeat(4, 1fr)',
        gap: 'X',
        alignItems: 'center'
      },
      ClientLabel: {
        props: (el, s) => {
          const client = s.root.clients?.find(c => c.id === s.clientId)
          return {
            text: client ? client.name : 'Unknown',
            color: 'textPrimary',
            fontSize: 'Z',
            fontWeight: '600'
          }
        }
      },
      Tracks: {
        extend: 'Flex',
        props: {
          gridColumn: '2 / span 4',
          position: 'relative',
          height: '24px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'W'
        },
        Block: {
          props: (el, s) => {
            // Calculate start and end mathematically offset to current year mapping across 4 quarters (12 invisible months)
            const currentYear = new Date().getFullYear()
            const start = new Date(s.startDate)
            const diffMonths = (start.getFullYear() - currentYear) * 12 + start.getMonth()
            
            const startCol = Math.max(0, diffMonths)
            const overflowLeft = diffMonths < 0 ? Math.abs(diffMonths) : 0
            const visualDuration = Math.max(0, s.durationMonths - overflowLeft)
            
            return {
              position: 'absolute',
              display: visualDuration <= 0 ? 'none' : 'flex',
              left: `${(startCol / 12) * 100}%`,
              width: `${(visualDuration / 12) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, rgba(59,130,246,0.85) 0%, rgba(37,99,235,0.85) 100%)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
              borderRadius: 'W',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'Y',
              text: `$${s.monthlyValue}/mo`,
              cursor: 'pointer',
              transition: 'transform 0.2s ease, filter 0.2s ease, z-index 0s',
              ':hover': {
                transform: 'scale(1.02)',
                filter: 'brightness(1.15)',
                zIndex: 10
              }
            }
          }
        }
      }
    },
    children: (el, s) => (s.root.contracts || []).map(c => ({ state: c }))
  }
}

