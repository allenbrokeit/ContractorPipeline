export default {
  color: {
    secured: '#10B981', // Tailwind Emerald 500 equivalent
    atRisk: '#F59E0B',  // Tailwind Amber 500 equivalent
    critical: '#EF4444',// Tailwind Red 500 equivalent
    bgPrimary: '#0F172A', // Dark Slate
    cardBg: '#1E293B',
    border: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8'
  },
  theme: {
    '@dark': {
      color: 'white',
      background: 'black'
    }
  },
  typography: {
    h1: { fontSize: '2em', fontWeight: 'bold', margin: '0 0 1em 0' },
    h2: { fontSize: '1.5em', fontWeight: 'bold', margin: '0 0 0.5em 0' },
    h3: { fontSize: '1.2em', fontWeight: 'bold', margin: '0 0 0.25em 0' },
    label: { fontSize: '0.875em', textTransform: 'uppercase', color: 'gray.5', letterSpacing: '0.05em' }
  },
  spacing: {
    navHeight: '60px',
    sidebarWidth: '240px'
  }
}
