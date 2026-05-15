export const CreateLeadButton = {
  flow: 'x',
  background: 'secured',
  color: 'black',
  borderRadius: 'W',
  padding: 'Z A',
  cursor: 'pointer',
  text: '+ New Lead',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 0 0 rgba(77, 184, 82, 0)',
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(77, 184, 82, 0.3)'
  },
  onClick: (e, el, s) => s.root.update({ isCreateLeadModalOpen: true })
}
