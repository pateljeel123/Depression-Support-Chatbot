import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaRobot, FaArrowLeft, FaTrash, FaChevronDown, FaPlus, FaTimes } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { MdSettings, MdLightMode, MdDarkMode } from 'react-icons/md';
import { supabase } from '../../services/supabaseClient';

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
    topicsOfInterest: [],
    communicationStyle: 'balanced'
  });
  const [currentSection, setCurrentSection] = useState('default');
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState('default');
  
  // Define available sections
  const sections = [
    { id: 'default', name: 'General Support' },
    { id: 'relationship', name: 'Relationship Advice' },
    { id: 'anxiety', name: 'Anxiety' },
    { id: 'loneliness', name: 'Loneliness' },
    { id: 'trauma', name: 'Past Mental Trauma' },
    { id: 'gossip', name: 'No One to Talk' }
  ];
  
  // Define options for settings
  const ageOptions = [
    { value: 'under18', label: 'Under 18' },
    { value: '18-24', label: '18-24' },
    { value: '25-34', label: '25-34' },
    { value: '35-44', label: '35-44' },
    { value: '45-54', label: '45-54' },
    { value: '55plus', label: '55+' }
  ];
  
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'other', label: 'Other' },
    { value: null, label: 'Prefer not to say' }
  ];
  
  const communicationStyles = [
    { value: 'direct', label: 'Direct & Straightforward' },
    { value: 'empathetic', label: 'Warm & Empathetic' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'analytical', label: 'Analytical & Detailed' },
    { value: 'encouraging', label: 'Encouraging & Positive' }
  ];
  
  const topicsOfInterest = [
    { value: 'relationship', label: 'Relationship Advice' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'loneliness', label: 'Loneliness' },
    { value: 'trauma', label: 'Past Mental Trauma' },
    { value: 'gossip', label: 'No One to Talk' },
    { value: 'self-care', label: 'Self-Care' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'stress', label: 'Stress Management' }
  ];
  
  const navigate = useNavigate();

  // Get current user on component mount and load chat history
  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    
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
          topicsOfInterest: preferred_topics || [],
          communicationStyle: communication_style || 'balanced'
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
      
      // Load conversations from localStorage
      const savedConversations = localStorage.getItem(`conversations_${user.id}`);
      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations);
        setConversations(parsedConversations);
        
        // Load current conversation ID
        const savedConversationId = localStorage.getItem(`current_conversation_${user.id}`);
        if (savedConversationId && parsedConversations.some(conv => conv.id === savedConversationId)) {
          setCurrentConversationId(savedConversationId);
          
          // Load messages for this conversation
          const conversationMessages = localStorage.getItem(`chat_history_${user.id}_${savedConversationId}`);
          if (conversationMessages) {
            setMessages(JSON.parse(conversationMessages));
          }
        } else {
          // Create a default conversation if none exists
          createNewConversation(user.id);
        }
      } else {
        // Initialize with a default conversation
        createNewConversation(user.id);
      }
      
      // Load saved section preference if available
      const savedSection = localStorage.getItem(`chat_section_${user.id}`);
      if (savedSection) {
        setCurrentSection(savedSection);
      }
    };
    
    getUser();
  }, [navigate]);
  
  // Function to create a new conversation
  const createNewConversation = (userId) => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation = {
      id: newConversationId,
      title: 'New conversation',
      created_at: new Date().toISOString(),
      section: currentSection
    };
    
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setCurrentConversationId(newConversationId);
    
    // Save to localStorage
    localStorage.setItem(`conversations_${userId}`, JSON.stringify(updatedConversations));
    localStorage.setItem(`current_conversation_${userId}`, newConversationId);
    
    // Create personalized welcome message based on user preferences
    let welcomeText = `Hello${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! I'm your support companion.`;
    
    // Add personalized greeting based on communication style
    if (user?.user_metadata?.communication_style === 'empathetic') {
      welcomeText += " I'm so glad you're here today. How are you feeling?"; 
    } else if (user?.user_metadata?.communication_style === 'direct') {
      welcomeText += " What would you like to talk about today?"; 
    } else if (user?.user_metadata?.communication_style === 'analytical') {
      welcomeText += " I'm here to help you explore your thoughts and feelings in a structured way."; 
    } else if (user?.user_metadata?.communication_style === 'encouraging') {
      welcomeText += " I believe in your strength and resilience. How can I support you today?"; 
    } else {
      welcomeText += " How are you feeling today?"; 
    }
    
    welcomeText += `\n\nYou can select different topics from the dropdown menu to get specialized support for:\n\n• Relationship Advice\n• Anxiety\n• Loneliness\n• Past Mental Trauma\n• No One to Talk (Gossip)\n\nI'm here to listen and support you.`;
    
    const initialMessages = [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toISOString()
      }
    ];
    
    setMessages(initialMessages);
    localStorage.setItem(`chat_history_${userId}_${newConversationId}`, JSON.stringify(initialMessages));
  };
  
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
    if (user && currentConversationId) {
      localStorage.setItem(`chat_history_${user.id}_${currentConversationId}`, JSON.stringify(messages));
      
      // Update conversation title based on first user message if title is default
      if (messages.length > 1 && conversations.length > 0) {
        const currentConversation = conversations.find(conv => conv.id === currentConversationId);
        if (currentConversation && currentConversation.title === 'New conversation') {
          // Find first user message
          const firstUserMessage = messages.find(msg => msg.sender === 'user');
          if (firstUserMessage) {
            // Limit title length
            const newTitle = firstUserMessage.text.length > 30 
              ? firstUserMessage.text.substring(0, 30) + '...' 
              : firstUserMessage.text;
            
            const updatedConversations = conversations.map(conv => 
              conv.id === currentConversationId ? {...conv, title: newTitle} : conv
            );
            
            setConversations(updatedConversations);
            localStorage.setItem(`conversations_${user.id}`, JSON.stringify(updatedConversations));
          }
        }
      }
    }
  }, [messages, user, currentConversationId, conversations]);
  
  // Save section preference to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`chat_section_${user.id}`, currentSection);
      
      // Update current conversation section
      if (currentConversationId && conversations.length > 0) {
        const updatedConversations = conversations.map(conv => 
          conv.id === currentConversationId ? {...conv, section: currentSection} : conv
        );
        
        setConversations(updatedConversations);
        localStorage.setItem(`conversations_${user.id}`, JSON.stringify(updatedConversations));
      }
    }
  }, [currentSection, user, currentConversationId, conversations]);
  
  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Create a new conversation if none exists
    if (!currentConversationId || !conversations.some(conv => conv.id === currentConversationId)) {
      createNewConversation(user.id);
      return;
    }
    
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
            name: user?.user_metadata?.full_name || '',
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
      console.error('Error calling API:', error);
      
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
      // Create a new conversation with welcome message
      createNewConversation(user.id);
    }
  };
  
  // Function to switch to a different conversation
  const switchConversation = (conversationId) => {
    if (conversationId === currentConversationId) return;
    
    // Save current conversation ID
    localStorage.setItem(`current_conversation_${user.id}`, conversationId);
    setCurrentConversationId(conversationId);
    
    // Load messages for this conversation
    const conversationMessages = localStorage.getItem(`chat_history_${user.id}_${conversationId}`);
    if (conversationMessages) {
      setMessages(JSON.parse(conversationMessages));
    } else {
      // If no messages found, initialize with welcome message
      const welcomeMessage = {
        id: 'welcome-1',
        sender: 'bot',
        text: `Hello! I'm your support companion. How are you feeling today?`,
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
      localStorage.setItem(`chat_history_${user.id}_${conversationId}`, JSON.stringify([welcomeMessage]));
    }
    
    // Update section based on conversation
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation && conversation.section) {
      setCurrentSection(conversation.section);
    }
  };
  
  // Function to delete a conversation
  const deleteConversation = (conversationId) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      // Remove from conversations list
      const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
      setConversations(updatedConversations);
      localStorage.setItem(`conversations_${user.id}`, JSON.stringify(updatedConversations));
      
      // Remove chat history for this conversation
      localStorage.removeItem(`chat_history_${user.id}_${conversationId}`);
      
      // If we're deleting the current conversation, switch to another one or create new
      if (conversationId === currentConversationId) {
        if (updatedConversations.length > 0) {
          switchConversation(updatedConversations[0].id);
        } else {
          createNewConversation(user.id);
        }
      }
    }
  };
  
  // Function to start a new chat
  const startNewChat = () => {
    createNewConversation(user.id);
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
          preferred_topics: newPreferences.topicsOfInterest,
          communication_style: newPreferences.communicationStyle
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
      
      // Scroll to the bottom to show the confirmation message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    }
  };

  // Function to save user preferences from the settings modal
  const saveUserPreferences = async () => {
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          age: userPreferences.age,
          gender: userPreferences.gender,
          preferred_topics: userPreferences.topicsOfInterest,
          communication_style: userPreferences.communicationStyle
        }
      });
      
      if (error) {
        console.error('Error updating user preferences:', error.message);
        return;
      }
      
      // Show confirmation message
      const confirmationMessage = {
        id: `system-${Date.now()}`,
        sender: 'bot',
        text: 'Your preferences have been updated successfully! I\'ll use these settings to provide more personalized support.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setShowSettingsModal(false);
      
      // Scroll to the bottom to show the confirmation message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Create a ref for the messages container to auto-scroll to bottom
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format message text with line breaks
  const formatMessageText = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar - Conversation History */}
      <div 
        className={`${showSidebar ? 'w-72' : 'w-0'} md:w-72 h-full flex-shrink-0 transition-all duration-300 overflow-hidden border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={startNewChat}
              className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border ${darkMode ? 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700' : 'bg-indigo-500 border-indigo-600 text-white hover:bg-indigo-600'} transition-colors duration-200 shadow-md`}
            >
              <FaPlus className="text-sm" />
              <span className="font-medium">New conversation</span>
            </button>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto py-3">
            {conversations.length === 0 ? (
              <div className={`text-center p-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No conversations yet
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <h3 className={`text-xs uppercase font-semibold px-2 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recent conversations</h3>
                {conversations.map(conversation => (
                  <button
                    key={conversation.id}
                    onClick={() => switchConversation(conversation.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all duration-200 ${conversation.id === currentConversationId ? 
                      (darkMode ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-white' : 'bg-indigo-50 border-l-4 border-indigo-500 text-gray-800') : 
                      (darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-700 hover:bg-gray-100')}`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FaRobot className={`flex-shrink-0 ${conversation.id === currentConversationId ? (darkMode ? 'text-indigo-400' : 'text-indigo-500') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                      <span className="truncate text-sm font-medium">{conversation.title}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'} transition-opacity duration-200`}
                      aria-label="Delete conversation"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar Footer */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowSettingsModal(true)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'} transition-colors duration-200`}
              >
                <MdSettings />
                <span>Settings</span>
              </button>
              
              <button
                onClick={toggleDarkMode}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'} transition-colors duration-200`}
              >
                {darkMode ? <MdLightMode /> : <MdDarkMode />}
                <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'} transition-colors duration-200`}
              >
                <FaArrowLeft />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-800'} shadow-sm`}>
          <div className="flex items-center">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden mr-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <FaArrowLeft className={`${showSidebar ? 'rotate-180' : ''} transition-transform duration-200`} />
            </button>
            
            {/* Topic selector */}
            <div className="relative section-dropdown">
              <button 
                onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                className={`flex items-center px-3 py-2 rounded-md text-sm ${darkMode ? 'hover:bg-gray-700 bg-gray-800 text-white' : 'hover:bg-gray-100 bg-white text-gray-800'} transition-colors duration-200`}
                aria-label="Select topic"
              >
                <span className="font-medium">
                  {sections.find(s => s.id === currentSection)?.name || 'General Support'}
                </span>
                <FaChevronDown className="ml-2" />
              </button>
              
              {showSectionDropdown && (
                <div className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg z-10 overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <ul className="py-1 max-h-[60vh] overflow-y-auto">
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
                          className={`block w-full text-left px-4 py-3 ${darkMode ? 
                            (currentSection === section.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700') : 
                            (currentSection === section.id ? 'bg-gray-100 text-gray-800' : 'text-gray-700 hover:bg-gray-50')}`}
                        >
                          {section.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={startNewChat}
              className={`p-2 rounded-md flex items-center ${darkMode ? 'hover:bg-gray-700 text-indigo-400 bg-gray-800/80' : 'hover:bg-indigo-50 text-indigo-600 bg-indigo-50/50'} transition-colors duration-200 mr-2`}
              title="Start new conversation"
              aria-label="New conversation"
            >
              <FaPlus className="mr-1 text-xs" />
              <span className="text-sm font-medium">New</span>
            </button>
            <button 
              onClick={clearChatHistory} 
              className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors duration-200`}
              title="Clear chat history"
              aria-label="Clear history"
            >
              <FaTrash />
            </button>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {message.sender === 'bot' && (
                <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center mr-3 mt-1 shadow-md`}>
                  <FaRobot className="text-white" />
                </div>
              )}
              
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-4 rounded-lg shadow-sm ${message.sender === 'user' ? (darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white') : (darkMode ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-800 border border-gray-100')}`}
              >
                <div className="whitespace-pre-line text-sm">{formatMessageText(message.text)}</div>
                <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-200' : (darkMode ? 'text-gray-400' : 'text-gray-500')} flex justify-end`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.sender === 'user' && (
                <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center ml-3 mt-1 shadow-md`}>
                  <FaUser className={`${darkMode ? 'text-white' : 'text-gray-600'} text-sm`} />
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start animate-fadeIn">
              <div className={`h-10 w-10 rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} flex items-center justify-center mr-3 shadow-md`}>
                <FaRobot className="text-white" />
              </div>
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-100 text-gray-600'} p-4 rounded-lg flex items-center space-x-3 shadow-sm`}>
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
          
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-lg`}>
          <div className={`flex items-center space-x-2 rounded-lg px-4 py-3 border ${darkMode ? 'bg-gray-700 border-gray-600 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500' : 'bg-white border-gray-300 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100'} shadow-sm`}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message Support Companion..."
              className={`flex-1 py-1 px-2 bg-transparent border-none focus:outline-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'}`}
              aria-label="Message input"
            />
            
            <button 
              type="submit" 
              disabled={!newMessage.trim() || loading}
              className={`p-2 rounded-full ${!newMessage.trim() || loading ? (darkMode ? 'text-gray-500' : 'text-gray-400') : (darkMode ? 'text-white bg-indigo-600 hover:bg-indigo-700' : 'text-white bg-indigo-500 hover:bg-indigo-600')} transition-all duration-200 focus:outline-none shadow-sm`}
              aria-label="Send message"
            >
              <IoMdSend className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-800'} flex items-center`}>
                  <MdSettings className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Personalize Your Experience
                </h2>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'} rounded-full h-8 w-8 flex items-center justify-center transition-colors duration-200`}
                  aria-label="Close settings"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Age Selection */}
                <div>
                  <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Age Group
                  </label>
                  <div className={`grid grid-cols-3 gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {ageOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setUserPreferences(prev => ({ ...prev, age: option.value }))}
                        className={`py-2 px-3 rounded-lg border ${userPreferences.age === option.value ? 
                          (darkMode ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-indigo-500 border-indigo-600 text-white') : 
                          (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50')}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Gender Selection */}
                <div>
                  <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Gender
                  </label>
                  <div className={`grid grid-cols-3 gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {genderOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setUserPreferences(prev => ({ ...prev, gender: option.value }))}
                        className={`py-2 px-3 rounded-lg border ${userPreferences.gender === option.value ? 
                          (darkMode ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-indigo-500 border-indigo-600 text-white') : 
                          (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50')}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Communication Style */}
                <div>
                  <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Communication Style
                  </label>
                  <div className={`grid grid-cols-2 gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {communicationStyles.map(style => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => setUserPreferences(prev => ({ ...prev, communicationStyle: style.value }))}
                        className={`py-2 px-3 rounded-lg border ${userPreferences.communicationStyle === style.value ? 
                          (darkMode ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-indigo-500 border-indigo-600 text-white') : 
                          (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50')}`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Topics of Interest */}
                <div>
                  <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Topics of Interest
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {topicsOfInterest.map(topic => (
                      <div key={topic.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`topic-${topic.value}`}
                          checked={userPreferences.topicsOfInterest.includes(topic.value)}
                          onChange={() => {
                            setUserPreferences(prev => {
                              const updatedTopics = prev.topicsOfInterest.includes(topic.value)
                                ? prev.topicsOfInterest.filter(t => t !== topic.value)
                                : [...prev.topicsOfInterest, topic.value];
                              return { ...prev, topicsOfInterest: updatedTopics };
                            });
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label 
                          htmlFor={`topic-${topic.value}`} 
                          className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          {topic.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors duration-200`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveUserPreferences}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'} transition-colors duration-200 shadow-sm`}
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