/**
 * UserProfile Component
 * Displays user profile information and details
 */

import React, { useState, useEffect } from 'react'

export const UserProfile = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const profileDetails = [
    { label: '📧 Email:', value: user.email },
    { label: '👤 Name:', value: user.name },
    { label: '📅 Registered:', value: user.registeredAt || 'Just now' },
    { label: '🕐 Current Time:', value: currentTime },
    { label: '✅ Status:', value: 'Active', color: '#28a745' }
  ]

  return (
    <div className="user-profile">
      {/* Profile Header with Avatar */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        {profileDetails.map((detail, index) => (
          <div key={index} className="detail-item">
            <span className="detail-label">{detail.label}</span>
            <span
              className="detail-value"
              style={detail.color ? { color: detail.color } : {}}
            >
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
