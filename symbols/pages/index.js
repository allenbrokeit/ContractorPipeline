import { main } from './main.js'
import { LeadPage } from './LeadPage.js'
import { PitchedPage } from './PitchedPage.js'
import { NegotiatingPage } from './NegotiatingPage.js'
import { ActiveContractsPage } from './ActiveContractsPage.js'
import { InactiveContractsPage } from './InactiveContractsPage.js'

export default {
  '/': main,
  '/lead': LeadPage,
  '/pitched': PitchedPage,
  '/negotiating': NegotiatingPage,
  '/contracts': ActiveContractsPage,
  '/inactive': InactiveContractsPage
}