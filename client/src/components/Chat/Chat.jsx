import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion'; // Added Reorder
import { 
  FiSend, FiPlus, FiTrash2, FiEdit2, FiMoon, FiSun, FiMenu, FiX, 
  FiCopy, FiSearch, FiStar, FiFileText, FiUpload, FiSettings, FiUser 
} from 'react-icons/fi'; // Added FiFileText, FiUpload, FiSettings, FiUser
import { BsEmojiSmile, BsImage, BsMarkdown } from 'react-icons/bs'; // Added BsImage, BsMarkdown
import { IoMdMic, IoMdMicOff } from 'react-icons/io';
import { RiRobot2Line } from 'react-icons/ri'; // Added RiRobot2Line
import { AiOutlineRobot, AiFillRobot } from 'react-icons/ai'; // Added AiOutlineRobot, AiFillRobot


import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'prism-react-renderer';
import { themes } from 'prism-react-renderer';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Tooltip } from './components/Tooltip';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { ChatItem } from './components/ChatItem';
import { PromptSuggestion } from './components/PromptSuggestion';
import { ChatInputActions } from './components/ChatInputActions'; // Added this import
import { MessageMenu } from './components/MessageMenu'; // Added this import

const lightCodeTheme = themes.vsLight;
const darkCodeTheme = themes.vsDark;

export default function Chat(){
  // State management
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check user's preferred color scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // Added activeTab state for sidebar/settings
  const [showMic, setShowMic] = useState(false); // Added showMic state
  const [modelSettings, setModelSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    model: 'gpt-4'
  });
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState([]); // For image previews
  const [pinnedChats, setPinnedChats] = useState([]);
  const [replyingToMessage, setReplyingToMessage] = useState(null); // For message replies
  const [editingMessage, setEditingMessage] = useState(null); // For editing messages
  const [editedContent, setEditedContent] = useState(''); // For editing message content
  const [reactingToMessageId, setReactingToMessageId] = useState(null); // For message reactions
  const [userPreferences, setUserPreferences] = useState({
    animations: true,
    markdown: true,
    soundEffects: true,
    syntaxHighlighting: true, // Added syntaxHighlighting
    username: '', // Added username
    email: '', // Added email
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches // Initialize darkMode preference
  });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/chat';
  
  // Refs
  const messagesEndRef = useRef(null);
  const reactionPickerRef = useRef(null); // Ref for reaction picker
  const inputRef = useRef(null);
  const chatInputRef = useRef(null); // Ref for the chat input area for drag and drop
  const fileInputRef = useRef(null);
  
  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  // Initialize with a default chat
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    const savedSettings = localStorage.getItem('settings');
    
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      setChats(parsedChats);
      let currentActiveChatId = parsedChats[0]?.id || null;
      
      if (!currentActiveChatId && parsedChats.length > 0) {
        // Fallback if first chat has no ID somehow, though unlikely with createNewChat
        currentActiveChatId = parsedChats[0].id = Date.now().toString(); // Assign an ID if missing
      }
      setActiveChat(currentActiveChatId);

      if (currentActiveChatId) {
        const activeChatData = parsedChats.find(c => c.id === currentActiveChatId);
        if (activeChatData && activeChatData.messages && activeChatData.messages.length > 0) {
          setMessages(activeChatData.messages);
        } else {
          // Chat exists or is the first chat, but has no messages or empty messages array
          const welcomeMessage = createMessage('assistant', 'Hello! How can I assist you today?', currentActiveChatId);
          setMessages([welcomeMessage]);
          // Persist this welcome message to the chat object
          setChats(prevChats => prevChats.map(c =>
            c.id === currentActiveChatId
              ? { ...c, messages: [welcomeMessage] }
              : c
          ));
        }
      } else if (parsedChats.length === 0) {
        // No chats in localStorage, create a new one
        const newChatInstance = createNewChat();
        setActiveChat(newChatInstance.id);
        const initialMessage = createMessage('assistant', 'Hello! How can I assist you today?', newChatInstance.id);
        newChatInstance.messages = [initialMessage];
        setChats([newChatInstance]);
        setMessages([initialMessage]);
      }
      // If parsedChats exist but currentActiveChatId is null (e.g. empty array from storage), do nothing for messages

    } else {
      // No savedChats in localStorage, create a new one
      const newChatInstance = createNewChat();
      setActiveChat(newChatInstance.id);
      const initialMessage = createMessage('assistant', 'Hello! How can I assist you today?', newChatInstance.id);
      newChatInstance.messages = [initialMessage];
      setChats([newChatInstance]);
      setMessages([initialMessage]);
    }
    
    if (savedSettings) {
      setUserPreferences(JSON.parse(savedSettings));
    }
    
    // Set dark mode based on localStorage or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Handle speech recognition transcript
  useEffect(() => {
    // Only update input if listening and transcript is non-empty
    // This assumes transcript is the full recognized text for the current session
    if (listening && transcript) {
      setInput(transcript);
    }
    // If not listening, the transcript might be from the last session.
    // resetTranscript() is called when starting to listen and after sending a message.
  }, [transcript, listening]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper functions
  const createNewChat = () => {
    return {
      id: Date.now().toString(),
      title: 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const createMessage = (role, content, replyToId = null) => {
    return {
      id: Date.now().toString(),
      chatId: activeChat, // Associate message with the active chat
      role,
      content,
      timestamp: new Date().toISOString(),
      replyTo: replyToId || null, // Add replyTo field
      reactions: {}, // Initialize reactions object
      attachments: [], // Initialize attachments array for the message
      starred: false // Initialize starred state
    };
  };

  // Handle starting a reply
  const handleStartReply = (message) => {
    setReplyingToMessage(message);
    inputRef.current?.focus();
  };

  // Handle canceling a reply
  const handleCancelReply = () => {
    setReplyingToMessage(null);
  };

  // Create a new chat
  const handleNewChat = () => {
    const newChat = createNewChat();
    
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
    const initialMessage = createMessage('assistant', 'Hello! How can I assist you today?');
    initialMessage.chatId = newChat.id; // Assign chatId to the initial message
    setMessages([initialMessage]);
    // Also update the chat object itself to store its messages
    setChats(prevChats => prevChats.map(c => c.id === newChat.id ? { ...c, messages: [initialMessage] } : c));
    setInput('');
    setSidebarOpen(false);
    setAttachments([]);
    setAttachmentPreviews([]); // Clear previews
    playSound('newChat');
  };

  // Select a chat from history
  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
    // In a real app, you would load messages for this chat from your database
    // For now, we'll clear messages or load them if stored locally per chat
    // This part needs further implementation based on how messages are stored for different chats.
    // As a placeholder, let's clear messages when switching chats if they are not chat-specific yet.
    const currentChat = chats.find(chat => chat.id === chatId);
    if (currentChat && currentChat.messages && currentChat.messages.length > 0) {
      setMessages(currentChat.messages);
    } else {
      // If no messages are stored for this chat, or messages array is empty,
      // set a default initial message and persist it to the chat object.
      const welcomeMessage = createMessage('assistant', `Switched to chat: ${currentChat?.title || 'New Chat'}. How can I help?`, null);
      setMessages([welcomeMessage]);
      if (currentChat) { // Ensure currentChat exists before trying to update it
        setChats(prevChats => prevChats.map(c => 
          c.id === chatId ? { ...c, messages: [welcomeMessage] } : c
        ));
      }
    }
    setSidebarOpen(false);
    setAttachments([]);
    setAttachmentPreviews([]); // Clear previews
    playSound('selectChat');
  };

  // Delete a chat
  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (activeChat === chatId) {
      if (updatedChats.length > 0) {
        setActiveChat(updatedChats[0].id);
      } else {
        handleNewChat();
      }
    }
    playSound('delete');
  };

  // Toggle pin chat
  const handleTogglePin = (chatId, e) => {
    e.stopPropagation();
    setPinnedChats(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId) 
        : [...prev, chatId]
    );
    playSound(pinnedChats.includes(chatId) ? 'unpin' : 'pin'); // Corrected: used pinnedChats instead of undefined 'prev'
  };

  // Start editing a chat title
  const handleStartEdit = (chat, e) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  // Save edited chat title
  const handleSaveEdit = (e) => {
    e.stopPropagation();
    setChats(chats.map(chat => 
      chat.id === editingChatId ? { ...chat, title: editTitle } : chat
    ));
    setEditingChatId(null);
    playSound('save');
  };

  // Copy message to clipboard
  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    playSound('copy');
  };

  // Handle message reply
  const handleReply = (message) => {
    setReplyingToMessage(message);
    inputRef.current?.focus();
    // Potentially scroll to input or highlight it
  };

  // Handle message reaction - opens reaction picker
  const handleReact = (messageId) => {
    setReactingToMessageId(messageId);
    // Logic to show reaction picker, perhaps near the message
  };

  // Add a reaction to a message
  const addReactionToMessage = (messageId, reactionEmoji) => {
    setMessages(prevMessages => prevMessages.map(msg => 
      msg.id === messageId 
        ? { ...msg, reactions: { ...(msg.reactions || {}), [reactionEmoji]: (msg.reactions?.[reactionEmoji] || 0) + 1 } } 
        : msg
    ));
    setChats(prevChats => prevChats.map(chat => 
      chat.id === activeChat 
        ? { ...chat, messages: chat.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, reactions: { ...(msg.reactions || {}), [reactionEmoji]: (msg.reactions?.[reactionEmoji] || 0) + 1 } } 
              : msg
          )}
        : chat
    ));
    setReactingToMessageId(null); // Close picker after reaction
    playSound('send'); // Or a specific reaction sound
  };

  // Start editing a message
  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setEditedContent(message.content);
    // Potentially focus an edit input if it's separate
  };

  // Save an edited message
  const handleSaveEditMessage = (messageId) => {
    if (!editedContent.trim()) return; // Prevent saving empty content

    setMessages(prevMessages => prevMessages.map(msg =>
      msg.id === messageId ? { ...msg, content: editedContent, updatedAt: new Date().toISOString() } : msg
    ));
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: (chat.messages || []).map(msg => 
            msg.id === messageId ? { ...msg, content: editedContent, updatedAt: new Date().toISOString() } : msg
          ), updatedAt: new Date().toISOString() }
        : chat
    ));
    setEditingMessage(null);
    setEditedContent('');
    playSound('save');
  };

  // Star or unstar a message
  const handleStarMessage = (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const currentMessage = messages[messageIndex];
    const newStarredState = !currentMessage.starred;

    setMessages(prevMessages => prevMessages.map(msg =>
      msg.id === messageId ? { ...msg, starred: newStarredState } : msg
    ));

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: (chat.messages || []).map(msg =>
            msg.id === messageId ? { ...msg, starred: newStarredState } : msg
          )
        };
      }
      return chat;
    }));
    playSound(newStarredState ? 'pin' : 'unpin'); // Use 'pin' and 'unpin' sounds
  };

  // Share a message (placeholder)
  const handleShareMessage = (message) => {
    console.log('Sharing message:', message);
    // Implement sharing logic, e.g., copy link, open share dialog
    navigator.clipboard.writeText(`Shared message: ${message.content}`);
    playSound('copy'); // Or a specific share sound
  };

  // Placeholder for deleting a message
  const handleDeleteMessage = (messageId) => {
    console.log('Attempting to delete message:', messageId);
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: (chat.messages || []).filter(msg => msg.id !== messageId) }
        : chat
    ));
    playSound('delete'); 
  };

  // Play sound effects
  const playSound = (type) => {
    if (!userPreferences.soundEffects) return;
    
    const sounds = {
      newChat: 'https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3',
      selectChat: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
      send: 'https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3',
      delete: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
      pin: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
      unpin: 'https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3',
      copy: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
      save: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3'
    };
    
    const audio = new Audio(sounds[type]);
    audio.play();
  };

  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const messageAttachmentsPayload = attachments.map(file => {
      const preview = attachmentPreviews.find(p => p.name === file.name && p.type.startsWith('image/'));
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl: preview ? preview.url : null
      };
    });

    const userMessage = createMessage('user', input.trim(), replyingToMessage ? replyingToMessage.id : null);
    userMessage.attachments = messageAttachmentsPayload; // Add processed attachments to the message object

    // Optimistically update UI
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...(chat.messages || []), userMessage], updatedAt: new Date().toISOString() }
          : chat
      )
    );

    setInput('');
    setAttachments([]);
    setAttachmentPreviews([]);
    setReplyingToMessage(null); // Clear replying state after sending
    setIsLoading(true);
    playSound('send');

    try {
      // Prepare payload for the API
      // Construct the history including the new userMessage as the last item.
      // The `messages` state here is the state *before* the optimistic update with `userMessage` is fully processed.
      const historyForPayload = [...messages, userMessage].slice(-20).map(msg => ({
        role: msg.role,
        content: msg.content
        // Attachments are handled separately or not expected by the backend in this part of the payload
      }));

      const payload = {
        messages: historyForPayload,
        // section: 'default', // Optional: Backend uses 'default' if not provided. UI could set this.
        user_preferences: userPreferences,
      };

      const response = await fetch(API_URL, { // API_URL needs to be defined above
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If response is not JSON, create a generic error object
          errorData = { error: { message: `API request failed with status ${response.status}. Response was not valid JSON.` } };
        }
        throw new Error(errorData.error?.message || errorData.message || errorData.error || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract assistant's reply from Mistral's response structure
      const assistantReply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content
        : 'Sorry, I received an unexpected response format.';
      
      const assistantMessage = createMessage('assistant', assistantReply);
      
      // Update messages state with assistant's reply
      setMessages(prev => [...prev, assistantMessage]);
      // Update chats state to persist the new assistant message
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat
            ? { ...chat, messages: [...(chat.messages || []), assistantMessage], updatedAt: new Date().toISOString() }
            : chat
        )
      );

    } catch (error) {
      console.error('Error sending message to API:', error);
      const errorMessageContent = error.message.includes('Failed to fetch') 
        ? 'Sorry, I could not connect to the server. Please check your connection or if the server is running.'
        : `Sorry, I encountered an error: ${error.message}. Please try again.`;
      
      const errorMessage = createMessage('assistant', errorMessageContent);
      setMessages(prev => [...prev, errorMessage]);
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat
            ? { ...chat, messages: [...(chat.messages || []), errorMessage], updatedAt: new Date().toISOString() }
            : chat
        )
      );
    } finally {
      setIsLoading(false);
      resetTranscript(); // Ensure transcript is reset even on error
    }
  };

  // Toggle microphone for voice input
  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript(); // Reset transcript before starting new recognition
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
    setShowMic(!listening); // Toggle showMic based on the new listening state
    playSound('selectChat');
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setInput(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for separators
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Group messages by date
  const groupMessagesByDate = useCallback(() => {
    const grouped = {};
    messages.forEach((message) => {
      const date = new Date(message.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  }, [messages]);

  const groupedMessages = groupMessagesByDate();

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file upload
  const handleFileUpload = (eventOrFiles) => {
    let filesToProcess = [];
    if (eventOrFiles.target && eventOrFiles.target.files) {
      filesToProcess = Array.from(eventOrFiles.target.files);
    } else if (Array.isArray(eventOrFiles)) {
      filesToProcess = eventOrFiles; // From drag & drop
    }

    if (filesToProcess.length === 0) return;

    const uniqueNewFiles = filesToProcess.filter(
      file => !attachments.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)
    );

    if (uniqueNewFiles.length === 0) {
      if (eventOrFiles.target && eventOrFiles.target.value) { // Still clear input if files were "selected" but all were duplicates
        eventOrFiles.target.value = null;
      }
      // Optionally, notify user about duplicate files if needed, for now, just log for those attempted but were duplicates.
      // filesToProcess.forEach(file => {
      //   if (!uniqueNewFiles.includes(file)) {
      //     console.log(`File ${file.name} already attached or selected.`);
      //   }
      // });
      return;
    }

    setAttachments(prevAttachments => [...prevAttachments, ...uniqueNewFiles]);

    uniqueNewFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreviews(prevPreviews => {
            if (!prevPreviews.some(p => p.name === file.name)) {
              return [...prevPreviews, { name: file.name, url: reader.result, type: file.type }];
            }
            return prevPreviews;
          });
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreviews(prevPreviews => {
          if (!prevPreviews.some(p => p.name === file.name)) {
            return [...prevPreviews, { name: file.name, url: null, type: file.type }];
          }
          return prevPreviews;
        });
      }
    });
    
    if (eventOrFiles.target && eventOrFiles.target.value) {
      eventOrFiles.target.value = null; 
    }
  };

  const handleRemoveAttachment = (fileName) => {
    setAttachments(prev => prev.filter(file => file.name !== fileName));
    setAttachmentPreviews(prev => prev.filter(preview => preview.name !== fileName));
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (chatInputRef.current) {
      chatInputRef.current.classList.add(darkMode ? 'bg-gray-700' : 'bg-gray-200', 'border-indigo-500', 'border-2', 'border-dashed');
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (chatInputRef.current) {
      chatInputRef.current.classList.remove(darkMode ? 'bg-gray-700' : 'bg-gray-200', 'border-indigo-500', 'border-2', 'border-dashed');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (chatInputRef.current) {
      chatInputRef.current.classList.remove(darkMode ? 'bg-gray-700' : 'bg-gray-200', 'border-indigo-500', 'border-2', 'border-dashed');
    }
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  // Attach drag and drop listeners to the chat input area
  useEffect(() => {
    const chatInputElement = chatInputRef.current;
    if (chatInputElement) {
      chatInputElement.addEventListener('dragover', handleDragOver);
      chatInputElement.addEventListener('dragleave', handleDragLeave);
      chatInputElement.addEventListener('drop', handleDrop);

      return () => {
        if (chatInputElement) { // Check again in cleanup as it might have been removed
          chatInputElement.removeEventListener('dragover', handleDragOver);
          chatInputElement.removeEventListener('dragleave', handleDragLeave);
          chatInputElement.removeEventListener('drop', handleDrop);
        }
      };
    }
  }, [darkMode, chatInputRef.current]); // Re-attach if darkmode or ref changes

  // Toggle dark mode with animation
  const toggleDarkMode = () => {
    if (userPreferences.animations) {
      document.documentElement.classList.add('transition-colors');
      document.documentElement.classList.add('duration-300');
    }
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setUserPreferences(prev => ({ ...prev, darkMode: newDarkMode })); // Sync with userPreferences
  };

  return (
    <div>
      {/* Settings Panel Modal */}
      {activeTab === 'settings' && (
        <SettingsPanel
          darkMode={darkMode}
          userPreferences={userPreferences}
          setUserPreferences={setUserPreferences}
          modelSettings={modelSettings}
          setModelSettings={setModelSettings}
          onClose={() => setActiveTab('chats')}
          toggleMainDarkMode={toggleDarkMode}
        />
      )}
      <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        {/* Mobile sidebar toggle */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} shadow-lg transition-transform hover:scale-110`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`w-64 md:w-72 flex-shrink-0 h-full overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} fixed md:relative z-40`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold flex items-center">
                  <RiRobot2Line className="mr-2 text-indigo-500" />
                  AI Assistant
                </h1>
                <ThemeSwitcher darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </div>
              
              <button
                onClick={handleNewChat}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg mb-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:shadow-md`}
              >
                <FiPlus />
                <span>New Chat</span>
              </button>
              
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
              
              <div className="flex border-b mb-2">
                <button
                  className={`flex-1 py-2 font-medium ${activeTab === 'chats' ? (darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                  onClick={() => setActiveTab('chats')}
                >
                  Chats
                </button>
                <button
                  className={`flex-1 py-2 font-medium ${activeTab === 'saved' ? (darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                  onClick={() => setActiveTab('saved')}
                >
                  Saved
                </button>
              </div>
              
              <div className="mt-4">
                {activeTab === 'chats' ? (
                  <>
                    {pinnedChats.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-sm font-semibold px-2 mb-2 opacity-70 flex items-center">
                          <FiStar className="mr-1 text-yellow-500" /> Pinned Chats
                        </h2>
                        <div className="space-y-1">
                          {chats.filter(chat => pinnedChats.includes(chat.id)).map((chat) => (
                            <ChatItem 
                              key={chat.id}
                              chat={chat}
                              activeChat={activeChat}
                              darkMode={darkMode}
                              editingChatId={editingChatId}
                              editTitle={editTitle}
                              setEditTitle={setEditTitle}
                              handleSelectChat={handleSelectChat}
                              handleStartEdit={handleStartEdit}
                              handleSaveEdit={handleSaveEdit}
                              handleDeleteChat={handleDeleteChat}
                              handleTogglePin={handleTogglePin}
                              pinnedChats={pinnedChats}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <h2 className="text-sm font-semibold px-2 mb-2 opacity-70">Recent Chats</h2>
                    <Reorder.Group 
                      axis="y" 
                      values={filteredChats.filter(chat => !pinnedChats.includes(chat.id))} 
                      onReorder={(newOrder) => setChats([...pinnedChats.map(id => chats.find(c => c.id === id)), ...newOrder])}
                      className="space-y-1"
                    >
                      {filteredChats.filter(chat => !pinnedChats.includes(chat.id)).map((chat) => (
                        <Reorder.Item key={chat.id} value={chat}>
                          <ChatItem 
                            chat={chat}
                            activeChat={activeChat}
                            darkMode={darkMode}
                            editingChatId={editingChatId}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            handleSelectChat={handleSelectChat}
                            handleStartEdit={handleStartEdit}
                            handleSaveEdit={handleSaveEdit}
                            handleDeleteChat={handleDeleteChat}
                            handleTogglePin={handleTogglePin}
                            pinnedChats={pinnedChats}
                          />
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiStar size={24} className="mx-auto mb-2" />
                    <p>Your saved messages will appear here</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-700 hover:bg-opacity-30">
                <FiUser />
                <span>Account</span>
              </button>
              <button 
                className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-gray-700 hover:bg-opacity-30"
                onClick={() => setActiveTab('settings')}
              >
                <FiSettings />
                <span>Settings</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className={`p-4 flex items-center justify-between border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 mr-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <FiMenu size={20} />
              </button>
            )}
            <h1 className="text-xl font-semibold flex items-center">
              {activeChat && chats.find(chat => chat.id === activeChat)?.title || 'New Chat'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Tooltip content="Current model: GPT-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <AiOutlineRobot className="mr-1" />
                <span>GPT-4</span>
              </div>
            </Tooltip>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <AiFillRobot size={64} className="mb-4 text-indigo-500 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
              <p className="max-w-md mb-6 opacity-70">
                Ask me anything, from creative ideas to technical explanations. I'm here to assist!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                <PromptSuggestion 
                  text="Explain quantum computing in simple terms" 
                  onClick={() => setInput("Explain quantum computing in simple terms")}
                  darkMode={darkMode}
                />
                <PromptSuggestion 
                  text="Suggest some creative birthday ideas" 
                  onClick={() => setInput("Suggest some creative birthday ideas")}
                  darkMode={darkMode}
                />
                <PromptSuggestion 
                  text="Help me debug this Python code" 
                  onClick={() => setInput("Help me debug this Python code")}
                  darkMode={darkMode}
                />
                <PromptSuggestion 
                  text="Write a professional email to a client" 
                  onClick={() => setInput("Write a professional email to a client")}
                  darkMode={darkMode}
                />
              </div>
            </div>
          ) : (
            <>
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="mb-6">
                  <div className={`text-center mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(dateMessages[0].timestamp)}
                  </div>
                  {dateMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`max-w-3xl rounded-lg p-4 relative group ${message.role === 'user' 
                          ? (darkMode ? 'bg-indigo-600' : 'bg-indigo-500 text-white') 
                          : (darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200')}`}
                      >
                        <div className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 transition-opacity items-center z-10"> {/* Added z-10 */}
                          {/* MessageMenu is now primary, copy is within it if needed or handled by it */}
                          <MessageMenu
                            message={message}
                            darkMode={darkMode}
                            onCopy={() => handleCopyMessage(message.content)}
                            onEdit={() => handleEditMessage(message)} // Connect to handleEditMessage
                            onDelete={() => handleDeleteMessage(message.id)}
                            onStar={() => handleStarMessage(message.id)} // Connect to handleStarMessage
                            onShare={() => handleShareMessage(message)} // Connect to handleShareMessage
                            onReply={() => handleStartReply(message)}
                            onReact={() => handleReact(message.id)}
                          />
                        </div>
                        
                        {message.replyTo && messages.find(m => m.id === message.replyTo) && (
                          <div className={`mb-1.5 px-2 py-1 text-xs rounded-md ${darkMode ? 'bg-black bg-opacity-20' : 'bg-gray-100'} border-l-2 ${darkMode ? 'border-gray-500' : 'border-gray-300'}`}>
                            <p className={`font-medium text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Replying to {messages.find(m => m.id === message.replyTo)?.role === 'user' ? 'User' : 'AI'}:</p>
                            <em className="opacity-80 line-clamp-2 text-xs">"{messages.find(m => m.id === message.replyTo)?.content}"</em>
                          </div>
                        )}
                        {/* Conditional rendering for editing or displaying message content */}
                        {editingMessage && editingMessage.id === message.id ? (
                          <div className="mt-2 w-full">
                            <textarea 
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSaveEditMessage(message.id);
                                }
                              }}
                              className={`w-full p-2 border rounded text-sm ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-indigo-500 focus:border-indigo-500`}
                              rows="3"
                              autoFocus
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                              <button 
                                onClick={() => { setEditingMessage(null); setEditedContent(''); }} 
                                className={`px-3 py-1 rounded text-xs ${darkMode ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => handleSaveEditMessage(message.id)} 
                                className={`px-3 py-1 rounded text-xs ${darkMode ? 'bg-indigo-500 hover:bg-indigo-400 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none break-words"> {/* Added break-words */}
                            <Markdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({node, inline, className, children, ...props}) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <div className="relative">
                                      <div className={`absolute top-2 right-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {match[1]}
                                      </div>
                                      <SyntaxHighlighter
                                        language={match[1]}
                                        style={darkMode ? darkCodeTheme : lightCodeTheme}
                                        PreTag="div"
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                      <button
                                        onClick={() => handleCopyMessage(String(children).replace(/\n$/, ''))}
                                        className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                                      >
                                        Copy
                                      </button>
                                    </div>
                                  ) : (
                                    <code className={`${className} ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} px-1 py-0.5 rounded`} {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                              }}
                            >
                              {message.content}
                            </Markdown>
                          </div>
                        )}

                          {/* Display Attachments in Message */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-opacity-20">
                              {message.attachments.map((attachment, index) => (
                                <div key={index} className={`p-1.5 rounded text-xs mb-1 ${message.role === 'user' ? (darkMode ? 'bg-indigo-700' : 'bg-indigo-600') : (darkMode ? 'bg-gray-600' : 'bg-gray-100 border') }`}>
                                  {attachment.previewUrl && attachment.type.startsWith('image/') ? (
                                    <img src={attachment.previewUrl} alt={attachment.name} className="max-w-xs max-h-32 rounded my-1" />
                                  ) : null}
                                  <div className="flex items-center">
                                    {attachment.type.startsWith('image/') ? <BsImage className="mr-1.5 flex-shrink-0" /> : <FiFileText className="mr-1.5 flex-shrink-0" />}
                                    <span className="truncate" title={attachment.name}>{attachment.name}</span>
                                    {attachment.size && <span className="ml-2 text-opacity-70 text-xxs">({(attachment.size / 1024).toFixed(1)} KB)</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      {/* Reactions Display */} 
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex space-x-1 mt-1.5 pl-0">
                          {Object.entries(message.reactions).map(([emoji, count]) => (
                            <button
                              key={emoji}
                              onClick={() => addReactionToMessage(message.id, emoji)}
                              className={`px-1.5 py-0.5 text-xs rounded-full transition-colors ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                            >
                              {emoji} {count > 1 ? count : ''}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className={`text-xs mt-2 flex justify-between ${message.role === 'user' ? 'text-indigo-200' : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>
                          <span>{formatTimestamp(message.timestamp)}</span>
                          {message.role === 'assistant' && (
                            <span className="flex items-center">
                              <AiOutlineRobot className="mr-1" />
                              AI Assistant
                            </span>
                          )}
                        </div>
                    </motion.div>
                    ))}
                  </div>
                ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-4"
                >
                  <div className={`max-w-3xl rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
                    <TypingIndicator darkMode={darkMode} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
              {/* Reaction Picker */}
              {reactingToMessageId && (
                <div
                  ref={reactionPickerRef} 
                  className={`absolute z-30 p-2 rounded-lg shadow-xl flex space-x-1 ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'}`}
                  style={{ bottom: '80px', right: '20px' }} // Example fixed position, ideally dynamic
                >
                  {['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => {
                        addReactionToMessage(reactingToMessageId, emoji);
                        setReactingToMessageId(null); 
                      }}
                      className={`p-1.5 rounded-full text-xl transition-transform hover:scale-125 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                  <button onClick={() => setReactingToMessageId(null)} className={`p-1 ml-1 rounded-full ${darkMode ? 'hover:bg-gray-500' : 'hover:bg-gray-300'}`}>
                    <FiX size={16}/>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input area */}
        <div className={`p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          {attachments.length > 0 && (
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Attachments ({attachments.length})</h3>
                <button 
                  onClick={() => { setAttachments([]); setAttachmentPreviews([]); }}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                >
                  <FiX size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded flex items-center text-sm ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                  >
                    {attachmentPreviews.find(p => p.originalFile === file && p.type.startsWith('image/')) ? (
                      <img src={attachmentPreviews.find(p => p.originalFile === file).url} alt={file.name} className="w-8 h-8 mr-2 rounded object-cover" />
                    ) : file.type.startsWith('image/') ? (
                      <BsImage className="mr-2 flex-shrink-0" />
                    ) : (
                      <FiFileText className="mr-2 flex-shrink-0" />
                    )}
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button 
                      onClick={() => {
                        const fileToRemove = attachments[index];
                        setAttachments(prev => prev.filter((f) => f !== fileToRemove));
                        setAttachmentPreviews(prev => prev.filter(p => p.originalFile !== fileToRemove));
                      }}
                      className="ml-2 p-1 rounded-full hover:bg-gray-500 hover:bg-opacity-30"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {showMic && browserSupportsSpeechRecognition && (
            <div className={`mb-4 p-3 rounded-lg flex items-center ${listening ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'} ${darkMode ? 'bg-gray-700' : ''}`}>
              <div className="flex-1">
                {listening ? 'Listening... Speak now' : 'Click the mic and start speaking'}
              </div>
              <button
                onClick={toggleMic}
                className={`p-2 rounded-full ${listening ? 'bg-red-500 text-white' : 'bg-gray-200'} ${darkMode ? 'bg-gray-600' : ''}`}
              >
                {listening ? <IoMdMic size={20} /> : <IoMdMicOff size={20} />}
              </button>
            </div>
          )}
          
          {replyingToMessage && (
            <div className={`mb-2 p-2 rounded-lg text-sm flex justify-between items-center shadow ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <div className="flex-grow overflow-hidden">
                <span className="text-xs opacity-80">Replying to:</span> <strong className="truncate max-w-full inline-block align-bottom text-xs">"{replyingToMessage.content.substring(0,70)}..."</strong>
              </div>
              <button onClick={() => setReplyingToMessage(null)} className={`ml-2 p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'}`}>
                <FiX size={16} />
              </button>
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                rows="1"
                className={`w-full rounded-lg py-3 px-4 pr-12 resize-none ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="absolute right-2 bottom-2 flex space-x-1">
                <FileUpload 
                  onFileUpload={handleFileUpload} 
                  darkMode={darkMode} 
                  fileInputRef={fileInputRef}
                />
                
                <button
                  type="button"
                  onClick={toggleEmojiPicker}
                  className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <BsEmojiSmile size={20} />
                </button>
                
                {browserSupportsSpeechRecognition && (
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`p-1 rounded-full ${showMic ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
                  >
                    <IoMdMic size={20} />
                  </button>
                )}
                
                <button
                  type="button"
                  className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  title="Supports Markdown"
                >
                  <BsMarkdown size={20} />
                </button>
              </div>
              
              {showEmojiPicker && (
                <div className="absolute right-0 bottom-12 z-10">
                  <EmojiPicker onSelect={handleEmojiSelect} darkMode={darkMode} />
                </div>
              )}
            </div>
            <motion.button
              type="submit"
              disabled={!input.trim() && attachments.length === 0 || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg ${(!input.trim() && attachments.length === 0 || isLoading) 
                ? (darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-400') 
                : (darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-500 text-white hover:bg-indigo-600')}`}
            >
              <FiSend size={20} />
            </motion.button>
          </form>
          
          <div className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            AI Assistant may produce inaccurate information. Consider verifying important details.
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

// Settings Panel Component
const SettingsPanel = ({ 
  darkMode, 
  userPreferences, 
  setUserPreferences,
  modelSettings,
  setModelSettings,
  onClose, 
  toggleMainDarkMode // Added prop
}) => {
  const [activeTab, setActiveTab] = useState('preferences');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900 bg-opacity-80' : 'bg-gray-500 bg-opacity-50'}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className={`relative rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-xl font-semibold flex items-center">
            <FiSettings className="mr-2" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'preferences' ? (darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'model' ? (darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
            onClick={() => setActiveTab('model')}
          >
            Model Settings
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'account' ? (darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preferences' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Toggle between light and dark theme
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={darkMode} // Controlled by main app's darkMode state
                        onChange={toggleMainDarkMode} // Use the passed main toggle function
                      />
                      <div className={`w-11 h-6 rounded-full peer ${darkMode ? 'bg-indigo-600' : 'bg-gray-200'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Animations</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enable/disable UI animations
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={userPreferences.animations}
                        onChange={() => setUserPreferences({...userPreferences, animations: !userPreferences.animations})}
                      />
                      <div className={`w-11 h-6 rounded-full peer ${userPreferences.animations ? 'bg-indigo-600' : 'bg-gray-200'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sound Effects</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enable/disable interface sounds
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={userPreferences.soundEffects}
                        onChange={() => setUserPreferences({...userPreferences, soundEffects: !userPreferences.soundEffects})}
                      />
                      <div className={`w-11 h-6 rounded-full peer ${userPreferences.soundEffects ? 'bg-indigo-600' : 'bg-gray-200'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Message Display</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Markdown Support</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Render markdown in messages
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={userPreferences.markdown}
                        onChange={() => setUserPreferences({...userPreferences, markdown: !userPreferences.markdown})}
                      />
                      <div className={`w-11 h-6 rounded-full peer ${userPreferences.markdown ? 'bg-indigo-600' : 'bg-gray-200'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Code Syntax Highlighting</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Enable syntax highlighting for code blocks
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={userPreferences.syntaxHighlighting}
                        onChange={() => setUserPreferences({...userPreferences, syntaxHighlighting: !userPreferences.syntaxHighlighting})}
                      />
                      <div className={`w-11 h-6 rounded-full peer ${userPreferences.syntaxHighlighting ? 'bg-indigo-600' : 'bg-gray-200'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'model' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">AI Model</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Model Version
                    </label>
                    <select
                      value={modelSettings.model}
                      onChange={(e) => setModelSettings({...modelSettings, model: e.target.value})}
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    >
                      <option value="gpt-4">GPT-4 (Most Capable)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo (Faster)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Balanced)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Temperature: {modelSettings.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={modelSettings.temperature}
                      onChange={(e) => setModelSettings({...modelSettings, temperature: parseFloat(e.target.value)})}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-indigo-500"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Controls randomness: Lower values for more focused responses, higher values for more creativity.
                    </p>
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Max Tokens: {modelSettings.maxTokens}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="100"
                      value={modelSettings.maxTokens}
                      onChange={(e) => setModelSettings({...modelSettings, maxTokens: parseInt(e.target.value)})}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-indigo-500"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Short</span>
                      <span>Medium</span>
                      <span>Long</span>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Maximum length of responses. Higher values may take longer to generate.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">System Instructions</h3>
                <textarea
                  placeholder="You are a helpful AI assistant..."
                  className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} min-h-[100px]`}
                />
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Custom instructions to guide the AI's behavior and responses.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-2xl font-bold`}>
                  {userPreferences.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{userPreferences.username || 'User'}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {userPreferences.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Username"
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="New Password"
                      className={`w-full p-2 rounded-lg mb-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className={`w-full p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <button className={`w-full py-2 rounded-lg font-medium ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}>
                  Delete Account
                </button>
                <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className={`p-4 border-t flex justify-end ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600'} text-white transition-colors`}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced FileUpload Component
const FileUpload = ({ onFileUpload, darkMode, fileInputRef }) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };
  
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        className="hidden"
        multiple
      />
      <div 
        className="relative"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          title="Upload files"
        >
          <BsImage size={20} />
        </button>
        
        {dragActive && (
          <div className={`absolute -top-20 -left-20 right-0 bottom-0 w-40 h-40 rounded-full flex items-center justify-center ${darkMode ? 'bg-indigo-900 bg-opacity-50' : 'bg-indigo-100'} border-2 border-dashed ${darkMode ? 'border-indigo-500' : 'border-indigo-400'} z-50`}>
            <div className="text-center p-4">
              <FiUpload size={24} className="mx-auto mb-2" />
              <p className="text-sm">Drop files here</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Enhanced TypingIndicator Component
const TypingIndicator = ({ darkMode }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '0ms' }} />
      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '150ms' }} />
      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} animate-bounce`} style={{ animationDelay: '300ms' }} />
      <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI is thinking...</span>
    </div>
  );
};

// Enhanced EmojiPicker Component
const EmojiPicker = ({ onSelect, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skinTone, setSkinTone] = useState('neutral');
  const [emojiCategories, setEmojiCategories] = useState([]);
  
  // In a real app, you would use an emoji library like emoji-picker-react
  const sampleEmojis = [
    { emoji: '😀', name: 'grinning face' },
    { emoji: '😃', name: 'grinning face with big eyes' },
    { emoji: '😄', name: 'grinning face with smiling eyes' },
    { emoji: '😁', name: 'beaming face with smiling eyes' },
    { emoji: '😆', name: 'grinning squinting face' },
    { emoji: '😅', name: 'grinning face with sweat' },
    { emoji: '🤣', name: 'rolling on the floor laughing' },
    { emoji: '😂', name: 'face with tears of joy' },
    { emoji: '🙂', name: 'slightly smiling face' },
    { emoji: '🙃', name: 'upside-down face' },
    { emoji: '😉', name: 'winking face' },
    { emoji: '😊', name: 'smiling face with smiling eyes' },
    { emoji: '😇', name: 'smiling face with halo' },
    { emoji: '🥰', name: 'smiling face with hearts' },
    { emoji: '😍', name: 'smiling face with heart-eyes' },
    { emoji: '🤩', name: 'star-struck' },
    { emoji: '😘', name: 'face blowing a kiss' },
    { emoji: '😗', name: 'kissing face' },
    { emoji: '😚', name: 'kissing face with closed eyes' },
    { emoji: '😙', name: 'kissing face with smiling eyes' },
    { emoji: '🥲', name: 'smiling face with tear' },
    { emoji: '😋', name: 'face savoring food' },
    { emoji: '😛', name: 'face with tongue' },
    { emoji: '😜', name: 'winking face with tongue' },
    { emoji: '🤪', name: 'zany face' },
    { emoji: '😝', name: 'squinting face with tongue' },
    { emoji: '🤑', name: 'money-mouth face' },
    { emoji: '🤗', name: 'hugging face' },
    { emoji: '🤭', name: 'face with hand over mouth' },
    { emoji: '🤫', name: 'shushing face' },
    { emoji: '🤔', name: 'thinking face' },
    { emoji: '🤐', name: 'zipper-mouth face' },
    { emoji: '🤨', name: 'face with raised eyebrow' },
    { emoji: '😐', name: 'neutral face' },
    { emoji: '😑', name: 'expressionless face' },
    { emoji: '😶', name: 'face without mouth' },
    { emoji: '😏', name: 'smirking face' },
    { emoji: '😒', name: 'unamused face' },
    { emoji: '🙄', name: 'face with rolling eyes' },
    { emoji: '😬', name: 'grimacing face' },
    { emoji: '🤥', name: 'lying face' },
    { emoji: '😌', name: 'relieved face' },
    { emoji: '😔', name: 'pensive face' },
    { emoji: '😪', name: 'sleepy face' },
    { emoji: '🤤', name: 'drooling face' },
    { emoji: '😴', name: 'sleeping face' },
    { emoji: '😷', name: 'face with medical mask' },
    { emoji: '🤒', name: 'face with thermometer' },
    { emoji: '🤕', name: 'face with head-bandage' },
    { emoji: '🤢', name: 'nauseated face' },
    { emoji: '🤮', name: 'face vomiting' },
    { emoji: '🤧', name: 'sneezing face' },
    { emoji: '🥵', name: 'hot face' },
    { emoji: '🥶', name: 'cold face' },
    { emoji: '🥴', name: 'woozy face' },
    { emoji: '😵', name: 'dizzy face' },
    { emoji: '🤯', name: 'exploding head' },
    { emoji: '🤠', name: 'cowboy hat face' },
    { emoji: '🥳', name: 'partying face' },
    { emoji: '😎', name: 'smiling face with sunglasses' },
    { emoji: '🤓', name: 'nerd face' },
    { emoji: '🧐', name: 'face with monocle' },
    { emoji: '😕', name: 'confused face' },
    { emoji: '😟', name: 'worried face' },
    { emoji: '🙁', name: 'slightly frowning face' },
    { emoji: '😮', name: 'face with open mouth' },
    { emoji: '😯', name: 'hushed face' },
    { emoji: '😲', name: 'astonished face' },
    { emoji: '😳', name: 'flushed face' },
    { emoji: '🥺', name: 'pleading face' },
    { emoji: '😦', name: 'frowning face with open mouth' },
    { emoji: '😧', name: 'anguished face' },
    { emoji: '😨', name: 'fearful face' },
    { emoji: '😰', name: 'anxious face with sweat' },
    { emoji: '😥', name: 'sad but relieved face' },
    { emoji: '😢', name: 'crying face' },
    { emoji: '😭', name: 'loudly crying face' },
    { emoji: '😱', name: 'face screaming in fear' },
    { emoji: '😖', name: 'confounded face' },
    { emoji: '😣', name: 'persevering face' },
    { emoji: '😞', name: 'disappointed face' },
    { emoji: '😓', name: 'downcast face with sweat' },
    { emoji: '😩', name: 'weary face' },
    { emoji: '😫', name: 'tired face' },
    { emoji: '🥱', name: 'yawning face' },
    { emoji: '😤', name: 'face with steam from nose' },
    { emoji: '😡', name: 'pouting face' },
    { emoji: '😠', name: 'angry face' },
    { emoji: '🤬', name: 'face with symbols on mouth' },
    { emoji: '😈', name: 'smiling face with horns' },
    { emoji: '👿', name: 'angry face with horns' },
    { emoji: '💀', name: 'skull' },
    { emoji: '☠️', name: 'skull and crossbones' },
    { emoji: '💩', name: 'pile of poo' },
    { emoji: '🤡', name: 'clown face' },
    { emoji: '👹', name: 'ogre' },
    { emoji: '👺', name: 'goblin' },
    { emoji: '👻', name: 'ghost' },
    { emoji: '👽', name: 'alien' },
    { emoji: '👾', name: 'alien monster' },
    { emoji: '🤖', name: 'robot' },
    { emoji: '😺', name: 'grinning cat' },
    { emoji: '😸', name: 'grinning cat with smiling eyes' },
    { emoji: '😹', name: 'cat with tears of joy' },
    { emoji: '😻', name: 'smiling cat with heart-eyes' },
    { emoji: '😼', name: 'cat with wry smile' },
    { emoji: '😽', name: 'kissing cat' },
    { emoji: '🙀', name: 'weary cat' },
    { emoji: '😿', name: 'crying cat' },
    { emoji: '😾', name: 'pouting cat' },
    { emoji: '🙈', name: 'see-no-evil monkey' },
    { emoji: '🙉', name: 'hear-no-evil monkey' },
    { emoji: '🙊', name: 'speak-no-evil monkey' },
    { emoji: '💋', name: 'kiss mark' },
    { emoji: '💌', name: 'love letter' },
    { emoji: '💘', name: 'heart with arrow' },
    { emoji: '💝', name: 'heart with ribbon' },
    { emoji: '💖', name: 'sparkling heart' },
    { emoji: '💗', name: 'growing heart' },
    { emoji: '💓', name: 'beating heart' },
    { emoji: '💞', name: 'revolving hearts' },
    { emoji: '💕', name: 'two hearts' },
    { emoji: '💟', name: 'heart decoration' },
    { emoji: '❣️', name: 'heart exclamation' },
    { emoji: '💔', name: 'broken heart' },
    { emoji: '❤️', name: 'red heart' },
    { emoji: '🧡', name: 'orange heart' },
    { emoji: '💛', name: 'yellow heart' },
    { emoji: '💚', name: 'green heart' },
    { emoji: '💙', name: 'blue heart' },
    { emoji: '💜', name: 'purple heart' },
    { emoji: '🤎', name: 'brown heart' },
    { emoji: '🖤', name: 'black heart' },
    { emoji: '🤍', name: 'white heart' },
    { emoji: '💯', name: 'hundred points' },
    { emoji: '💢', name: 'anger symbol' },
    { emoji: '💥', name: 'collision' },
    { emoji: '💫', name: 'dizzy' },
    { emoji: '💦', name: 'sweat droplets' },
    { emoji: '💨', name: 'dashing away' },
    { emoji: '🕳️', name: 'hole' },
    { emoji: '💣', name: 'bomb' },
    { emoji: '💬', name: 'speech balloon' },
    { emoji: '👁️‍🗨️', name: 'eye in speech bubble' },
    { emoji: '🗨️', name: 'left speech bubble' },
    { emoji: '🗯️', name: 'right anger bubble' },
    { emoji: '💭', name: 'thought balloon' },
    { emoji: '💤', name: 'zzz' },
    { emoji: '👋', name: 'waving hand' },
    { emoji: '🤚', name: 'raised back of hand' },
    { emoji: '🖐️', name: 'hand with fingers splayed' },
    { emoji: '✋', name: 'raised hand' },
    { emoji: '🖖', name: 'vulcan salute' },
    { emoji: '👌', name: 'OK hand' },
    { emoji: '🤏', name: 'pinching hand' },
    { emoji: '✌️', name: 'victory hand' },
    { emoji: '🤞', name: 'crossed fingers' },
    { emoji: '🤟', name: 'love-you gesture' },
    { emoji: '🤘', name: 'sign of the horns' },
    { emoji: '🤙', name: 'call me hand' },
    { emoji: '👈', name: 'backhand index pointing left' },
    { emoji: '👉', name: 'backhand index pointing right' },
    { emoji: '👆', name: 'backhand index pointing up' },
    { emoji: '🖕', name: 'middle finger' },
    { emoji: '👇', name: 'backhand index pointing down' },
    { emoji: '☝️', name: 'index pointing up' },
    { emoji: '👍', name: 'thumbs up' },
    { emoji: '👎', name: 'thumbs down' },
    { emoji: '✊', name: 'raised fist' },
  ];

  // Filter emojis based on search term
  const filteredEmojis = searchTerm
    ? sampleEmojis.filter(emoji => emoji.name.includes(searchTerm))
    : sampleEmojis;

  // Group emojis by category
  const categories = filteredEmojis.reduce((acc, emoji) => {
    const category = emoji.name.split(' ')[0];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(emoji);
    return acc;
  }, {});

  // Set emoji categories
  useEffect(() => {
    setEmojiCategories(Object.keys(categories));
  }, [categories]);

  // Render emoji picker
  return (
    <div className="emoji-picker">
      <input
        type="text"
        placeholder="Search emojis..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className="emoji-categories">
        {emojiCategories.map(category => (
          <div key={category} className="emoji-category">
            <h3>{category}</h3>
            <div className="emoji-list">
              {categories[category].map(emoji => (
                <span
                  key={emoji.name}
                  className={`emoji ${darkMode ? 'dark' : 'light'}`}
                  onClick={() => onSelect(emoji.emoji)} // Corrected to use onSelect
                >
                  {emoji.emoji}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
