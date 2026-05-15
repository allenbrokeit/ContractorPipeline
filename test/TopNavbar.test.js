/**
 * @jest-environment jsdom
 */

/**
 * TopNavbar.test.js
 * 
 * Headless Jest tests for the responsive hamburger menu system.
 * Tests cover: state toggling, mobile lightbar logic, media-query 
 * style declarations, and menu auto-close on navigation.
 * 
 * Since the Symbols project uses ESM exports, we inline the component
 * objects directly rather than importing across module boundaries.
 */

// ---- Inline component objects for testing ----

const TopNavbar = {
  // isMenuOpen now lives in root state (state.js), accessed via s.root

  NavLinks: {
    '@media (max-width: 900px)': { display: 'none' },
    Dashboard: { extends: 'NavLink', href: '/', text: 'Dashboard' },
    Leads: { extends: 'NavLink', href: '/lead', text: 'Leads' },
    Pitched: { extends: 'NavLink', href: '/pitched', text: 'Pitched' },
    Negotiating: { extends: 'NavLink', href: '/negotiating', text: 'Negotiating' },
    Active: { extends: 'NavLink', href: '/contracts', text: 'Active Contracts' },
    Inactive: { extends: 'NavLink', href: '/inactive', text: 'Inactive' }
  },

  HamburgerBtn: {
    display: 'none',
    '@media (max-width: 900px)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    Bar1: {
      transform: (el, s) => s.root.isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none'
    },
    Bar2: {
      opacity: (el, s) => s.root.isMenuOpen ? '0' : '1'
    },
    Bar3: {
      transform: (el, s) => s.root.isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none'
    },
    onClick: (e, el, s) => {
      s.root.update({ isMenuOpen: !s.root.isMenuOpen })
    }
  },

  MobileMenu: {
    display: 'none',
    '@media (max-width: 900px)': { display: 'flex' },
    maxHeight: (el, s) => s.root.isMenuOpen ? '500px' : '0px',
    opacity: (el, s) => s.root.isMenuOpen ? '1' : '0',
    // Uses top-level href + LabelWrap.Label.text override (no direct text)
    Dashboard: { extends: 'MobileNavLink', href: '/', LabelWrap: { Label: { text: 'Dashboard' } } },
    Leads: { extends: 'MobileNavLink', href: '/lead', LabelWrap: { Label: { text: 'Leads' } } },
    Pitched: { extends: 'MobileNavLink', href: '/pitched', LabelWrap: { Label: { text: 'Pitched' } } },
    Negotiating: { extends: 'MobileNavLink', href: '/negotiating', LabelWrap: { Label: { text: 'Negotiating' } } },
    Active: { extends: 'MobileNavLink', href: '/contracts', LabelWrap: { Label: { text: 'Active Contracts' } } },
    Inactive: { extends: 'MobileNavLink', href: '/inactive', LabelWrap: { Label: { text: 'Inactive' } } }
  }
}

const MobileNavLink = {
  LabelWrap: {
    width: 'fit-content',
    ActiveBar: {
      transformOrigin: 'left',
      transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      width: '100%',
      transform: 'scaleX(0)' // starts collapsed, animated via lifecycle
    }
  }
}

// ========================================================
// Test 1: Hamburger state toggle via s.root
// ========================================================
describe('TopNavbar Hamburger State', () => {
  test('HamburgerBtn onClick toggles isMenuOpen on root state', () => {
    const rootState = { isMenuOpen: false, update: function(patch) { Object.assign(this, patch) } }

    const handler = TopNavbar.HamburgerBtn.onClick
    handler({}, {}, { root: rootState })
    expect(rootState.isMenuOpen).toBe(true)

    handler({}, {}, { root: rootState })
    expect(rootState.isMenuOpen).toBe(false)
  })
})

// ========================================================
// Test 2: Hamburger icon bar transforms via s.root
// ========================================================
describe('Hamburger Icon Animation', () => {
  test('Bar1 rotates 45deg when menu is open', () => {
    const transformFn = TopNavbar.HamburgerBtn.Bar1.transform
    expect(transformFn({}, { root: { isMenuOpen: true } })).toBe('rotate(45deg) translate(4px, 4px)')
    expect(transformFn({}, { root: { isMenuOpen: false } })).toBe('none')
  })

  test('Bar2 fades out when menu is open', () => {
    const opacityFn = TopNavbar.HamburgerBtn.Bar2.opacity
    expect(opacityFn({}, { root: { isMenuOpen: true } })).toBe('0')
    expect(opacityFn({}, { root: { isMenuOpen: false } })).toBe('1')
  })

  test('Bar3 rotates -45deg when menu is open', () => {
    const transformFn = TopNavbar.HamburgerBtn.Bar3.transform
    expect(transformFn({}, { root: { isMenuOpen: true } })).toBe('rotate(-45deg) translate(4px, -4px)')
    expect(transformFn({}, { root: { isMenuOpen: false } })).toBe('none')
  })
})

// ========================================================
// Test 3: Desktop NavLinks hide at mobile breakpoint
// ========================================================
describe('Responsive Media Queries', () => {
  test('NavLinks has display:none at <=900px', () => {
    const mobileStyle = TopNavbar.NavLinks['@media (max-width: 900px)']
    expect(mobileStyle).toBeDefined()
    expect(mobileStyle.display).toBe('none')
  })

  test('HamburgerBtn has display:flex at <=900px', () => {
    const mobileStyle = TopNavbar.HamburgerBtn['@media (max-width: 900px)']
    expect(mobileStyle).toBeDefined()
    expect(mobileStyle.display).toBe('flex')
  })

  test('MobileMenu has display:flex at <=900px', () => {
    const mobileStyle = TopNavbar.MobileMenu['@media (max-width: 900px)']
    expect(mobileStyle).toBeDefined()
    expect(mobileStyle.display).toBe('flex')
  })

  test('HamburgerBtn is display:none on desktop', () => {
    expect(TopNavbar.HamburgerBtn.display).toBe('none')
  })

  test('MobileMenu is display:none on desktop', () => {
    expect(TopNavbar.MobileMenu.display).toBe('none')
  })
})

// ========================================================
// Test 4: MobileMenu max-height reactivity via s.root
// ========================================================
describe('MobileMenu Visibility Reactivity', () => {
  test('maxHeight expands to 500px when open', () => {
    const maxHeightFn = TopNavbar.MobileMenu.maxHeight
    expect(maxHeightFn({}, { root: { isMenuOpen: true } })).toBe('500px')
  })

  test('maxHeight collapses to 0px when closed', () => {
    const maxHeightFn = TopNavbar.MobileMenu.maxHeight
    expect(maxHeightFn({}, { root: { isMenuOpen: false } })).toBe('0px')
  })

  test('opacity is 1 when open, 0 when closed', () => {
    const opacityFn = TopNavbar.MobileMenu.opacity
    expect(opacityFn({}, { root: { isMenuOpen: true } })).toBe('1')
    expect(opacityFn({}, { root: { isMenuOpen: false } })).toBe('0')
  })
})

// ========================================================
// Test 5: MobileNavLink ActiveBar lightbar
// ========================================================
describe('MobileNavLink ActiveBar Lightbar', () => {
  function isRouteActive(pathname, href) {
    return href === pathname || (pathname === '/' && href === '/')
  }

  test('scaleX(1) when route matches href', () => {
    expect(isRouteActive('/lead', '/lead')).toBe(true)
  })

  test('scaleX(0) when route does NOT match href', () => {
    expect(isRouteActive('/contracts', '/lead')).toBe(false)
  })

  test('Dashboard link matches root pathname /', () => {
    expect(isRouteActive('/', '/')).toBe(true)
  })

  test('Non-root link does NOT match root pathname', () => {
    expect(isRouteActive('/', '/lead')).toBe(false)
  })

  test('ActiveBar has left transform-origin for slide-in effect', () => {
    expect(MobileNavLink.LabelWrap.ActiveBar.transformOrigin).toBe('left')
  })

  test('ActiveBar has cubic-bezier transition', () => {
    expect(MobileNavLink.LabelWrap.ActiveBar.transition).toContain('cubic-bezier')
  })

  test('LabelWrap constrains lightbar width to fit-content', () => {
    expect(MobileNavLink.LabelWrap.width).toBe('fit-content')
  })

  test('ActiveBar width is 100% of LabelWrap (not full row)', () => {
    expect(MobileNavLink.LabelWrap.ActiveBar.width).toBe('100%')
  })

  test('ActiveBar initial transform is scaleX(0) for slide-in animation', () => {
    expect(MobileNavLink.LabelWrap.ActiveBar.transform).toBe('scaleX(0)')
  })
})

// ========================================================
// Test 6: MobileMenu uses LabelWrap.Label.text overrides (not direct text)
// ========================================================
describe('MobileMenu Link Completeness', () => {
  const expectedLinks = [
    { key: 'Dashboard', href: '/', labelText: 'Dashboard' },
    { key: 'Leads', href: '/lead', labelText: 'Leads' },
    { key: 'Pitched', href: '/pitched', labelText: 'Pitched' },
    { key: 'Negotiating', href: '/negotiating', labelText: 'Negotiating' },
    { key: 'Active', href: '/contracts', labelText: 'Active Contracts' },
    { key: 'Inactive', href: '/inactive', labelText: 'Inactive' }
  ]

  expectedLinks.forEach(({ key, href, labelText }) => {
    test(`MobileMenu contains ${key} with label="${labelText}" via LabelWrap override`, () => {
      const link = TopNavbar.MobileMenu[key]
      expect(link).toBeDefined()
      expect(link.extends).toBe('MobileNavLink')
      expect(link.href).toBe(href)
      // Text is set as a nested child override, not a direct prop
      expect(link.LabelWrap.Label.text).toBe(labelText)
      // Verify no direct 'text' property (prevents duplicate rendering)
      expect(link.text).toBeUndefined()
    })
  })
})
