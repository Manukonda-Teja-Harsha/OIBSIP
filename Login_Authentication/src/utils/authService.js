/**
 * Authentication Service
 * Handles all localStorage operations for authentication
 */

const USERS_KEY = 'users'
const LOGGED_IN_USER_KEY = 'loggedInUser'

/**
 * Get all registered users from localStorage
 * @returns {Array} - Array of user objects
 */
export const getAllUsers = () => {
  const usersJson = localStorage.getItem(USERS_KEY)
  return usersJson ? JSON.parse(usersJson) : []
}

/**
 * Save all users to localStorage
 * @param {Array} users - Array of user objects
 */
export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/**
 * Register a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Object} - Created user object
 */
export const registerUser = (userData) => {
  const users = getAllUsers()

  const newUser = {
    id: Date.now(),
    name: userData.name.trim(),
    email: userData.email.trim(),
    password: userData.password,
    registeredAt: new Date().toLocaleDateString()
  }

  users.push(newUser)
  saveUsers(users)

  return newUser
}

/**
 * Check if email already exists
 * @param {string} email - Email to check
 * @returns {boolean} - True if email exists
 */
export const emailExists = (email) => {
  const users = getAllUsers()
  return users.some((u) => u.email === email.trim())
}

/**
 * Find user by email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} - User object if found, null otherwise
 */
export const authenticateUser = (email, password) => {
  const users = getAllUsers()
  return users.find((u) => u.email === email && u.password === password) || null
}

/**
 * Set logged-in user session
 * @param {Object} user - User object
 */
export const setLoggedInUser = (user) => {
  localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user))
}

/**
 * Get currently logged-in user
 * @returns {Object|null} - Logged-in user object or null
 */
export const getLoggedInUser = () => {
  const userJson = localStorage.getItem(LOGGED_IN_USER_KEY)
  return userJson ? JSON.parse(userJson) : null
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is logged in
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(LOGGED_IN_USER_KEY)
}

/**
 * Logout user - clear session
 */
export const logoutUser = () => {
  localStorage.removeItem(LOGGED_IN_USER_KEY)
}
