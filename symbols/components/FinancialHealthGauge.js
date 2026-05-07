export const FinancialHealthGauge = {
  extends: 'Flex',
  padding: 'A',
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: 'Z',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'Y',
  width: '100%',
  marginBottom: 'B',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  
  Label: {
    tag: 'span',
    text: 'Monthly Aggregate vs Target',
    color: 'textSecondary',
    fontSize: 'Z',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },

  GaugeContainer: {
    extends: 'Flex',
    width: '100%', 
    background: 'bgPrimary', 
    height: '12px', 
    borderRadius: 'W', 
    position: 'relative',
    
    Segments: {
      extends: 'Flex',
      height: '100%',
      width: '100%',
      borderRadius: 'W',
      overflow: 'hidden',
      
      childExtends: {
        height: '100%',
        width: (el, s) => {
          const target = s.root.targetMonthlyThreshold || 1500
          const val = s.isProposal ? s.estimatedMonthlyValue : s.monthlyValue
          return `${target > 0 ? (val / target) * 100 : 0}%`
        },
        background: (el, s) => {
          const contracts = s.root.contracts || []
          const target = s.root.targetMonthlyThreshold || 1500
          const currentSum = contracts.reduce((acc, curr) => acc + curr.monthlyValue, 0)
          const isHealthy = currentSum >= target
          return s.isProposal ? 'rgba(59, 130, 246, 0.4)' : (isHealthy ? 'secured' : 'atRisk')
        },
        borderRight: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'width 0.3s ease, background 0.3s ease',
        attr: {
          title: (el, s) => {
            const val = s.isProposal ? s.estimatedMonthlyValue : s.monthlyValue
            return `${s.title}: $${val}/mo${s.isProposal ? ' (Pipeline)' : ''}`
          }
        }
      },
      childrenAs: 'state',
      children: (el, s) => {
        const contracts = s.root.contracts || []
        const pipeline = (s.root.proposals || [])
          .filter(p => p.status !== 'Closed')
          .map(p => ({ ...p, isProposal: true }))
        return [...contracts, ...pipeline]
      }
    },

    TargetMarker: {
      position: 'absolute',
      left: '100%',
      top: '-4px',
      width: '4px',
      height: '20px',
      background: 'white',
      borderRadius: 'V'
    }
  },

  Stats: {
    extends: 'Flex',
    justifyContent: 'space-between', 
    width: '100%', 
    color: 'textPrimary', 
    fontWeight: 'bold',
    
    Current: {
      text: (el, s) => {
        const contracts = s.root.contracts || []
        const proposals = (s.root.proposals || []).filter(p => p.status !== 'Closed')
        const currentSum = contracts.reduce((acc, curr) => acc + curr.monthlyValue, 0)
        const pipeSum = proposals.reduce((acc, curr) => acc + curr.estimatedMonthlyValue, 0)
        return `$${currentSum} secured` + (pipeSum > 0 ? ` + $${pipeSum} pipeline` : '')
      }
    },
    
    Target: {
      text: (el, s) => `Target: $${s.root.targetMonthlyThreshold}`
    }
  }
}
