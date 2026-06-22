/**
 * Validation Utilities
 * Contains all form validation logic
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password is at least 6 characters
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

/**
 * Validates name
 * @param {string} name - Name to validate
 * @returns {boolean} - True if name is at least 2 characters
 */
export const isValidName = (name) => {
  return name && name.trim().length >= 2
}

/**
 * Validates if two values match
 * @param {string} value1 - First value
 * @param {string} value2 - Second value
 * @returns {boolean} - True if values match
 */
export const isPasswordMatch = (value1, value2) => {
  return value1 === value2
}

/**
 * Validates that value is not empty
 * @param {string} value - Value to check
 * @returns {boolean} - True if value is not empty
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0
}
