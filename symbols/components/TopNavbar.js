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
    position: 'relative',

    Indicator: {
      position: 'absolute',
      bottom: '-6px',
      height: '3px',
      background: '#10B981',
      boxShadow: '0 0 15px 2px rgba(16, 185, 129, 0.6)',
      borderRadius: 'full',
      zIndex: 10,
      transition: (el, s) => s.root.indicatorInitialized 
        ? 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
        : 'none',
      left: (el, s) => (s.root.indicatorLeft || 0) + 'px',
      width: (el, s) => (s.root.indicatorWidth || 0) + 'px'
    },

    Dashboard: { extends: 'NavLink', href: '/', text: 'Dashboard' },
    Leads: { extends: 'NavLink', href: '/lead', text: 'Leads' },
    Pitched: { extends: 'NavLink', href: '/pitched', text: 'Pitched' },
    Negotiating: { extends: 'NavLink', href: '/negotiating', text: 'Negotiating' },
    Active: { extends: 'NavLink', href: '/contracts', text: 'Active Contracts' },
    Inactive: { extends: 'NavLink', href: '/inactive', text: 'Inactive' }
  }
}