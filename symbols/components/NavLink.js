export const NavLink = {
  extends: 'Link',
  color: 'textSecondary',
  textDecoration: 'none',
  fontWeight: '600',
  transition: 'color 0.2s ease',
  '.active': {
    color: 'white'
  },
  
  onClick: (e, el, s) => {
    e.preventDefault()
    el.getRootState().update({ selectedProjectId: null })
    if (el.router) el.router(el.href, el.getRoot())
  },
  
  onUpdate: (el, s) => {
    const { pathname } = window.location
    const href = el.href
    const isActive = href === pathname || (pathname === '/' && href === '/')
    
    if (isActive && el.node) {
      const { offsetLeft, offsetWidth } = el.node
      const rootState = el.getRootState()
      
      const currentLeft = rootState.indicatorLeft || 0
      const currentWidth = rootState.indicatorWidth || 0

      if (Math.abs(currentLeft - offsetLeft) > 0.1 || Math.abs(currentWidth - offsetWidth) > 0.1) {
        rootState.update({
          indicatorLeft: offsetLeft,
          indicatorWidth: offsetWidth,
          indicatorInitialized: true
        })
      }
    }
  },
  onRender: (el, s) => {
    setTimeout(() => el.onUpdate(el, s), 150)
  }
}
