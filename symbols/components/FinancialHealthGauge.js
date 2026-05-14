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
          return `${target > 0 ? (s.monthlyValue / target) * 100 : 0}%`
        },
        background: (el, s) => {
          const projects = s.root.projects || []
          const securedProjects = projects.filter(p => ['Active', 'Pending'].includes(p.status))
          const target = s.root.targetMonthlyThreshold || 1500
          const currentSum = securedProjects.reduce((acc, curr) => acc + curr.monthlyValue, 0)
          const isHealthy = currentSum >= target
          return s.isProposal ? 'rgba(59, 130, 246, 0.4)' : (isHealthy ? 'secured' : 'atRisk')
        },
        borderRight: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'width 0.3s ease, background 0.3s ease',
        attr: {
          title: (el, s) => {
            return `${s.title}: $${s.monthlyValue}/mo${s.isProposal ? ' (Pipeline)' : ''}`
          }
        }
      },
      childrenAs: 'state',
      children: (el, s) => {
        const projects = (s.root.projects || []).filter(p => p.status !== 'Declined')
        return projects.map(p => {
          const isProposal = ['Lead', 'Pitched', 'Negotiating'].includes(p.status)
          return { ...p, isProposal }
        })
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
        const projects = s.root.projects || []
        const secured = projects.filter(p => ['Active', 'Pending'].includes(p.status))
        const pipeline = projects.filter(p => ['Lead', 'Pitched', 'Negotiating'].includes(p.status))
        const currentSum = secured.reduce((acc, curr) => acc + curr.monthlyValue, 0)
        const pipeSum = pipeline.reduce((acc, curr) => acc + curr.monthlyValue, 0)
        return `$${currentSum} secured` + (pipeSum > 0 ? ` + $${pipeSum} pipeline` : '')
      }
    },
    
    Target: {
      extends: 'Flex',
      alignItems: 'center',
      gap: 'W',
      Label: {
        text: 'Target: $'
      },
      Input: {
        tag: 'input',
        type: 'tel',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px dotted rgba(255, 255, 255, 0.4)',
        color: 'textPrimary',
        fontWeight: 'bold',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        outline: 'none',
        width: '85px',
        padding: '0 0 0 Z',
        value: (el, s) => {
          const val = s.root.targetMonthlyThreshold || 0;
          return new Intl.NumberFormat('en-US').format(val);
        },
        onInput: (e, el, s) => {
          const rawString = e.target.value.replace(/\D/g, '');
          const val = parseInt(rawString, 10);
          if (!isNaN(val) && val >= 0) {
            s.root.update({ targetMonthlyThreshold: val });
          } else if (rawString === '') {
            s.root.update({ targetMonthlyThreshold: 0 });
          }
        },
        ':focus': {
          borderBottom: '1px solid rgba(255, 255, 255, 1)'
        }
      }
    }
  }
}
