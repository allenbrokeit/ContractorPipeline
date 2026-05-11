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
    
    state: {
      indicatorLeft: 0,
      indicatorWidth: 0
    },

    Indicator: {
      position: 'absolute',
      bottom: '-6px',
      height: '3px',
      background: '#10B981',
      boxShadow: '0 0 15px 2px rgba(16, 185, 129, 0.6)',
      borderRadius: 'full',
      zIndex: 10,
      transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      left: (el, s) => s.indicatorLeft + 'px',
      width: (el, s) => s.indicatorWidth + 'px'
    },

    childExtends: {
      extends: 'Link',
      color: 'textSecondary',
      textDecoration: 'none',
      fontWeight: '600',
      transition: 'color 0.2s ease',
      '.active': {
        color: 'white'
      },
      
      onUpdate: (el, s) => {
        const { pathname } = window.location
        const href = el.href
        const isActive = href === pathname || (pathname === '/' && href === '/')
        
        if (isActive && el.node) {
          const { offsetLeft, offsetWidth } = el.node
          // Use el.parent.state directly
          if (Math.abs(el.parent.state.indicatorLeft - offsetLeft) > 0.1 || 
              Math.abs(el.parent.state.indicatorWidth - offsetWidth) > 0.1) {
            el.parent.state.update({
              indicatorLeft: offsetLeft,
              indicatorWidth: offsetWidth
            })
          }
        }
      },
      onRender: (el, s) => {
        // Initial measurement
        setTimeout(() => el.onUpdate(el, s), 100)
      }
    },

    Dashboard: { extends: 'NavLink', href: '/', text: 'Dashboard' },
    Leads: { extends: 'NavLink', href: '/lead', text: 'Leads' },
    Pitched: { extends: 'NavLink', href: '/pitched', text: 'Pitched' },
    Negotiating: { extends: 'NavLink', href: '/negotiating', text: 'Negotiating' },
    Active: { extends: 'NavLink', href: '/contracts', text: 'Active Contracts' },
    Inactive: { extends: 'NavLink', href: '/inactive', text: 'Inactive' }
  }
}