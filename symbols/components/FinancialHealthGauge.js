export const FinancialHealthGauge = {
  extend: 'Flex',
  props: {
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
    }
  },
  
  Label: {
    tag: 'span',
    props: {
      text: 'Monthly Aggregate vs Target',
      color: 'textSecondary',
      fontSize: 'Z',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  },

  GaugeContainer: {
    extend: 'Flex',
    props: { width: '100%', background: 'bgPrimary', height: '12px', borderRadius: 'W', position: 'relative' },
    
    Bar: {
      props: (el, s) => {
        const contracts = s.root.contracts || []
        const target = s.root.targetMonthlyThreshold || 1500
        
        // Sum active values (Assuming all contracts in state are active for current month for simplicity here)
        const currentSum = contracts.reduce((acc, curr) => acc + curr.monthlyValue, 0)
        const pct = Math.min((currentSum / target) * 100, 100)
        
        const isHealthy = currentSum >= target
        
        return {
          height: '100%',
          width: `${pct}%`,
          background: isHealthy ? 'secured' : 'atRisk',
          borderRadius: 'W',
          transition: 'width 0.3s ease, background 0.3s ease'
        }
      }
    },

    TargetMarker: {
      props: {
        position: 'absolute',
        left: '100%', // Represents 100% of the threshold $1500 target. Max width 100%
        top: '-4px',
        width: '4px',
        height: '20px',
        background: 'white',
        borderRadius: 'V'
      }
    }
  },

  Stats: {
    extend: 'Flex',
    props: { justifyContent: 'space-between', width: '100%', color: 'textPrimary', fontWeight: 'bold' },
    
    Current: {
      props: (el, s) => {
        const contracts = s.root.contracts || []
        const currentSum = contracts.reduce((acc, curr) => acc + curr.monthlyValue, 0)
        return { text: `$${currentSum} secured` }
      }
    },
    
    Target: {
      props: (el, s) => ({ text: `Target: $${s.root.targetMonthlyThreshold}` })
    }
  }
}
