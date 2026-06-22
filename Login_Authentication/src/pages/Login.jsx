import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormMessage } from '../components/FormMessage'
import { isValidEmail, isNotEmpty } from '../utils/validation'
import { authenticateUser, setLoggedInUser } from '../utils/authService'

/**
 * Login Component
 * Allows users to log in with email and password
 */
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  /**
   * Validates login form inputs
   */
  const validateForm = () => {
    setError('')

    if (!isNotEmpty(email)) {
      setError('Email is required')
      return false
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }

    if (!isNotEmpty(password)) {
      setError('Password is required')
      return false
    }

    return true
  }

  /**
   * Handles login form submission
   */
  const handleLogin = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      try {
        const user = authenticateUser(email, password)

        if (user) {
          setSuccess('Login successful! Redirecting to dashboard...')
          setLoggedInUser(user)

          // Redirect after short delay
          setTimeout(() => {
            navigate('/dashboard')
          }, 500)
        } else {
          setError('Invalid email or password')
        }
      } catch (err) {
        setError('An error occurred during login. Please try again.')
        console.error('Login error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Login</h1>
        <p className="card-subtitle">Welcome back! Please log in to continue</p>

        <FormMessage type="success" message={success} />
        <FormMessage type="error" message={error} />

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">📧 Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {/* Login Button */}
          <div className="button-group full">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </button>
          </div>
        </form>

        {/* Link to Register */}
        <div className="toggle-link">
          Don't have an account?
          <button
            className="link-btn"
            onClick={() => navigate('/register')}
            disabled={isLoading}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
