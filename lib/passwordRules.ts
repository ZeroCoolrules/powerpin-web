export function validatePassword(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

export function isPasswordValid(password: string) {
  const rules = validatePassword(password)
  return Object.values(rules).every(Boolean)
}
