export const ContractsPage = {
  extends: 'Page',
  background: 'bgPrimary',
  minHeight: '100vh',
  width: '100%',
  fontFamily: 'system-ui, sans-serif',
  display: 'flex',
  flexDirection: 'column',

  TopNavbar: {},
  
  SplitPane: {
    extends: 'Grid',
    flex: 1,
    gridTemplateColumns: '350px 1fr',
    
    ContractListPane: {},
    ContractDetailPane: {}
  }
}