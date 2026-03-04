import symbols from '../symbols.json' with { type: 'json' }

const isBrowser = symbols.bundler === 'browser'
const cdnProviders = ['esm.sh', 'unpkg', 'skypack', 'jsdelivr', 'pkg.symbo.ls']
const isCdn = cdnProviders.includes(symbols.packageManager)

export default {
  bundler: symbols.bundler,
  packageManager: symbols.packageManager,
  prepareDependencies: isBrowser && isCdn
}
