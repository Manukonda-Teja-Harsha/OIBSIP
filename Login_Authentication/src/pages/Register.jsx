import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormMessage } from '../components/FormMessage'
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isPasswordMatch,
  isNotEmpty
} from '../utils/validation'
import { registerUser, emailExists } from '../utils/authService'

/**
 * Register Component
 * Allows new users to create an account
 */
function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  /**
   * Validates registration form inputs
   */
  const validateForm = () => {
    setError('')

    if (!isNotEmpty(name)) {
      setError('Name is required')
      return false
    }

    if (!isValidName(name)) {
      setError('Name must be at least 2 characters long')
      return false
    }

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

    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (!isPasswordMatch(password, confirmPassword)) {
      setError('Passwords do not match')
      return false
    }

    if (emailExists(email)) {
      setError('This email is already registered. Please use a different email.')
      return false
    }

    return true
  }

  /**
   * Handles registration form submission
   */
  const handleRegister = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate registration delay
    setTimeout(() => {
      try {
        registerUser({ name, email, password })

        setSuccess('Registration successful! Redirecting to login...')
        resetForm()

        // Redirect after short delay
        setTimeout(() => {
          navigate('/login')
        }, 500)
      } catch (err) {
        setError('An error occurred during registration. Please try again.')
        console.error('Registration error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  /**
   * Clears all form fields
   */
  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
  }

  /**
   * Clears form on button click
   */
  const handleClear = () => {
    resetForm()
  }

  return (
    <div className="auth-container">
      <div className="card">
        <h1>Register</h1>
        <p className="card-subtitle">Create a new account to get started</p>

        <FormMessage type="success" message={success} />
        <FormMessage type="error" message={error} />

        <form onSubmit={handleRegister}>
          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">👤 Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

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
              placeholder="Enter your password (min 6 characters)"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label htmlFor="confirmPassword">🔒 Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              disabled={isLoading}
            />
          </div>

          {/* Register and Clear Buttons */}
          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'REGISTER'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={isLoading}
            >
              CLEAR
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="toggle-link">
          Already have an account?
          <button
            className="link-btn"
            onClick={() => navigate('/login')}
            disabled={isLoading}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
