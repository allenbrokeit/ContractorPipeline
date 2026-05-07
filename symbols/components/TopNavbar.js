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
      extends: 'Link',
      href: '/',
      text: 'Pipeline',
      color: (el) => window.location.pathname === '/' ? 'white' : 'textSecondary',
      textDecoration: 'none',
      fontWeight: '600'
    },
    
    ContractsLink: {
      extends: 'Link',
      href: '/contracts',
      text: 'Active Contracts',
      color: (el) => window.location.pathname === '/contracts' ? 'white' : 'textSecondary',
      textDecoration: 'none',
      fontWeight: '600'
    }
  }
}