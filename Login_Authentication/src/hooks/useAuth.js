/**
 * Custom Hook - useAuth
 * Manages authentication state and operations
 */

import { useState, useEffect } from 'react'
import {
  getLoggedInUser,
  isAuthenticated as checkIsAuthenticated,
  logoutUser as performLogout
} from '../utils/authService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const loggedInUser = getLoggedInUser()
    setUser(loggedInUser)
    setIsAuthenticated(checkIsAuthenticated())
    setIsLoading(false)
  }, [])

  const logout = () => {
    performLogout()
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout
  }
}
