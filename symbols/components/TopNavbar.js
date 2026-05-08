export const TopNavbar = {
  extends: 'Flex',
  flow: 'x',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'Z C',
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  
  Logo: {
    tag: 'h1',
    text: 'Contractor Pipeline',
    color: 'white',
    fontSize: 'B',
    margin: 0,
    cursor: 'pointer',
    onClick: (e, el) => el.router('/', el.getRoot())
  },
  
  NavLinks: {
    extends: 'Flex',
    gap: 'B',
    
    PipelineLink: {
      extends: 'Link', href: '/', text: 'Dashboard',
      color: 'textSecondary', textDecoration: 'none', fontWeight: '600'
    },
    LeadLink: {
      extends: 'Link', href: '/lead', text: 'Leads',
      color: 'textSecondary', textDecoration: 'none', fontWeight: '600'
    },
    PitchedLink: {
      extends: 'Link', href: '/pitched', text: 'Pitched',
      color: 'textSecondary', textDecoration: 'none', fontWeight: '600'
    },
    NegotiatingLink: {
      extends: 'Link', href: '/negotiating', text: 'Negotiating',
      color: 'textSecondary', textDecoration: 'none', fontWeight: '600'
    },
    ContractsLink: {
      extends: 'Link', href: '/contracts', text: 'Active Contracts',
      color: 'textSecondary', textDecoration: 'none', fontWeight: '600'
    },
    InactiveLink: {
      extends: 'Link', href: '/inactive', text: 'Inactive',
      color: 'textSecondary', textDecoration: 'none', fontWeight: '600'
    }
  }
}