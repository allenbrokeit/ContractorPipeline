const COUNTRY_CODES = [
  // North America
  { id: 'us', code: '+1', flag: '🇺🇸', name: 'United States' },
  { id: 'ca', code: '+1', flag: '🇨🇦', name: 'Canada' },
  { id: 'mx', code: '+52', flag: '🇲🇽', name: 'Mexico' },
  // Europe & UK
  { id: 'gb', code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { id: 'ie', code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { id: 'no', code: '+47', flag: '🇳🇴', name: 'Norway' },
  { id: 'be', code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { id: 'es', code: '+34', flag: '🇪🇸', name: 'Spain' },
  { id: 'pt', code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { id: 'de', code: '+49', flag: '🇩🇪', name: 'Germany' },
  { id: 'fr', code: '+33', flag: '🇫🇷', name: 'France' },
  { id: 'it', code: '+39', flag: '🇮🇹', name: 'Italy' },
  // Central & South America
  { id: 'br', code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { id: 'ar', code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { id: 'cr', code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  // Asia & Pacific
  { id: 'jp', code: '+81', flag: '🇯🇵', name: 'Japan' },
  { id: 'kr', code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { id: 'cn', code: '+86', flag: '🇨🇳', name: 'China' },
  { id: 'my', code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { id: 'sg', code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { id: 'ph', code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { id: 'au', code: '+61', flag: '🇦🇺', name: 'Australia' },
  { id: 'nz', code: '+64', flag: '🇳🇿', name: 'New Zealand' }
];

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
            countryId: 'us',
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
                  const isPhoneValid = digitsOnly.length >= 7 && digitsOnly.length <= 15; // Support intl bounds
                  
                  if (!isEmailValid || !isPhoneValid) {
                    s.update({
                      emailError: !isEmailValid,
                      phoneError: !isPhoneValid
                    });
                    return; // Abort save
                  }

                  // Format phone before saving
                  const selectedCountry = COUNTRY_CODES.find(c => c.id === s.countryId) || COUNTRY_CODES[0];
                  let formattedPhone = selectedCountry.code;
                  
                  if (digitsOnly.length === 10) {
                    formattedPhone += ` (${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
                  } else if (digitsOnly.length === 11) {
                    formattedPhone += ` (${digitsOnly.slice(0, 4)}) ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 11)}`;
                  } else {
                    let chunks = [];
                    // Fallback for odd lengths: group by 3s or 4s
                    const match = digitsOnly.match(/.{1,4}/g);
                    if (match) formattedPhone += ` ${match.join(' ')}`;
                  }

                  // Validated, clear errors and save
                  s.update({ emailError: false, phoneError: false, phone: formattedPhone });

                  if (targetClientId) {
                    const clients = rootState.clients.map(c => {
                      if (c.id === targetClientId) {
                        return { ...c, contactEmail: s.email, contactPhone: formattedPhone, contactCountryId: s.countryId }
                      }
                      return c
                    })
                    rootState.update({ clients })
                  }
                  s.update({ isEditing: false })
                } else {
                  // Enter edit mode
                  const client = rootState.clients?.find(c => c.id === targetClientId)
                  let initPhone = client?.contactPhone || '';
                  let initCountryId = client?.contactCountryId || 'us'; // Fallback to saved ID, if available
                  
                  // If we don't have a saved ID, guess from string
                  if (!client?.contactCountryId && initPhone) {
                    const matched = COUNTRY_CODES.find(c => initPhone.startsWith(c.code));
                    if (matched) {
                      initCountryId = matched.id;
                      initPhone = initPhone.slice(matched.code.length).trim();
                    }
                  } else if (client?.contactCountryId) {
                    // We DO have a saved ID, strip its code from the phone for pure editing
                    const matched = COUNTRY_CODES.find(c => c.id === initCountryId);
                    if (matched && initPhone.startsWith(matched.code)) {
                      initPhone = initPhone.slice(matched.code.length).trim();
                    }
                  }

                  s.update({ 
                    isEditing: true, 
                    email: client?.contactEmail || '',
                    phone: initPhone,
                    countryId: initCountryId,
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
                const phone = client?.contactPhone || 'No Phone'
                if (!client?.contactCountryId) return phone;
                
                const matched = COUNTRY_CODES.find(c => c.id === client.contactCountryId)
                return matched ? `${matched.flag} ${phone}` : phone;
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
            PhoneInputGroup: {
              extends: 'Flex',
              alignItems: 'center',
              background: 'bgPrimary',
              border: (el, s) => s.phoneError ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'W',
              overflow: 'hidden',
              
              CountrySelect: {
                tag: 'select',
                padding: 'Z Y Z Z',
                background: 'transparent',
                color: 'white',
                border: 'none',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                outline: 'none',
                cursor: 'pointer',
                fontSize: 'Z',
                value: (el, s) => s.countryId,
                onChange: (e, el, s) => {
                  s.update({ countryId: e.target.value })
                },
                childExtends: {
                  tag: 'option',
                  attr: { 
                    value: (el, s) => s.id,
                    selected: (el, s) => el.parent.state.countryId === s.id
                  },
                  text: (el, s) => `${s.flag} ${s.code}`,
                  style: { color: 'black' }
                },
                childrenAs: 'state',
                children: COUNTRY_CODES
              },
              
              PhoneInput: {
                tag: 'input',
                flex: 1,
                type: 'tel',
                placeholder: 'Phone',
                padding: 'Z',
                background: 'transparent',
                color: 'white',
                border: 'none',
                outline: 'none',
                fontSize: 'Z',
                value: (el, s) => s.phone,
                onInput: (e, el, s) => {
                  s.update({ phone: e.target.value, phoneError: false });
                },
                onBlur: (e, el, s) => {
                  const raw = e.target.value;
                  if (!raw) return;
                  
                  let digits = raw.replace(/\D/g, '');
                  
                  let formatted = '';
                  const selectedCountry = COUNTRY_CODES.find(c => c.id === s.countryId) || COUNTRY_CODES[0];
                  
                  if (digits.length === 10) {
                    formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
                  } else if (digits.length === 11) {
                    formatted = `(${digits.slice(0, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
                  } else {
                    const match = digits.match(/.{1,4}/g);
                    if (match) formatted = match.join(' ');
                  }
                  
                  s.update({ phone: formatted });
                }
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