import { useState, useEffect, useRef } from 'react'
import './ChatInterface.css'
import mistralService from '../../services/mistralService'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [apiError, setApiError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Show welcome message on first load
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          text: "Hello, I'm Dr. Hope. I'm here to provide you with professional support for depression, anxiety, and mood disorders. How are you feeling today? Remember, this is a safe space to share your thoughts and feelings.",
          isUser: false,
          timestamp: new Date()
        }
      ])
    }, 1000)
  }, [])

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    // Add user message
    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    }
    setMessages([...messages, userMessage])
    setInputValue('')
    setIsTyping(true)
    setApiError(null)

    try {
      // Get AI response from Mistral API
      const aiResponse = await mistralService.generateResponse([
        ...messages, 
        userMessage
      ])
      
      const botMessage = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prevMessages => [...prevMessages, botMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      setApiError('Sorry, I had trouble connecting. Please try again.')
      
      // Fallback to local response if API fails
      const fallbackMessage = {
        text: getFallbackResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prevMessages => [...prevMessages, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Fallback response when API fails - using therapeutic language
  const getFallbackResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase()
    
    if (lowercaseInput.includes('sad') || lowercaseInput.includes('depress') || lowercaseInput.includes('down')) {
      return "I understand you're experiencing feelings of sadness, which is a natural human emotion. From a clinical perspective, persistent sadness can be part of depression, but it's important we explore the context and duration of these feelings. Could you share more about when these feelings started and what situations might trigger them? This will help me better understand your experience."
    } else if (lowercaseInput.includes('happy') || lowercaseInput.includes('good') || lowercaseInput.includes('great')) {
      return "I'm pleased to hear you're experiencing positive emotions. In therapeutic practice, we recognize the importance of acknowledging these moments. Could you identify what specific factors or activities contributed to this positive state? Understanding these patterns can be valuable for developing coping strategies during more challenging periods."
    } else if (lowercaseInput.includes('help') || lowercaseInput.includes('suicide') || lowercaseInput.includes('die')) {
      return "I'm hearing concerning statements that require immediate attention. As a medical professional, I must emphasize that thoughts of self-harm represent a clinical emergency. Please contact emergency services immediately by calling 988 in the US, or go to your nearest emergency room. These thoughts are often symptoms of treatable conditions, not reflections of reality. Would you like me to provide additional crisis resources that have proven effective for many patients?"
    } else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || lowercaseInput.includes('hey')) {
      return "Hello. I'm Dr. Hope, a psychiatrist specializing in mood disorders and depression. I'd like to begin by understanding your current emotional state. On a scale of 1-10, how would you rate your mood today? And have there been any significant changes in your sleep, appetite, or energy levels recently?"
    } else if (lowercaseInput.includes('anxious') || lowercaseInput.includes('anxiety') || lowercaseInput.includes('worry')) {
      return "Anxiety symptoms are quite common and can manifest both physically and emotionally. From a clinical standpoint, I'd like to understand if you're experiencing physical symptoms like increased heart rate or tension, as well as thought patterns such as excessive worry or catastrophizing. CBT techniques can be particularly effective for anxiety management. Could you describe what situations tend to trigger your anxiety?"
    } else if (lowercaseInput.includes('sleep') || lowercaseInput.includes('insomnia') || lowercaseInput.includes('tired')) {
      return "Sleep disturbances are significant clinical indicators that I pay close attention to in my practice. Changes in sleep patterns can both result from and contribute to mood disorders. I'd recommend we explore your sleep hygiene practices and consider techniques like stimulus control and sleep restriction therapy, which have strong evidence bases. Could you describe your typical sleep routine?"
    } else {
      return "Thank you for sharing that with me. In our therapeutic relationship, it's important that I understand not just what you're experiencing, but how these experiences affect you emotionally. Could you elaborate on how these circumstances have been impacting your daily functioning and emotional wellbeing?"
    }
  }

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="doctor-profile">
          <div className="doctor-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="#ffffff">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div className="doctor-info">
            <h2>Dr. Hope - Psychiatric Support</h2>
            <p>Professional mental health support in a safe, confidential space</p>
          </div>
        </div>
        <div className="session-timer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span>Session in progress</span>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-timestamp">{formatTime(message.timestamp)}</div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot-message typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        {apiError && (
          <div className="api-error-message">
            {apiError}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          aria-label="Message input"
        />
        <button type="submit" disabled={inputValue.trim() === ''}>
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatInterface