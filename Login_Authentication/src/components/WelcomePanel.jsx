/**
 * WelcomePanel Component
 * Displays welcome message and info about the dashboard
 */

import React from 'react'

export const WelcomePanel = ({ userName }) => {
  return (
    <div className="welcome-panel">
      <h2 className="welcome-title">Welcome, {userName}! 👋</h2>
      <p className="welcome-subtitle">
        You are now logged in to your secure account. You can view your profile
        information on the right and log out whenever you're ready.
      </p>

      <div className="info-message">
        ℹ️ This is your secure dashboard. All your information is safely stored in
        Local Storage.
      </div>
    </div>
  )
}
