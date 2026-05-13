export const ContractDetailPane = {
  extends: 'Flex',
  flex: 1,
  padding: 'C',
  flexDirection: 'column',
  background: 'rgba(15, 23, 42, 0.2)',
  
  Placeholder: {
    extends: 'Flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'C',
    if: (el, s) => !s.root.selectedProjectId,
    
    EmptyVisual: {
      extends: 'Flex',
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      text: '📄',
      fontSize: 'D',
      marginBottom: 'A'
    },
    Title: {
      tag: 'h2',
      text: 'No Project Selected',
      color: 'white',
      margin: 0,
      fontSize: 'D',
      fontWeight: '600'
    },
    Description: {
      tag: 'p',
      text: 'Select a project from the pipeline on the left to view and edit its detailed information, status, and contact records.',
      color: 'textSecondary',
      fontSize: 'Z',
      margin: 0,
      maxWidth: '400px',
      textAlign: 'center',
      lineHeight: '1.6'
    }
  },
  
  EditorContainer: {
    extends: 'Flex',
    flex: 1,
    if: (el, s) => !!s.root.selectedProjectId,
    
    childExtends: {
      extends: 'Flex',
      flexDirection: 'column',
      flex: 1,
      gap: 'B',
      
      Header: {
        extends: 'Flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: 'B',
        
        TitleGroup: {
          extends: 'Flex',
          flexDirection: 'column',
          gap: 'Z',
          Title: {
            tag: 'h1',
            text: 'Project Details',
            color: 'white',
            margin: 0
          },
          ClientName: {
            color: 'textSecondary',
            fontSize: 'B',
            text: (el, s) => {
              const client = s.root.clients?.find(c => c.id === s.clientId)
              return client ? client.name : ''
            }
          }
        },

        ContactInfo: {
          extends: 'Flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 'Y',
          
          state: {
            isEditing: false,
            email: '',
            phone: '',
            emailError: false,
            phoneError: false
          },

          Header: {
            extends: 'Flex',
            gap: 'Z',
            alignItems: 'center',
            Title: {
              tag: 'span',
              text: 'Contact Info',
              color: 'textSecondary',
              fontSize: 'Z',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            },
            ToggleBtn: {
              tag: 'button',
              padding: 'V X',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: 'V',
              cursor: 'pointer',
              fontSize: 'Y',
              text: (el, s) => s.isEditing ? 'Save' : 'Edit',
              transition: 'background 0.2s',
              ':hover': { background: 'rgba(255, 255, 255, 0.2)' },
              onClick: (e, el, s) => {
                const rootState = el.getRootState()
                const selectedProject = rootState.projects?.find(p => p.id === rootState.selectedProjectId)
                const targetClientId = selectedProject?.clientId

                if (s.isEditing) {
                  // Pre-save validation
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  let digitsOnly = s.phone.replace(/\D/g, '');
                  
                  const isEmailValid = emailRegex.test(s.email);
                  const isPhoneValid = digitsOnly.length >= 10 && digitsOnly.length <= 15;
                  
                  if (!isEmailValid || !isPhoneValid) {
                    s.update({
                      emailError: !isEmailValid,
                      phoneError: !isPhoneValid
                    });
                    return; // Abort save
                  }

                  // Format phone before saving
                  if (digitsOnly.startsWith('1')) digitsOnly = digitsOnly.slice(1);
                  digitsOnly = digitsOnly.slice(0, 10);
                  let formattedPhone = '+1';
                  if (digitsOnly.length > 0) {
                    formattedPhone += ` (${digitsOnly.slice(0, 3)})`;
                    if (digitsOnly.length > 3) formattedPhone += ` ${digitsOnly.slice(3, 6)}`;
                    if (digitsOnly.length > 6) formattedPhone += `-${digitsOnly.slice(6, 10)}`;
                  }

                  // Validated, clear errors and save
                  s.update({ emailError: false, phoneError: false, phone: formattedPhone });

                  if (targetClientId) {
                    const clients = rootState.clients.map(c => {
                      if (c.id === targetClientId) {
                        return { ...c, contactEmail: s.email, contactPhone: formattedPhone }
                      }
                      return c
                    })
                    rootState.update({ clients })
                  }
                  s.update({ isEditing: false })
                } else {
                  // Enter edit mode
                  const client = rootState.clients?.find(c => c.id === targetClientId)
                  s.update({ 
                    isEditing: true, 
                    email: client?.contactEmail || '',
                    phone: client?.contactPhone || '',
                    emailError: false,
                    phoneError: false
                  })
                }
              }
            }
          },

          DisplayMode: {
            extends: 'Flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 'V',
            if: (el, s) => !s.isEditing,
            Email: {
              color: 'textSecondary',
              fontSize: 'Z',
              text: (el, s) => {
                const rootState = el.getRootState()
                const project = rootState.projects?.find(p => p.id === rootState.selectedProjectId)
                const client = rootState.clients?.find(c => c.id === project?.clientId)
                return client?.contactEmail || 'No Email'
              }
            },
            Phone: {
              color: 'textSecondary',
              fontSize: 'Z',
              text: (el, s) => {
                const rootState = el.getRootState()
                const project = rootState.projects?.find(p => p.id === rootState.selectedProjectId)
                const client = rootState.clients?.find(c => c.id === project?.clientId)
                return client?.contactPhone || 'No Phone'
              }
            }
          },

          EditMode: {
            extends: 'Flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 'Z',
            if: (el, s) => s.isEditing,
            EmailInput: {
              tag: 'input',
              type: 'email',
              placeholder: 'Email',
              padding: 'Z',
              background: 'bgPrimary',
              color: 'white',
              border: (el, s) => s.emailError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'W',
              fontSize: 'Z',
              value: (el, s) => s.email,
              onInput: (e, el, s) => {
                const sanitizedEmail = e.target.value.toLowerCase().replace(/\s/g, '');
                s.update({ email: sanitizedEmail, emailError: false });
              }
            },
            PhoneInput: {
              tag: 'input',
              type: 'tel',
              placeholder: 'Phone',
              padding: 'Z',
              background: 'bgPrimary',
              color: 'white',
              border: (el, s) => s.phoneError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'W',
              fontSize: 'Z',
              value: (el, s) => s.phone,
              onInput: (e, el, s) => {
                // Only update raw value on input to prevent cursor jumping and character interleaving
                s.update({ phone: e.target.value, phoneError: false });
              },
              onBlur: (e, el, s) => {
                const raw = e.target.value;
                if (!raw) return;
                
                let digits = raw.replace(/\D/g, '');
                if (digits.startsWith('1')) digits = digits.slice(1);
                digits = digits.slice(0, 10);
                
                let formatted = '';
                if (digits.length > 0) {
                  formatted = '+1';
                  formatted += ` (${digits.slice(0, 3)})`;
                  if (digits.length > 3) formatted += ` ${digits.slice(3, 6)}`;
                  if (digits.length > 6) formatted += `-${digits.slice(6, 10)}`;
                }
                
                s.update({ phone: formatted });
              }
            }
          }
        }
      },
      
      Form: {
        extends: 'Flex',
        flexDirection: 'column',
        gap: 'B',
        maxWidth: '700px',
        
        TitleGroup: {
          extends: 'Flex',
          flexDirection: 'column',
          gap: 'Y',
          Label: { tag: 'label', text: 'Project Title', color: 'textSecondary' },
          Input: {
            tag: 'input',
            padding: 'Z',
            background: 'bgPrimary',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'W',
            value: (el, s) => s.title,
            onInput: (e, el, s) => s.update({ title: e.target.value })
          }
        },
        
        StatusGroup: {
          extends: 'Flex',
          flexDirection: 'column',
          gap: 'Y',
          Label: { tag: 'label', text: 'Status', color: 'textSecondary' },
          StatusOptions: {
            extends: 'Flex',
            gap: 'Z',
            flexWrap: 'wrap',
            childExtends: {
              extends: 'Flex',
              padding: 'Z Y',
              borderRadius: 'V',
              cursor: 'pointer',
              fontSize: 'Z',
              fontWeight: '600',
              border: '1px solid',
              borderColor: (el, s) => el.parent.state.status === s.val ? 'secured' : 'rgba(255,255,255,0.1)',
              background: (el, s) => el.parent.state.status === s.val ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              color: (el, s) => el.parent.state.status === s.val ? 'secured' : 'textSecondary',
              transition: 'all 0.2s ease',
              text: (el, s) => s.label,
              onClick: (e, el, s) => el.parent.state.update({ status: s.val, isStatusManuallySet: true })
            },
            childrenAs: 'state',
            children: [
              { val: 'Lead', label: 'Lead' },
              { val: 'Pitched', label: 'Pitched' },
              { val: 'Negotiating', label: 'Negotiating' },
              { val: 'Pending', label: 'Pending' },
              { val: 'Active', label: 'Active' },
              { val: 'Declined', label: 'Declined' }
            ]
          }
        },
        
        DateValueGroup: {
          extends: 'Grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'B',
          
          StartDate: {
            extends: 'Flex', flexDirection: 'column', gap: 'Y',
            Label: { tag: 'label', text: 'Start Date', color: 'textSecondary' },
            Input: {
              tag: 'input', type: 'date',
              padding: 'Z', background: 'bgPrimary', color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'W',
              style: { colorScheme: 'dark' },
              value: (el, s) => s.startDate ? s.startDate.split('T')[0] : '',
              onInput: (e, el, s) => {
                const newStart = new Date(e.target.value).toISOString();
                s.update({ startDate: newStart });
              }
            }
          },
          Duration: {
            extends: 'Flex', flexDirection: 'column', gap: 'Y',
            Label: { tag: 'label', text: 'Duration (Months)', color: 'textSecondary' },
            Input: {
              tag: 'input', type: 'number', min: '1',
              padding: 'Z', background: 'bgPrimary', color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'W',
              value: (el, s) => s.durationMonths,
              onInput: (e, el, s) => {
                const dur = parseInt(e.target.value, 10) || 1;
                s.update({ durationMonths: dur });
              }
            }
          },
          MonthlyValue: {
            extends: 'Flex', flexDirection: 'column', gap: 'Y',
            Label: { tag: 'label', text: 'Monthly Value ($)', color: 'textSecondary' },
            Input: {
              tag: 'input', type: 'number', min: '0',
              padding: 'Z', background: 'bgPrimary', color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'W',
              value: (el, s) => s.monthlyValue,
              onInput: (e, el, s) => {
                s.update({ monthlyValue: parseInt(e.target.value, 10) || 0 })
              }
            }
          }
        }
      },
      
      Actions: {
        extends: 'Flex',
        gap: 'A',
        marginTop: 'B',
        
        Save: {
          tag: 'button',
          text: 'Save Changes',
          padding: 'Z A',
          background: 'secured',
          color: 'black',
          border: 'none',
          borderRadius: 'W',
          cursor: 'pointer',
          onClick: (e, el, s) => {
            const rootState = el.getRootState()
            const projects = rootState.projects.map(c => {
              if (c.id === s.id) {
                // Merge the localized editable state back into the real project
                return { ...s.parse() }
              }
              return c
            })
            rootState.update({ projects })
          }
        }
      }
    },
    childrenAs: 'state',
    children: (el, s) => {
      const project = s.root.projects?.find(c => c.id === s.root.selectedProjectId)
      return project ? [JSON.parse(JSON.stringify(project))] : []
    }
  }
}