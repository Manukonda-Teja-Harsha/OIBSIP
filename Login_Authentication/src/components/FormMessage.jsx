import React from 'react'

export const FormMessage = ({ type = 'error', message }) => {
  if (!message) return null
  
  const className = type === 'error' ? 'error-message' : 'success-message'
  const icon = type === 'error' ? '✕' : '✓'

  return <div className={className}>{icon} {message}</div>
}
