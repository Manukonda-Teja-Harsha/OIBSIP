import React from 'react'
import { DashboardHeader } from '../components/DashboardHeader'
import { WelcomePanel } from '../components/WelcomePanel'
import { UserProfile } from '../components/UserProfile'
import { getLoggedInUser } from '../utils/authService'

function Dashboard() {
  const user = getLoggedInUser()

  if (!user) {
    return (
      <div className="auth-container">
        <div className="card">
          <p className="error-message">User data not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <div className="dashboard-content">
        <WelcomePanel userName={user.name} />
        <UserProfile user={user} />
      </div>
    </div>
  )
}

export default Dashboard
