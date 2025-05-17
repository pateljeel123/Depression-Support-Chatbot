import { useState, useEffect } from 'react'
import ChatInterface from './components/Chat/ChatInterface'
import MoodTracker from './components/MoodTracker/MoodTracker'
import PHQ9Assessment from './components/Assessment/PHQ9Assessment'
import { AuthContainer } from './components/Auth/AuthComponents'
import UserProfile from './components/Auth/UserProfile'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FiMessageSquare, FiActivity, FiClipboard, FiUser, FiMenu, FiSun, FiMoon, FiX, FiHome } from 'react-icons/fi'

function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  )
}

function AppWithAuth() {
  const { user, isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('chat')
  const [darkMode, setDarkMode] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    } else if (user) {
      const newProfile = {
        name: user.user_metadata?.name || user.email.split('@')[0],
        email: user.email
      }
      setUserProfile(newProfile)
      localStorage.setItem('userProfile', JSON.stringify(newProfile))
    } else {
      setShowOnboarding(true)
    }
  }, [user])

  const handleOnboardingComplete = (profile) => {
    setUserProfile(profile)
    setShowOnboarding(false)
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const OnboardingScreen = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
      name: '',
      age: '',
      language: 'english',
      consentGiven: false
    })

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }

    const nextStep = () => setStep(step + 1)
    const prevStep = () => setStep(step - 1)

    const handleSubmit = () => {
      handleOnboardingComplete(formData)
    }

    return (
      <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transition-all duration-300">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome to Support Companion</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">A safe space for your mental wellbeing journey</p>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What should we call you?
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name or nickname"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Your age"
                  min="13"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button 
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${!formData.name ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                onClick={nextStep}
                disabled={!formData.name}
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Language & Preferences</h2>
              <div className="mb-4">
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
              </div>
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Dark Mode
                </label>
              </div>
              <div className="flex justify-between">
                <button 
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button 
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  onClick={nextStep}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Consent & Privacy</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your privacy is important to us. Please read and agree to our terms before continuing.
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md mb-4">
                <p className="font-medium text-gray-800 dark:text-white mb-2">
                  By using Support Companion, you agree that:
                </p>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Your conversations are private and encrypted</li>
                  <li>We use AI to provide personalized support</li>
                  <li>Your data will never be shared with third parties</li>
                  <li>You can delete your data at any time</li>
                  <li>This is not a replacement for professional medical advice</li>
                </ul>
              </div>
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="consentGiven"
                  name="consentGiven"
                  checked={formData.consentGiven}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="consentGiven" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to the terms and privacy policy
                </label>
              </div>
              <div className="flex justify-between">
                <button 
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button 
                  className={`py-2 px-4 rounded-md text-white font-medium ${!formData.consentGiven ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                  onClick={handleSubmit}
                  disabled={!formData.consentGiven}
                >
                  Get Started
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  const AppContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
    
    const navItems = [
      { id: 'chat', label: 'Chat', icon: <FiMessageSquare /> },
      { id: 'mood', label: 'Mood Tracker', icon: <FiActivity /> },
      { id: 'assessment', label: 'Assessment', icon: <FiClipboard /> }
    ]
    
    return (
      <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-20">
          <button 
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            Support Companion
          </div>
          <button 
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </header>
        
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-md flex flex-col fixed h-full z-10 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'left-0' : '-left-full'} md:left-0`}>
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <FiHome className="text-blue-600 dark:text-blue-400 text-2xl" />
              {sidebarOpen && (
                <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                  Support Companion
                </h1>
              )}
            </div>
            <button 
              className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hidden md:block"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FiMenu />
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            {sidebarOpen ? (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    {userProfile?.name || 'User'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Welcome back
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              </div>
            )}
          </div>
          
          <nav className="flex-1 overflow-y-auto p-2">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center rounded-md p-3 mb-1 ${activeTab === item.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileMenuOpen(false)
                }}
              >
                <span className={`text-lg ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
              onClick={toggleDarkMode}
            >
              <span className="text-lg mr-3">
                {darkMode ? <FiSun /> : <FiMoon />}
              </span>
              {sidebarOpen && (
                <span className="text-sm">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} mt-16 md:mt-0`}>
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {navItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
              {activeTab === 'chat' && <ChatInterface />}
              {activeTab === 'mood' && <MoodTracker />}
              {activeTab === 'assessment' && <PHQ9Assessment />}
            </div>
          </div>
          
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-1">
              <strong className="font-semibold">Emergency:</strong> If you're in crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741
            </p>
            <p>
              This app is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </footer>
        </main>
        
        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
            onClick={toggleMobileMenu}
          ></div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <AuthContainer onAuthSuccess={(user) => console.log('Auth success:', user)} />
  }
  
  if (showOnboarding) {
    return <OnboardingScreen />
  }
  
  return <MainAppContent activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} userProfile={userProfile} />
}

const MainAppContent = ({ activeTab, setActiveTab, darkMode, userProfile }) => {  
  const handleProfileUpdate = (updatedProfile) => {
    console.log('Profile updated:', updatedProfile)
  }
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  
  const navItems = [
    { id: 'chat', label: 'Chat', icon: <FiMessageSquare /> },
    { id: 'mood', label: 'Mood Tracker', icon: <FiActivity /> },
    { id: 'assessment', label: 'Assessment', icon: <FiClipboard /> },
    { id: 'profile', label: 'Profile', icon: <FiUser /> }
  ]
  
  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-20">
        <button 
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <div className="text-xl font-bold text-gray-800 dark:text-white">
          Support Companion
        </div>
        <button 
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => document.documentElement.classList.toggle('dark')}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
      </header>
      
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-md flex flex-col fixed h-full z-10 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'left-0' : '-left-full'} md:left-0`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FiHome className="text-blue-600 dark:text-blue-400 text-2xl" />
            {sidebarOpen && (
              <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                Support Companion
              </h1>
            )}
          </div>
          <button 
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hidden md:block"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FiMenu />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                  {userProfile?.name || 'User'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Welcome back
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`w-full flex items-center rounded-md p-3 mb-1 ${activeTab === item.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
              onClick={() => {
                setActiveTab(item.id)
                setMobileMenuOpen(false)
              }}
            >
              <span className={`text-lg ${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors"
            onClick={() => document.documentElement.classList.toggle('dark')}
          >
            <span className="text-lg mr-3">
              {darkMode ? <FiSun /> : <FiMoon />}
            </span>
            {sidebarOpen && (
              <span className="text-sm">
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} mt-16 md:mt-0`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {navItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
            {activeTab === 'chat' && <ChatInterface />}
            {activeTab === 'mood' && <MoodTracker />}
            {activeTab === 'assessment' && <PHQ9Assessment />}
            {activeTab === 'profile' && <UserProfile userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />}
          </div>
        </div>
        
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-1">
            <strong className="font-semibold">Emergency:</strong> If you're in crisis, call 988 (Suicide & Crisis Lifeline) or text HOME to 741741
          </p>
          <p>
            This app is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </footer>
      </main>
      
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  )
}

export default App