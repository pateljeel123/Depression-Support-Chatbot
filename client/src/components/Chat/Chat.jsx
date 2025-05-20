import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { FaArrowLeft, FaPaperPlane, FaSpinner, FaTrash, FaChevronDown, FaCog } from 'react-icons/fa';
import axios from 'axios';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Backend API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/chat';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    age: null,
    gender: null,
    preferred_topics: [],
    communication_style: 'balanced'
  });
  const [currentSection, setCurrentSection] = useState('default');
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Define available sections
  const sections = [
    { id: 'default', name: 'General Support' },
    { id: 'relationship', name: 'Relationship Advice' },
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'loneliness', name: 'Loneliness' },
    { id: 'trauma', name: 'Past Mental Trauma' },
    { id: 'gossip', name: 'No One to Talk' }
  ];
  const navigate = useNavigate();

  // Get current user on component mount and load chat history
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      
      // Load user preferences from user metadata
      if (user.user_metadata) {
        const { age, gender, preferred_topics, communication_style } = user.user_metadata;
        setUserPreferences({
          age: age || null,
          gender: gender || null,
          preferred_topics: preferred_topics || [],
          communication_style: communication_style || 'balanced'
        });
        
        // If user has preferred topics, set the current section to the first preferred topic
        if (preferred_topics && preferred_topics.length > 0) {
          // Check if there's a saved section first
          const savedSection = localStorage.getItem(`chat_section_${user.id}`);
          if (!savedSection) {
            setCurrentSection(preferred_topics[0]);
          }
        }
      }
      
      // Load chat history from localStorage
      const savedMessages = localStorage.getItem(`chat_history_${user.id}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Create personalized welcome message based on user preferences
        let welcomeText = `Hello${user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! I'm your support companion.`;
        
        // Add personalized greeting based on communication style
        if (user.user_metadata?.communication_style === 'empathetic') {
          welcomeText += " I'm so glad you're here today. How are you feeling?"; 
        } else if (user.user_metadata?.communication_style === 'direct') {
          welcomeText += " What would you like to talk about today?"; 
        } else if (user.user_metadata?.communication_style === 'analytical') {
          welcomeText += " I'm here to help you explore your thoughts and feelings in a structured way."; 
        } else if (user.user_metadata?.communication_style === 'encouraging') {
          welcomeText += " I believe in your strength and resilience. How can I support you today?"; 
        } else {
          welcomeText += " How are you feeling today?"; 
        }
        
        welcomeText += `\n\nYou can select different topics from the dropdown menu above to get specialized support for:\n\n• Relationship Advice\n• Anxiety\n• Loneliness\n• Past Mental Trauma\n• No One to Talk (Gossip)\n\nI'm here to listen and support you.`;
        
        setMessages([
          {
            id: 'welcome-1',
            sender: 'bot',
            text: welcomeText,
            timestamp: new Date().toISOString()
          }
        ]);
      }
      
      // Load saved section preference if available
      const savedSection = localStorage.getItem(`chat_section_${user.id}`);
      if (savedSection) {
        setCurrentSection(savedSection);
      }
    };
    
    getUser();
  }, [navigate]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSectionDropdown && !event.target.closest('.section-dropdown')) {
        setShowSectionDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSectionDropdown]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);
  
  // Save section preference to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chat_section_${user.id}`, currentSection);
    }
  }, [currentSection, user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);
    
    try {
      // Call our backend API
      const response = await axios.post(
        API_URL,
        {
          messages: [
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: newMessage
            }
          ],
          section: currentSection,
          user_preferences: {
            name: user.user_metadata?.full_name || '',
            age: userPreferences.age,
            gender: userPreferences.gender,
            preferred_topics: userPreferences.preferred_topics,
            communication_style: userPreferences.communication_style
          }
        }
      );
      
      // Extract the bot's response
      const botResponse = response.data.choices[0].message.content;
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Mistral API:', error);
      
      // Fallback message in case of API error
      const botMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'I apologize, but I\'m having trouble connecting right now. Could you please try again in a moment?',
          timestamp: new Date().toISOString()
        };
      
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      // Keep only the welcome message
      const welcomeMessage = {
        id: 'welcome-1',
        sender: 'bot',
        text: `Hello! I'm your support companion. How are you feeling today? You can select different topics from the dropdown menu above to get specialized support for:

• Relationship Advice
• Anxiety
• Loneliness
• Past Mental Trauma
• No One to Talk (Gossip)

I'm here to listen and support you.`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
      // This will trigger the useEffect to save to localStorage
    }
  };

  // Function to update user preferences
  const updateUserPreferences = async (newPreferences) => {
    try {
      // Update local state
      setUserPreferences(newPreferences);
      
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          age: newPreferences.age,
          gender: newPreferences.gender,
          preferred_topics: newPreferences.preferred_topics,
          communication_style: newPreferences.communication_style
        }
      });
      
      if (error) throw error;
      
      // Close the settings modal
      setShowSettingsModal(false);
      
      // Add a confirmation message to the chat
      const botMessage = {
        id: `bot-settings-${Date.now()}`,
        sender: 'bot',
        text: 'Your preferences have been updated! I\'ll use these to personalize our conversations.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')} 
            className="mr-4 hover:bg-indigo-700 p-2 rounded-full"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-semibold">Support Companion</h1>
        </div>
        
        {/* Section Selector */}
        <div className="relative section-dropdown">
          <button 
            onClick={() => setShowSectionDropdown(!showSectionDropdown)}
            className="flex items-center bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm"
          >
            <span className="mr-2">Topic:</span>
            {sections.find(s => s.id === currentSection)?.name || 'General Support'}
            <FaChevronDown className="ml-2" />
          </button>
          
          {showSectionDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
              <ul className="py-1 text-gray-700">
                {sections.map(section => (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        setCurrentSection(section.id);
                        setShowSectionDropdown(false);
                        
                        // Add a system message when changing sections
                        if (section.id !== currentSection) {
                          const botMessage = {
                            id: `bot-section-${Date.now()}`,
                            sender: 'bot',
                            text: `You've switched to the ${section.name} topic. How can I help you with this?`,
                            timestamp: new Date().toISOString()
                          };
                          setMessages(prev => [...prev, botMessage]);
                        }
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-indigo-100 ${currentSection === section.id ? 'bg-indigo-50 font-medium' : ''}`}
                    >
                      {section.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setShowSettingsModal(true)} 
            className="mr-3 bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-lg text-sm flex items-center"
            title="Personalization Settings"
          >
            <FaCog className="mr-1" /> Settings
          </button>
          <button 
            onClick={clearChatHistory} 
            className="mr-3 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm flex items-center"
            title="Clear chat history"
          >
            <FaTrash className="mr-1" /> Clear History
          </button>
          <button 
            onClick={handleSignOut} 
            className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-3 rounded-lg ${message.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'} shadow`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-2">
              <FaSpinner className="animate-spin text-indigo-500" />
              <span className="text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim() || loading}
            className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <FaPaperPlane className="h-5 w-5" />
          </button>
        </div>
      </form>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Personalization Settings</h2>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Customize your chat experience with these preferences.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Your age (optional)"
                    value={userPreferences.age || ''}
                    onChange={(e) => setUserPreferences({...userPreferences, age: e.target.value ? parseInt(e.target.value) : null})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={userPreferences.gender || ''}
                    onChange={(e) => setUserPreferences({...userPreferences, gender: e.target.value || null})}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Communication Style</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={userPreferences.communication_style || 'balanced'}
                    onChange={(e) => setUserPreferences({...userPreferences, communication_style: e.target.value})}
                  >
                    <option value="direct">Direct and Straightforward</option>
                    <option value="empathetic">Warm and Empathetic</option>
                    <option value="balanced">Balanced</option>
                    <option value="analytical">Analytical and Detailed</option>
                    <option value="encouraging">Encouraging and Positive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topics of Interest</label>
                  <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-md p-3">
                    {sections.map(section => (
                      <div key={section.id} className="flex items-center">
                        <input
                          id={`pref-topic-${section.id}`}
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={userPreferences.preferred_topics?.includes(section.id) || false}
                          onChange={() => {
                            const currentTopics = userPreferences.preferred_topics || [];
                            let newTopics;
                            
                            if (currentTopics.includes(section.id)) {
                              newTopics = currentTopics.filter(t => t !== section.id);
                            } else {
                              newTopics = [...currentTopics, section.id];
                            }
                            
                            setUserPreferences({...userPreferences, preferred_topics: newTopics});
                          }}
                        />
                        <label htmlFor={`pref-topic-${section.id}`} className="ml-2 block text-sm text-gray-700">
                          {section.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateUserPreferences(userPreferences)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;