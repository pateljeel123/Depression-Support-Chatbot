import { useState } from 'react'
import { signOut } from '../../services/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import './AuthComponents.css'

const UserProfile = ({ userProfile, onProfileUpdate }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: user?.email || userProfile?.email || '',
    language: userProfile?.language || 'english',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Update profile in localStorage
      const updatedProfile = {
        ...userProfile,
        ...formData
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      
      // In a real app, you would also update the profile in Supabase
      // const { error } = await supabase.from('profiles').upsert({
      //   id: user.id,
      //   ...formData,
      //   updated_at: new Date()
      // })
      // if (error) throw error
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await signOut()
      if (error) throw error
      // Redirect or refresh will happen automatically due to auth state change
    } catch (error) {
      console.error('Error signing out:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to sign out' })
      setLoading(false)
    }
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        <div className="user-profile-header">
          <h2>{isEditing ? 'Edit Profile' : 'Your Profile'}</h2>
          {!isEditing && (
            <button 
              className="edit-profile-btn" 
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        {message && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="language">Preferred Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </select>
            </div>

            <div className="profile-actions">
              <button 
                type="button" 
                className="secondary-btn" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="primary-btn" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-field">
              <span className="field-label">Name:</span>
              <span className="field-value">{userProfile?.name}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email:</span>
              <span className="field-value">{userProfile?.email}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Preferred Language:</span>
              <span className="field-value">
                {userProfile?.language?.charAt(0).toUpperCase() + userProfile?.language?.slice(1) || 'English'}
              </span>
            </div>
          </div>
        )}

        <div className="logout-section">
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile