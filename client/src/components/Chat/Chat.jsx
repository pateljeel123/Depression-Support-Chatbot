import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { FaArrowLeft, FaPaperPlane, FaSpinner } from 'react-icons/fa';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get current user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      
      // Load initial welcome message
      setMessages([
        {
          id: 'welcome-1',
          sender: 'bot',
          text: `Hello! I'm your support companion. How are you feeling today?`,
          timestamp: new Date().toISOString()
        }
      ]);
    };
    
    getUser();
  }, [navigate]);

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
    
    // Simulate bot response (in a real app, this would call your AI service)
    setTimeout(() => {
      const botResponses = [
        "I understand that must be difficult. Can you tell me more about how you're feeling?",
        "Thank you for sharing that with me. What do you think triggered these feelings?",
        "You're not alone in feeling this way. Many people experience similar emotions.",
        "It sounds like you're going through a challenging time. Have you tried any coping strategies?",
        "I'm here to support you. Would it help to talk about some positive coping mechanisms?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: randomResponse,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
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
        <button 
          onClick={handleSignOut} 
          className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded-lg text-sm"
        >
          Sign Out
        </button>
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
    </div>
  );
};

export default Chat;