import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { getLoggedInUser } from './utils/authService'

/**
 * Main App Component
 * Sets up routing for the entire application
 */
function App() {
  // Check if user is already logged in when app loads
  useEffect(() => {
    const loggedInUser = getLoggedInUser()
    if (loggedInUser) {
      console.log('User already logged in:', loggedInUser.name)
    }
  }, [])

  return (
    <Router>
      <Routes>
        {/* Route to Login Page - Accessible to everyone */}
        <Route path="/login" element={<Login />} />

        {/* Route to Register Page - Accessible to everyone */}
        <Route path="/register" element={<Register />} />

        {/* Protected Route to Dashboard - Only accessible to logged-in users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route - Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all Route - Redirect to Login for undefined routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
