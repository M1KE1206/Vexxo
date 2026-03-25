// src/lib/profileValidation.js
// Retourneert null (geldig) of een i18n-sleutel (ongeldig)

const HAS_HTML = /<|>/

export const profileValidators = {
  full_name(v) {
    if (!v) return null
    if (HAS_HTML.test(v)) return 'profile.validation.noHtml'
    if (v.length > 100) return 'profile.validation.max100'
    return null
  },
  phone(v) {
    if (!v) return null
    if (!/^\+?[\d\s\-()\[\]]{6,20}$/.test(v.trim())) return 'profile.validation.invalidPhone'
    return null
  },
  address_street(v) {
    if (!v) return null
    if (HAS_HTML.test(v)) return 'profile.validation.noHtml'
    if (v.length > 200) return 'profile.validation.max200'
    return null
  },
  address_city(v) {
    if (!v) return null
    if (HAS_HTML.test(v)) return 'profile.validation.noHtml'
    if (v.length > 100) return 'profile.validation.max100'
    return null
  },
  address_zip(v) {
    if (!v) return null
    if (v.length > 20) return 'profile.validation.max20'
    return null
  },
  address_country(v) {
    if (!v) return null
    if (HAS_HTML.test(v)) return 'profile.validation.noHtml'
    if (v.length > 100) return 'profile.validation.max100'
    return null
  },
}
