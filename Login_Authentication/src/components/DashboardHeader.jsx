/**
 * DashboardHeader Component
 * Displays header with logo, date/time, and logout button
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../utils/authService'

export const DashboardHeader = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const navigate = useNavigate()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const formattedTime = currentDateTime.toLocaleTimeString()

  return (
    <div className="dashboard-header">
      <div className="header-left">
        <div className="header-logo">🔐 Auth System</div>
        <div className="header-date">
          {formattedDate} • {formattedTime}
        </div>
      </div>

      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 LOGOUT
        </button>
      </div>
    </div>
  )
}
