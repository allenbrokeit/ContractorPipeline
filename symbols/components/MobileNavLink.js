export const MobileNavLink = {
  extends: 'Flex',
  tag: 'a',
  alignItems: 'flex-start',
  flexDirection: 'column',
  position: 'relative',
  padding: 'Y C',
  width: '100%',
  cursor: 'pointer',
  transition: 'color 0.2s ease, background 0.2s ease',
  textDecoration: 'none',
  fontWeight: '600',
  color: (el, s) => {
    const { pathname } = window.location
    const href = el.href
    const isActive = href === pathname || (pathname === '/' && href === '/')
    return isActive ? 'white' : 'textSecondary'
  },
  ':hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white'
  },

  attr: {
    href: (el, s) => el.href
  },

  // Inner wrapper — sizes to text content so lightbar matches text width
  LabelWrap: {
    display: 'inline-flex',
    flexDirection: 'column',
    position: 'relative',
    width: 'fit-content',

    Label: {
      tag: 'span',
      // Default empty — each instance overrides text via LabelWrap.Label.text
      text: ''
    },

    // Slide-in lightbar — starts at scaleX(0), lifecycle animates to scaleX(1)
    ActiveBar: {
      position: 'absolute',
      bottom: '-2px',
      left: '0',
      height: '2px',
      width: '100%',
      background: '#10B981',
      boxShadow: '0 0 10px 1px rgba(16, 185, 129, 0.5)',
      borderRadius: 'full',
      transformOrigin: 'left',
      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      // Always start collapsed — the onRender lifecycle animates it in
      transform: 'scaleX(0)',

      onRender: (el, s) => {
        // Delay so the menu open animation plays first, then the bar slides in
        setTimeout(() => {
          if (!el.node) return
          // ActiveBar -> LabelWrap -> MobileNavLink
          const link = el.parent.parent
          const href = link.href
          const { pathname } = window.location
          const isActive = href === pathname || (pathname === '/' && href === '/')
          el.node.style.transform = isActive ? 'scaleX(1)' : 'scaleX(0)'
        }, 200)
      },

      onUpdate: (el, s) => {
        if (!el.node) return
        const link = el.parent.parent
        const href = link.href
        const { pathname } = window.location
        const isActive = href === pathname || (pathname === '/' && href === '/')
        el.node.style.transform = isActive ? 'scaleX(1)' : 'scaleX(0)'
      }
    }
  },

  onClick: (e, el, s) => {
    e.preventDefault()
    s.root.update({ selectedProjectId: null, isMenuOpen: false })
    const href = el.href
    if (el.router) el.router(href, el.getRoot())
  },

  onRender: (el, s) => {
    setTimeout(() => {
      if (el.update) el.update()
    }, 150)
  }
}
