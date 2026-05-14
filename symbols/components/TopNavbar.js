export const TopNavbar = {
  extends: 'Flex',
  flow: 'x',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'Z C',
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  flexWrap: 'wrap',

  // Detect mobile→desktop crossover and force indicator recalculation
  onRender: (el, s) => {
    let wasMobile = window.innerWidth <= 900
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 900
      if (wasMobile && !isMobile) {
        // Crossed from mobile to desktop — NavLinks became visible
        // Wait for CSS to apply and elements to become measurable
        setTimeout(() => {
          const navLinks = el.NavLinks
          if (!navLinks) return
          const linkKeys = ['Dashboard', 'Leads', 'Pitched', 'Negotiating', 'Active', 'Inactive']
          linkKeys.forEach(key => {
            const link = navLinks[key]
            if (link && link.onUpdate) link.onUpdate(link, link.state)
          })
        }, 200)
      }
      wasMobile = isMobile
    })
  },
  
  Logo: {
    tag: 'h1',
    text: 'Contractor Pipeline',
    color: 'white',
    fontSize: 'B',
    margin: 0,
    cursor: 'pointer',
    onClick: (e, el) => el.router('/', el.getRoot())
  },

  // Desktop horizontal nav — hidden on mobile
  NavLinks: {
    extends: 'Flex',
    gap: 'B',
    position: 'relative',
    '@media (max-width: 900px)': {
      display: 'none'
    },

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
  },

  // Hamburger button — visible only on mobile
  HamburgerBtn: {
    tag: 'button',
    display: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 'Y',
    '@media (max-width: 900px)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },

    // Three-line hamburger icon built from spans
    gap: '4px',
    width: '24px',

    Bar1: {
      tag: 'span',
      width: '24px',
      height: '2px',
      background: 'white',
      borderRadius: 'V',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: (el, s) => s.root.isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none'
    },
    Bar2: {
      tag: 'span',
      width: '24px',
      height: '2px',
      background: 'white',
      borderRadius: 'V',
      transition: 'opacity 0.3s ease',
      opacity: (el, s) => s.root.isMenuOpen ? '0' : '1'
    },
    Bar3: {
      tag: 'span',
      width: '24px',
      height: '2px',
      background: 'white',
      borderRadius: 'V',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
      transform: (el, s) => s.root.isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none'
    },

    onClick: (e, el, s) => {
      s.root.update({ isMenuOpen: !s.root.isMenuOpen })
    }
  },

  // Mobile dropdown menu — visible only when hamburger is toggled open
  MobileMenu: {
    extends: 'Flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'max-height 0.35s ease, opacity 0.3s ease, padding 0.35s ease',
    maxHeight: (el, s) => s.root.isMenuOpen ? '500px' : '0px',
    opacity: (el, s) => s.root.isMenuOpen ? '1' : '0',
    padding: (el, s) => s.root.isMenuOpen ? 'Y 0' : '0',

    // Only visible at mobile breakpoint
    display: 'none',
    '@media (max-width: 900px)': {
      display: 'flex'
    },

    Dashboard: { extends: 'MobileNavLink', href: '/', LabelWrap: { Label: { text: 'Dashboard' } } },
    Leads: { extends: 'MobileNavLink', href: '/lead', LabelWrap: { Label: { text: 'Leads' } } },
    Pitched: { extends: 'MobileNavLink', href: '/pitched', LabelWrap: { Label: { text: 'Pitched' } } },
    Negotiating: { extends: 'MobileNavLink', href: '/negotiating', LabelWrap: { Label: { text: 'Negotiating' } } },
    Active: { extends: 'MobileNavLink', href: '/contracts', LabelWrap: { Label: { text: 'Active Contracts' } } },
    Inactive: { extends: 'MobileNavLink', href: '/inactive', LabelWrap: { Label: { text: 'Inactive' } } }
  }
}