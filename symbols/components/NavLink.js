export const NavLink = {
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
      const parentState = el.parent.state
      if (parentState && (Math.abs(parentState.indicatorLeft - offsetLeft) > 0.1 || 
          Math.abs(parentState.indicatorWidth - offsetWidth) > 0.1)) {
        parentState.update({
          indicatorLeft: offsetLeft,
          indicatorWidth: offsetWidth
        })
      }
    }
  },
  onRender: (el, s) => {
    setTimeout(() => el.onUpdate(el, s), 150)
  }
}
