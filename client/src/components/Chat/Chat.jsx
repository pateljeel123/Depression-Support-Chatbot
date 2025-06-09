import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion"; // Added Reorder
import { Link } from "react-router-dom"; // Added Link for navigation
import {
  FiSend,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
  FiCopy,
  FiSearch,
  FiStar,
  FiFileText,
  FiUpload,
  FiSettings,
  FiUser,
  FiGrid, // Added for Dashboard icon
  FiChevronDown, // Added for history toggle
  FiChevronUp, // Added for history toggle
} from "react-icons/fi"; // Added FiFileText, FiUpload, FiSettings, FiUser
import { BsEmojiSmile } from "react-icons/bs";
import Picker, { EmojiStyle } from "emoji-picker-react";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { RiRobot2Line } from "react-icons/ri"; // Added RiRobot2Line
import { AiOutlineRobot, AiFillRobot } from "react-icons/ai"; // Added AiOutlineRobot, AiFillRobot

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import { themes } from "prism-react-renderer";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Tooltip } from "./components/Tooltip";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { ChatItem } from "./components/ChatItem";
import { PromptSuggestion } from "./components/PromptSuggestion";
import { WelcomePage } from "./components/WelcomePage";
import { ChatInputActions } from "./components/ChatInputActions"; // Added this import
import { MessageMenu } from "./components/MessageMenu"; // Added this import
import { CrisisResources } from "./components/CrisisResources"; // Added this import
import { VoiceVisualizer } from "./components/VoiceVisualizer"; // Added for voice visualization
import { supabase } from "../../services/supabaseClient";

const lightCodeTheme = themes.vsLight;
const darkCodeTheme = themes.vsDark;

export default function Chat() {
  // State management
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode (true)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  // Removed activeTab state as settings tab has been removed
  const [showMic, setShowMic] = useState(false); // Added showMic state
  const [modelSettings, setModelSettings] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    model: "gpt-4",
  });
  // Removed attachments and attachmentPreviews state
  const [pinnedChats, setPinnedChats] = useState([]);
  const [replyingToMessage, setReplyingToMessage] = useState(null); // For message replies
  const [editingMessage, setEditingMessage] = useState(null); // For editing messages
  const [editedContent, setEditedContent] = useState(""); // For editing message content
  const [reactingToMessageId, setReactingToMessageId] = useState(null); // For message reactions
  const [availableVoices, setAvailableVoices] = useState([]);
  const emojiPickerRef = useRef(null); // Ref for emoji picker
  const [isBotSpeaking, setIsBotSpeaking] = useState(false); // Added state for bot speaking indicator
  const [audioLevel, setAudioLevel] = useState(0); // Added for voice visualization
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneSourceRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true); // For chat history toggle

  // Effect to hide scrollbars globally and set fonts
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
      
      body, html {
        overflow: hidden !important;
        font-family: 'Inter', 'Poppins', system-ui, sans-serif !important;
      }
      ::-webkit-scrollbar {
        display: none !important; /* For Webkit browsers */
      }
      * {
        scrollbar-width: none; /* For Firefox */
        -ms-overflow-style: none; /* For IE and Edge */
      }
      .chat-container, .chat-message, .chat-input, .message-content, .sidebar-content {
        font-family: 'Inter', 'Poppins', system-ui, sans-serif !important;
      }
      .message-content, .prose p, .prose li, .prose code, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
        font-family: 'Inter', 'Poppins', system-ui, sans-serif !important;
        font-size: 1.1rem !important;
        line-height: 1.6 !important;
      }
      .chat-input {
        font-size: 1.05rem !important;
      }
      .typing-animation {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 16px;
        border-radius: 16px;
        transition: all 0.3s ease;
      }
      .typing-animation span {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        animation: bounce 1.2s infinite ease-in-out;
        box-shadow: 0 0 10px 2px rgba(99, 102, 241, 0.6);
      }
      .typing-animation span:nth-child(1) {
        animation-delay: 0s;
      }
      .typing-animation span:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-animation span:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes bounce {
        0%, 80%, 100% {
          transform: translateY(0);
          opacity: 0.6;
        }
        40% {
          transform: translateY(-10px);
          opacity: 1;
          box-shadow: 0 0 15px 3px rgba(99, 102, 241, 0.8);
        }
      }
      
      /* Glassmorphism/Neumorphism effects */
      .glass-effect {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
      }
      
      .neomorphism-effect {
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2),
                    -5px -5px 15px rgba(255, 255, 255, 0.05);
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function to remove the style when the component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Empty dependency array ensures this runs only once on mount
 
  // Effect to handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      // Desktop: >= 1024px (open by default)
      // Tablet/Mobile: < 1024px (closed by default)
      setSidebarOpen(window.innerWidth >= 1024);
    };
   
    // Set initial state based on screen size
    handleResize();
   
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
   
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleClearCurrentChat = async () => {
    if (activeChat) {
      setMessages([]); // Clear messages from UI immediately
      
      // If user is logged in, delete messages from Supabase
      if (userID) {
        try {
          // Delete all messages associated with the current chat session from Supabase
          const { error: messagesError } = await supabase
            .from('messages')
            .delete()
            .eq('session_id', activeChat);
          
          if (messagesError) {
            console.error('Error deleting messages from Supabase:', messagesError);
          }
        } catch (error) {
          console.error('Error clearing chat from Supabase:', error);
        }
      }
      
      // Update the chat in state to have empty messages
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === activeChat ? { ...chat, messages: [] } : chat
        )
      );
      
      console.log(`Chat cleared for session: ${activeChat}`);
      playSound("delete"); // Play delete sound effect
    }
  };

  const handlePreferenceChange = (key, value) => {
    setUserPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const [userPreferences, setUserPreferences] = useState({
    animations: true,
    markdown: true,
    soundEffects: true,
    syntaxHighlighting: true, // Added syntaxHighlighting
    username: "", // This will store the full name
    email: "", // Added email
    darkMode: true, // Default to dark mode (true)
    ttsEnabled: false, // Changed to false to disable TTS by default
    ttsVoice: null, // Added ttsVoice
    ttsSpeed: 1, // Added ttsSpeed (0.1 to 10, default 1)
  });
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/chat";

  // Play sound effects
  const playSound = (type) => {
    if (!userPreferences.soundEffects) return;

    const sounds = {
      newChat:
        "https://assets.mixkit.co/sfx/preview/mixkit-positive-interface-beep-221.mp3",
      selectChat:
        "https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3",
      send: "https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3",
      delete:
        "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
      pin: "https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3",
      unpin:
        "https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3",
      copy: "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3",
      save: "https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3",
    };

    const audio = new Audio(sounds[type]);
    audio.play();
  };

  // Refs
  const messagesEndRef = useRef(null);
  const reactionPickerRef = useRef(null); // Ref for reaction picker
  const inputRef = useRef(null);
  const chatInputRef = useRef(null); // Ref for the chat input area for drag and drop
  // Removed fileInputRef
  const speechSynthesisRef = useRef(window.speechSynthesis);

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [userID, setUserID] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Helper functions
  const createNewChat = useCallback(() => {
    return {
      id: Date.now().toString(),
      title: "New Chat"
    };
  }, []); // Added empty dependency array for useCallback

  // Helper: Load data from localStorage (fallback or for non-logged-in users)
  const loadDataFromLocalStorage = useCallback(
    () => {
      const savedChats = localStorage.getItem("chats");
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        let currentActiveChatId = parsedChats[0]?.id || null;

        if (!currentActiveChatId && parsedChats.length > 0) {
          currentActiveChatId = parsedChats[0].id = Date.now().toString();
        }
        setActiveChat(currentActiveChatId);

        if (currentActiveChatId) {
          const activeChatData = parsedChats.find(
            (c) => c.id === currentActiveChatId
          );
          if (
            activeChatData &&
            activeChatData.messages &&
            activeChatData.messages.length > 0
          ) {
            setMessages(activeChatData.messages);
          } else {
            setMessages([]);
            setChats((prevChats) =>
              prevChats.map((c) =>
                c.id === currentActiveChatId ? { ...c, messages: [] } : c
              )
            );
          }
        } else if (parsedChats.length === 0) {
          const newChatInstance = createNewChat();
          setActiveChat(newChatInstance.id);
          newChatInstance.messages = [];
          setChats([newChatInstance]);
          setMessages([]);
        }
      } else {
        // No chats in localStorage, create a new one locally
        const newChatInstance = createNewChat();
        setActiveChat(newChatInstance.id);
        // Welcome message logic can be handled by WelcomePage component based on empty messages
        newChatInstance.messages = [];
        setChats([newChatInstance]);
        setMessages([]);
      }
      setInitialLoadComplete(true);
    },
    [createNewChat]
  );

  // Helper: Fetch chat messages from Supabase for a given chat ID
  const fetchMessagesForChat = useCallback(
    async (chatId) => {
      if (!chatId || !userID) {
        setMessages([]);
        return;
      }
      setIsLoading(true);
      setInitialLoading(true); // Set initialLoading to true for skeleton UI
      try {
        const { data: chatMessages, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .eq("session_id", chatId)
          .order("created_at", { ascending: true });

        if (messagesError) throw messagesError;

        const loadedMessages = chatMessages
          ? chatMessages.map((m) => ({
            id: m.id,
            chatId: m.session_id,
            role: m.sender_role,
            content: m.content,
            timestamp: m.created_at,
            replyTo: m.response_to,
            reactions: {},
            attachments: [],
            starred: false,
          }))
          : [];

        setMessages(loadedMessages);
        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === chatId ? { ...c, messages: loadedMessages } : c
          )
        );
      } catch (error) {
        console.error(`Error fetching messages for chat ${chatId}:`, error);
        setMessages([]);
      } finally {
        setIsLoading(false);
        setInitialLoading(false); // Reset initialLoading after fetching
      }
    },
    [userID]
  );

  // Create a new chat
  const handleNewChat = useCallback(
    async (isInitialSetup = false) => {
      console.log("handleNewChat called with isInitialSetup:", isInitialSetup);
      
      // Check if there's already an empty chat we can use
      const existingEmptyChat = chats.find(chat => 
        chat.messages?.length === 0 || 
        (chat.isTemporary === true && (!chat.messages || chat.messages.length === 0))
      );
      
      if (existingEmptyChat) {
        console.log("Using existing empty chat:", existingEmptyChat.id);
        setActiveChat(existingEmptyChat.id);
        setMessages([]);
        
        if (!isInitialSetup) {
          setInput("");
          setSidebarOpen(false);
          setAttachments([]);
          setAttachmentPreviews([]);
          playSound("newChat");
        }
        
        return existingEmptyChat;
      }
      
      setIsLoading(true); // Only set isLoading, not initialLoading for new chat creation
      let newChatData;
      const localNewChat = createNewChat(); // Create basic structure locally first
      localNewChat.isTemporary = true; // Mark as temporary/empty

      if (userID) {
        try {
          const { data, error } = await supabase
            .from("sessions")
            .insert({ user_id: userID, session_title: localNewChat.title })
            .select()
            .single();

          if (error) throw error;

          newChatData = {
            id: data.id,
            title: data.session_title,
            createdAt: data.created_at,
            messages: [],
            isTemporary: true
          };
        } catch (error) {
          console.error("Error creating new chat in Supabase:", error);
          // Fallback to local-only chat creation if Supabase fails
          newChatData = { ...localNewChat, messages: [] };
        }
      } else {
        // No user logged in, create chat locally
        newChatData = { ...localNewChat, messages: [] };
      }

      setChats((prevChats) => {
        // Double-check that we don't already have a temporary chat
        const hasTemporaryChat = prevChats.some(chat => 
          chat.isTemporary === true && (!chat.messages || chat.messages.length === 0)
        );
        
        if (hasTemporaryChat) {
          console.log("Found temporary chat during setChats, not creating a new one");
          return prevChats;
        }
        
        return [newChatData, ...prevChats];
      });
      
      setActiveChat(newChatData.id);
      setMessages([]); // New chat starts with no messages displayed

      if (!isInitialSetup) {
        setInput("");
        setSidebarOpen(false);
        setAttachments([]);
        setAttachmentPreviews([]);
        playSound("newChat");
      }
      setIsLoading(false);
      return newChatData; // Return the new chat data for potential chaining
    },
    [userID, chats, createNewChat, playSound] // Added chats as dependency
  );

  // Helper: Fetch all chat sessions for the current user from Supabase
  const fetchChatsFromSupabase = useCallback(
    async (currentUserID) => {
      console.log("fetchChatsFromSupabase called for user:", currentUserID);
      setIsLoading(true); // Only set isLoading, not initialLoading for new chat creation
      setInitialLoading(true); // Set initialLoading to true for skeleton UI
      try {
        const { data: sessions, error: sessionsError } = await supabase
          .from("sessions")
          .select("*")
          .eq("user_id", currentUserID)
          .order("created_at", { ascending: false });

        if (sessionsError) throw sessionsError;

        if (sessions && sessions.length > 0) {
          console.log("Found", sessions.length, "sessions in Supabase");
          const loadedChats = sessions.map((s) => ({
            id: s.id,
            title: s.session_title,
            messages: [], // Messages will be loaded separately for the active chat
          }));
          setChats(loadedChats);
          const currentActiveChatId = loadedChats[0].id;
          setActiveChat(currentActiveChatId);
          await fetchMessagesForChat(currentActiveChatId);
        } else {
          console.log("No sessions found in Supabase, checking if we need to create a new chat");
          // Only create a new chat if there are no chats in the state
          if (chats.length === 0) {
            console.log("No chats in state, creating a new one");
            // No sessions in Supabase, create a new one (will also save to Supabase)
            await handleNewChat(true); // Pass true for initial setup context
          } else {
            console.log("Chats already exist in state, not creating a new one");
          }
        }
      } catch (error) {
        console.error("Error fetching chats from Supabase:", error);
        loadDataFromLocalStorage(); // Fallback to localStorage if Supabase fails
      } finally {
        setIsLoading(false);
        setInitialLoading(false); // Reset initialLoading after fetching
        setInitialLoadComplete(true);
      }
    },
    [
      fetchMessagesForChat,
      loadDataFromLocalStorage,
      handleNewChat, // Ensure handleNewChat is stable (e.g., wrapped in useCallback)
      chats // Added chats as dependency to check its length
    ]
  );

  // Effect 1: Fetch user and then trigger data loading, also set username and email
  useEffect(() => {
    const fetchUserAndLoadData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        loadDataFromLocalStorage(); // Fallback if user fetch fails
        return;
      }

      if (user) {
        setUserID(user.id);
        setUserPreferences(prev => ({
          ...prev,
          username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
        }));
        // Data fetching for chats will be triggered by the useEffect depending on userID
      } else {
        console.log("No user logged in. Loading data from localStorage.");
        setUserPreferences(prev => ({ ...prev, username: '', email: '' })); // Clear user specific prefs
        loadDataFromLocalStorage();
      }
    };
    fetchUserAndLoadData();
  }, [loadDataFromLocalStorage]);

  // Effect 2: Load data from Supabase once userID is set
  useEffect(() => {
    if (userID && !initialLoadComplete) {
      // Only run if userID is set and initial load hasn't happened via Supabase
      fetchChatsFromSupabase(userID);
    }
    // If no userID, loadDataFromLocalStorage would have been called by the previous useEffect
  }, [userID, fetchChatsFromSupabase, initialLoadComplete, handleNewChat]); // Added handleNewChat

  // Effect 3: Load settings and dark mode from localStorage (runs once)
  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      setUserPreferences(JSON.parse(savedSettings));
    }
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  // Save chats to localStorage (conditionally, if not using Supabase or as a backup)
  // Consider if this is still needed if Supabase is the primary source of truth.
  // For now, let's keep it but be mindful of potential conflicts if Supabase is active.
  useEffect(() => {
    if (!userID) {
      // Only save to localStorage if user is not logged in (using local mode)
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats, userID]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Handle click outside emoji picker to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        // Check if the click was on the emoji toggle button itself.
        // The stopPropagation in the toggle button's onClick should prevent this.
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef, setShowEmojiPicker]);

  // Function to speak text using browser's SpeechSynthesis API - disabled
  const speakText = useCallback(
    (text) => {
      // Speech functionality disabled
      return;
    },
    [
      userPreferences.ttsEnabled,
      userPreferences.ttsVoice,
      userPreferences.ttsSpeed,
      availableVoices, // Added dependency on availableVoices
    ]
  );

  // Function to stop text-to-speech
  const stopSpeaking = useCallback(() => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsBotSpeaking(false);
      console.log('Speech stopped by user');
    }
  }, []);

  // Handle speech recognition transcript
  useEffect(() => {
    // Update input with transcript. If listening stops, the final transcript remains.
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Get available voices for TTS
  useEffect(() => {
    const updateVoices = () => {
      if (speechSynthesisRef.current) {
        const voices = speechSynthesisRef.current.getVoices();
        console.log('Available voices:', voices.length);
        setAvailableVoices(voices);
        // If no voice is selected and voices are available, select a default one
        if (!userPreferences.ttsVoice && voices.length > 0) {
          const defaultVoice =
            voices.find((v) => v.default) ||
            voices.find((v) =>
              v.lang.startsWith(navigator.language.split("-")[0])
            ) ||
            voices[0];
          if (defaultVoice) {
            console.log('Setting default voice:', defaultVoice.name);
            handlePreferenceChange("ttsVoice", defaultVoice.name);
          }
        }
      }
    };

    // Force voices to load by calling getVoices() first
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    if (speechSynthesisRef.current) {
      // Initial call to get voices with a short delay to ensure voices are loaded
      updateVoices();
      setTimeout(updateVoices, 500);
      
      if (speechSynthesisRef.current.onvoiceschanged !== undefined) {
        speechSynthesisRef.current.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (
        speechSynthesisRef.current &&
        speechSynthesisRef.current.onvoiceschanged !== undefined
      ) {
        speechSynthesisRef.current.onvoiceschanged = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechSynthesisRef]); // Rerun if speechSynthesisRef instance changes (should be stable after mount)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Audio processing for visualizer
  const startAudioProcessing = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        microphoneSourceRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        microphoneSourceRef.current.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateAudioLevel = () => {
          if (analyserRef.current && microphoneSourceRef.current && listening) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;
            setAudioLevel(average / 128); // Normalize to 0-1 range (approx)
            animationFrameIdRef.current =
              requestAnimationFrame(updateAudioLevel);
          } else {
            setAudioLevel(0); // Reset if not listening or refs are null
            if (animationFrameIdRef.current)
              cancelAnimationFrame(animationFrameIdRef.current);
          }
        };
        animationFrameIdRef.current = requestAnimationFrame(updateAudioLevel);
      } catch (err) {
        console.error("Error accessing microphone for visualizer:", err);
        setAudioLevel(0);
      }
    } else {
      console.warn(
        "getUserMedia not supported or not available in this context (e.g. http)"
      );
      setAudioLevel(0);
    }
  };

  const stopAudioProcessing = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (
      microphoneSourceRef.current &&
      microphoneSourceRef.current.mediaStream
    ) {
      microphoneSourceRef.current.mediaStream
        .getTracks()
        .forEach((track) => track.stop());
    }
    if (microphoneSourceRef.current) {
      microphoneSourceRef.current.disconnect();
      microphoneSourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current
        .close()
        .catch((e) => console.error("Error closing AudioContext:", e));
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // Cleanup audio processing on component unmount
  useEffect(() => {
    return () => {
      stopAudioProcessing();
    };
  }, []);

  // Manage audio processing and mic banner based on listening state
  useEffect(() => {
    if (listening) {
      setShowMic(true);
      startAudioProcessing();
    } else {
      stopAudioProcessing();
      setShowMic(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createMessage = (
    chatId,
    role,
    content,
    replyToId = null,
    attachments = []
  ) => {
    return {
      id: Date.now().toString(), // Consider crypto.randomUUID() for better uniqueness
      chatId,
      role,
      content,
      timestamp: new Date().toISOString(),
      replyToId,
      reactions: {},
      attachments,
      starred: false,
    };
  };
  // Added empty dependency array for useCallback

  // Handle starting a reply
  const handleStartReply = (message) => {
    setReplyingToMessage(message);
    inputRef.current?.focus();
  };

  // Handle canceling a reply
  const handleCancelReply = () => {
    setReplyingToMessage(null);
  };

  // Handle emoji selection
  const onEmojiClick = (emojiData, event) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    // setShowEmojiPicker(false); // Optionally close picker after selection
  };

  // Note: handleNewChat has been moved before fetchChatsFromSupabase to resolve initialization error.
  // The useEffect that was here, which also depended on handleNewChat, will now correctly find it defined.


  // Select a chat from history
  const handleSelectChat = useCallback(
    async (chatId) => {
      setActiveChat(chatId);
      playSound("selectChat");

      if (userID) {
        // If user is logged in, fetch messages from Supabase for this chat
        await fetchMessagesForChat(chatId);
      } else {
        // If no user, load messages from local chat state (already handled by initial load or local updates)
        const currentChat = chats.find((chat) => chat.id === chatId);
        if (
          currentChat &&
          currentChat.messages &&
          currentChat.messages.length > 0
        ) {
          setMessages(currentChat.messages);
        } else {
          setMessages([]);
          if (currentChat) {
            setChats((prevChats) =>
              prevChats.map((c) =>
                c.id === chatId ? { ...c, messages: [] } : c
              )
            );
          }
        }
      }
    },
    [userID, chats, fetchMessagesForChat, playSound]
  );

  // Delete a chat
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    console.log("Deleting chat:", chatId);
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    // If this was the active chat, clear messages immediately
    if (activeChat === chatId) {
      setMessages([]);
    }

    if (userID) {
      try {
        // First, delete all messages associated with the chat session
        const { error: messagesError } = await supabase
          .from('messages')
          .delete()
          .eq('session_id', chatId);
        
        if (messagesError) {
          console.error('Error deleting messages from Supabase:', messagesError);
          // Continue with deletion even if messages deletion fails
        }

        // Then, delete the chat session itself
        const { error: sessionError } = await supabase
          .from('sessions')
          .delete()
          .eq('id', chatId)
          .eq('user_id', userID);
        
        if (sessionError) {
          console.error('Error deleting session from Supabase:', sessionError);
          // Continue with UI update even if session deletion fails
        }

      } catch (error) {
        console.error('Error deleting chat from Supabase:', error);
        // We'll continue with the UI update even if the database deletion fails
      }
    }

    if (activeChat === chatId) {
      if (updatedChats.length > 0) {
        console.log("Setting new active chat after deletion:", updatedChats[0].id);
        setActiveChat(updatedChats[0].id);
        // Fetch messages for the new active chat if not already loaded
        const newActiveChatDetails = updatedChats.find(c => c.id === updatedChats[0].id);
        if (newActiveChatDetails && (!newActiveChatDetails.messages || newActiveChatDetails.messages.length === 0)) {
          fetchMessagesForChat(updatedChats[0].id);
        }
      } else {
        console.log("No chats left after deletion, creating a new one");
        // Use setTimeout to ensure state updates have completed
        setTimeout(() => {
          if (chats.length === 0) {
            handleNewChat(true); // Create a new chat with initial setup flag
          }
        }, 500); // Increased timeout to prevent state conflicts
      }
    }
    playSound("delete");
  };

  // Toggle pin chat
  const handleTogglePin = (chatId, e) => {
    e.stopPropagation();
    setPinnedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
    playSound(pinnedChats.includes(chatId) ? "unpin" : "pin"); // Corrected: used pinnedChats instead of undefined 'prev'
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
    setChats(
      chats.map((chat) =>
        chat.id === editingChatId ? { ...chat, title: editTitle } : chat
      )
    );
    setEditingChatId(null);
    playSound("save");
  };

  // Copy message to clipboard
  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    playSound("copy");
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
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? {
            ...msg,
            reactions: {
              ...(msg.reactions || {}),
              [reactionEmoji]: (msg.reactions?.[reactionEmoji] || 0) + 1,
            },
          }
          : msg
      )
    );
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === messageId
                ? {
                  ...msg,
                  reactions: {
                    ...(msg.reactions || {}),
                    [reactionEmoji]:
                      (msg.reactions?.[reactionEmoji] || 0) + 1,
                  },
                }
                : msg
            ),
          }
          : chat
      )
    );
    setReactingToMessageId(null); // Close picker after reaction
    playSound("send"); // Or a specific reaction sound
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

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId
          ? {
            ...msg,
            content: editedContent,
            updatedAt: new Date().toISOString(),
          }
          : msg
      )
    );
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
            ...chat,
            messages: (chat.messages || []).map((msg) =>
              msg.id === messageId
                ? {
                  ...msg,
                  content: editedContent,
                  updatedAt: new Date().toISOString(),
                }
                : msg
            ),
            updatedAt: new Date().toISOString(),
          }
          : chat
      )
    );
    setEditingMessage(null);
    setEditedContent("");
    playSound("save");
  };

  // Star or unstar a message
  const handleStarMessage = (messageId) => {
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    const currentMessage = messages[messageIndex];
    const newStarredState = !currentMessage.starred;

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, starred: newStarredState } : msg
      )
    );

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: (chat.messages || []).map((msg) =>
              msg.id === messageId ? { ...msg, starred: newStarredState } : msg
            ),
          };
        }
        return chat;
      })
    );
    playSound(newStarredState ? "pin" : "unpin"); // Use 'pin' and 'unpin' sounds
  };

  // Share a message (placeholder)
  const handleShareMessage = (message) => {
    console.log("Sharing message:", message);
    // Implement sharing logic, e.g., copy link, open share dialog
    navigator.clipboard.writeText(`Shared message: ${message.content}`);
    playSound("copy"); // Or a specific share sound
  };

  // Placeholder for deleting a message
  const handleDeleteMessage = (messageId) => {
    console.log("Attempting to delete message:", messageId);
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId)
    );
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
            ...chat,
            messages: (chat.messages || []).filter(
              (msg) => msg.id !== messageId
            ),
          }
          : chat
      )
    );
    playSound("delete");
  };

  // Send a message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    resetTranscript();
    setShowMic(false);
    stopAudioProcessing();

    const userMessageContent = input.trim();
    const tempUserMessageId = Date.now().toString(); // Temporary ID for UI update

    const userMessageForUI = {
      id: tempUserMessageId,
      chatId: activeChat,
      role: "user",
      content: userMessageContent,
      timestamp: new Date().toISOString(),
      replyTo: replyingToMessage?.id || null,
      attachments: [], // Empty array since attachments are removed
      starred: false,
      reactions: {},
    };

    setMessages((prevMessages) => [...prevMessages, userMessageForUI]);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
            ...chat,
            messages: [...(chat.messages || []), userMessageForUI],
            updatedAt: new Date().toISOString(),
          }
          : chat
      )
    );

    const currentInput = input;
    const currentReplyingToMessage = replyingToMessage;

    setInput("");
    setReplyingToMessage(null);
    playSound("send");

    // Check if this is the first message in a new chat and set title
    const currentChatDetails = chats.find(chat => chat.id === activeChat);
    if (currentChatDetails && currentChatDetails.title === "New Chat" && userMessageContent) {
      const newTitle = userMessageContent.split(' ').slice(0, 5).join(' ') + (userMessageContent.split(' ').length > 5 ? '...' : '');
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat ? { ...chat, title: newTitle } : chat
        )
      );
      if (userID) {
        try {
          await supabase
            .from('sessions')
            .update({ session_title: newTitle })
            .eq('id', activeChat)
            .eq('user_id', userID);
        } catch (error) {
          console.error('Error updating chat title in Supabase:', error);
        }
      }
    }

    // Save user message to Supabase
    let dbUserMessageId = tempUserMessageId;
    if (userID && activeChat) {
      try {
        const { data: savedUserMsg, error: userMsgError } = await supabase
          .from("messages")
          .insert({
            session_id: activeChat,
            sender_role: "user",
            content: userMessageForUI.content,
            response_to: currentReplyingToMessage?.id || null,
          })
          .select("id")
          .single();
        if (userMsgError) throw userMsgError;
        dbUserMessageId = savedUserMsg.id;
        // Update message in local state with Supabase ID
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempUserMessageId ? { ...m, id: dbUserMessageId } : m
          )
        );
        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === activeChat
              ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === tempUserMessageId
                    ? { ...m, id: dbUserMessageId }
                    : m
                ),
              }
              : c
          )
        );
      } catch (error) {
        console.error("Error saving user message to Supabase:", error);
        // Handle UI to indicate message failed to save, potentially revert optimistic update or show error
      }
    }
    // Bot response logic (using existing API call structure)
    const tempBotMessageId = Date.now().toString() + "-bot";
    const botPlaceholderMessage = {
      id: tempBotMessageId,
      chatId: activeChat,
      role: "assistant",
      content: "", // Empty content as we'll show animation instead
      isLoading: true, // Add isLoading flag to identify skeleton loader
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, botPlaceholderMessage]);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChat
          ? {
            ...chat,
            messages: [...(chat.messages || []), botPlaceholderMessage],
            updatedAt: new Date().toISOString(),
          }
          : chat
      )
    );

    try {
      // Construct history for API, using potentially updated user message ID from Supabase
      const historyForPayload = messages
      .map((m) =>
        m.id === tempUserMessageId ? { ...m, id: dbUserMessageId } : m
      )
      .slice(-20)
      .map((msg) => ({
        role: msg.role === "ai" ? "assistant" : msg.role, // Normalize invalid role
        content: msg.content,
      }));

      // Check for duplicate messages in history
      const uniqueMessages = [];
      const seenMessages = new Set();
      
      for (const msg of historyForPayload) {
        // Create a unique key for each message based on role and content
        const msgKey = `${msg.role}:${msg.content}`;
        
        // Only add the message if we haven't seen it before
        if (!seenMessages.has(msgKey)) {
          uniqueMessages.push(msg);
          seenMessages.add(msgKey);
        }
      }
      
      // Add the current user message (with potentially DB ID) to the history if not already there due to async state updates
      const finalUserMessageForPayload = {
        role: "user",
        content: userMessageContent,
      };
      
      const finalUserMsgKey = `user:${userMessageContent}`;
      if (!seenMessages.has(finalUserMsgKey)) {
        uniqueMessages.push(finalUserMessageForPayload);
        seenMessages.add(finalUserMsgKey);
      }

      const payload = {
        messages: uniqueMessages, // Use uniqueMessages instead of historyForPayload
        user_preferences: userPreferences,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({
            error: { message: `API request failed: ${response.statusText}` },
          }));
        throw new Error(
          errorData.error?.message ||
          errorData.message ||
          `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const assistantReply =
        data.choices?.[0]?.message?.content ||
        "Sorry, I received an unexpected response format.";
      const botResponseTimestamp = new Date().toISOString();

      // Save bot message to Supabase
      let dbBotMessageId = tempBotMessageId;
      if (userID && activeChat) {
        try {
          const { data: savedBotMsg, error: botMsgError } = await supabase
            .from("messages")
            .insert({
              session_id: activeChat,
              sender_role: "ai",
              content: assistantReply,
              response_to: null,
            })
            .select("id")
            .single();
          if (botMsgError) throw botMsgError;
          dbBotMessageId = savedBotMsg.id;
        } catch (error) {
          console.error("Error saving bot message to Supabase:", error);
        }
      }

      // Update placeholder with actual bot response and Supabase ID
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempBotMessageId
            ? {
              ...msg,
              id: dbBotMessageId,
              content: assistantReply,
              timestamp: botResponseTimestamp,
              isLoading: false, // Remove loading state when response is received
            }
            : msg
        )
      );
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: (chat.messages || []).map((msg) =>
                msg.id === tempBotMessageId
                  ? {
                    ...msg,
                    id: dbBotMessageId,
                    content: assistantReply,
                    timestamp: botResponseTimestamp,
                    isLoading: false, // Remove loading state when response is received
                  }
                  : msg
              ),
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        })
      );

      if (userPreferences.ttsEnabled && assistantReply)
        speakText(assistantReply);
      // playSound("receive"); // Sound was already played with send
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorContent = `Error: ${error.message || "Could not get a response."
        }`;
      // Update placeholder with error message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempBotMessageId ? { ...msg, content: errorContent, isLoading: false } : msg
        )
      );
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChat) {
            return {
              ...chat,
              messages: (chat.messages || []).map((msg) =>
                msg.id === tempBotMessageId
                  ? { ...msg, content: errorContent, isLoading: false }
                  : msg
              ),
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        })
      );
      // Restore input if API call failed
      setInput(currentInput);
      setAttachments(currentAttachments);
      setAttachmentPreviews(currentAttachmentPreviews);
      setReplyingToMessage(currentReplyingToMessage);
      playSound("error");
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  // Toggle microphone for voice input
  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      // useEffect[listening] will handle stopAudioProcessing() and setShowMic(false)
    } else {
      setInput("");
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      // useEffect[listening] will handle startAudioProcessing() and setShowMic(true)
    }
    playSound("selectChat"); // Sound for mic toggle
  };

  // Toggle emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setInput((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for separators
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
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
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file upload
  // Removed handleFileUpload function and handleRemoveAttachment function

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (chatInputRef.current) {
      chatInputRef.current.classList.add(
        darkMode ? "bg-gray-700" : "bg-gray-200",
        "border-indigo-500",
        "border-2",
        "border-dashed"
      );
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (chatInputRef.current) {
      chatInputRef.current.classList.remove(
        darkMode ? "bg-gray-700" : "bg-gray-200",
        "border-indigo-500",
        "border-2",
        "border-dashed"
      );
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (chatInputRef.current) {
      chatInputRef.current.classList.remove(
        darkMode ? "bg-gray-700" : "bg-gray-200",
        "border-indigo-500",
        "border-2",
        "border-dashed"
      );
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
      chatInputElement.addEventListener("dragover", handleDragOver);
      chatInputElement.addEventListener("dragleave", handleDragLeave);
      chatInputElement.addEventListener("drop", handleDrop);

      return () => {
        if (chatInputElement) {
          // Check again in cleanup as it might have been removed
          chatInputElement.removeEventListener("dragover", handleDragOver);
          chatInputElement.removeEventListener("dragleave", handleDragLeave);
          chatInputElement.removeEventListener("drop", handleDrop);
        }
      };
    }
  }, [darkMode, chatInputRef.current]); // Re-attach if darkmode or ref changes

  // Toggle dark mode with animation
  const toggleDarkMode = () => {
    if (userPreferences.animations) {
      document.documentElement.classList.add("transition-colors");
      document.documentElement.classList.add("duration-300");
    }
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setUserPreferences((prev) => ({ ...prev, darkMode: newDarkMode })); // Sync with userPreferences
  };

  return (
    <div className="animated-bg">
      <div
        className={`flex h-screen ${darkMode
            ? "dark text-gray-100"
            : "text-gray-900"
          }`}
      >
        {/* Mobile sidebar toggle */}
        <button
          className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-full ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
            } shadow-lg transition-transform hover:scale-110`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`w-full max-w-[85vw] sm:max-w-[320px] md:w-72 flex-shrink-0 h-full overflow-y-auto ${darkMode ? "glass-morphism-dark bg-black md:bg-transparent" : "glass-morphism bg-white md:bg-transparent"
                } fixed md:relative z-40 shadow-xl md:shadow-none`}
            >
              {/* Restructured sidebar with fixed header and footer, scrollable chat history */}
              <div className="flex flex-col h-full">
                {/* Fixed top section */}
                <div className="p-4">
                  <button
                    onClick={handleNewChat}
                    className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md mb-4 text-sm font-semibold glow border border-gray-500 ${darkMode
                        ? "glass-morphism-dark text-white"
                        : "glass-morphism text-black"
                      } transition-all duration-300 hover:scale-105`}
                  >
                    <FiPlus size={18} />
                    <span>New Chat</span>
                  </button>

                  {/* Search input */}
                  <div className="relative mb-4 border border-gray-500">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-md text-sm ${darkMode
                          ? "glass-morphism-dark text-gray-200 placeholder-gray-400"
                          : "glass-morphism text-gray-800 placeholder-gray-500"
                        } outline-none transition-all duration-300 focus:scale-[1.02]`}
                    />
                  </div>
                </div>
               
                {/* Scrollable Chat History Section */}
                <div className="px-4 flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600" style={{ scrollbarWidth: 'auto', scrollbarGutter: 'stable' }}>
                  <div className="flex items-center justify-between px-1 mb-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Chat History
                    </h2>
                    <button
                      onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded-md">
                      {isHistoryExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </button>
                  </div>
                  {isHistoryExpanded && (
                    <div className="space-y-1">
                      {filteredChats.map((chat) => (
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
                          isNewUI={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
               
                {/* Fixed Footer Navigation */}
                <div className={`mt-auto p-3 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <nav className="space-y-1 mb-3">
                    {[{ name: "Dashboard", icon: FiGrid, href: "/" }, { name: "Profile", icon: FiUser, href: "/profile" }].map(item => (
                      <Link
                        key={item.name}
                        to={item.href} // Changed href to to for Link component
                        className={`flex items-center space-x-3 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                        <item.icon size={18} className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    <button
                      onClick={toggleDarkMode}
                      className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                      {darkMode ? <FiSun size={18} className="text-yellow-400" /> : <FiMoon size={18} className="text-indigo-500" />}
                      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                  </nav>
                  <div className={`px-1.5 py-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Logged in as <span className="font-semibold">{userPreferences.username || userPreferences.email || "Guest"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3.5 flex items-center justify-between ${darkMode ? "glass-morphism-dark" : "glass-morphism"} shadow-lg z-10`}
          >
            <div className="flex items-center">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${darkMode 
                  ? "text-gray-300 hover:bg-gray-700 hover:text-indigo-300" 
                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                }`}
              >
                <FiMenu size={22} />
              </motion.button>
              <motion.h3 
                className="ml-3 text-lg font-bold flex items-center"
                whileHover={{ scale: 1.03 }}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
                  className={`mr-2 p-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}
                >
                  <RiRobot2Line className="text-indigo-500" size={22} />
                </motion.div>
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode 
                  ? "from-indigo-400 to-purple-400" 
                  : "from-indigo-600 to-purple-600"}`}>
                  MindCare
                </span>
              </motion.h3>
            </div>
            <div className="flex items-center space-x-3">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className={`text-sm font-medium px-3 py-1 rounded-full hidden md:inline ${darkMode 
                  ? "bg-gray-700 text-gray-200" 
                  : "bg-gray-100 text-gray-700"}`}
              >
                {userPreferences.username || "Bertha Roy"}
              </motion.span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear the entire chat history?")) {
                    handleClearCurrentChat();
                  }
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border shadow-sm transition-all duration-200 ${darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-500"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-400"
                }`}
              >
                <span className="flex items-center">
                  <FiTrash2 className="mr-1" size={14} />
                  <span className="hidden md:inline">Clear Chat History</span>
                </span>
              </motion.button>
            </div>
          </motion.header>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto px-2 sm:px-4 ${darkMode ? "bg-gray-900/30" : "bg-gray-50/30"} backdrop-blur-sm`}
          >
            {messages.length === 0 ? (
              <WelcomePage darkMode={darkMode} setInput={setInput} />
            ) : initialLoading ? (
              // Skeleton loading for chat history
              <div className="space-y-4 px-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"} mb-4`}>
                    <div 
                      className={`animate-pulse rounded-xl p-2 sm:p-3 shadow-md ${index % 2 === 0 
                        ? "bg-indigo-600/30 backdrop-blur-sm" 
                        : "bg-gray-800/30 backdrop-blur-sm border border-gray-700/30"}`}
                      style={{width: `${Math.floor(Math.random() * 30) + 50}%`}}
                    >
                      <div className="h-4 bg-gray-400/30 rounded-full w-3/4 mb-2.5"></div>
                      <div className="h-3 bg-gray-400/30 rounded-full mb-2.5"></div>
                      <div className="h-3 bg-gray-400/30 rounded-full w-5/6 mb-2.5"></div>
                      <div className="h-3 bg-gray-400/30 rounded-full w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                  <div key={date} className="mb-6">
                    <div
                      className={`text-center mb-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      {formatDate(dateMessages[0].timestamp)}
                    </div>
                    {dateMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                          } mb-4`}
                      >
                        <div
                          className={`max-w-full sm:max-w-3xl rounded-xl p-2 sm:p-3 text-sm relative group ${message.role === "user"
                              ? darkMode
                                ? "bg-gray-800 text-white glow hover:scale-[1.02] transition-all duration-300"
                                : "bg-gray-800 text-white glow hover:scale-[1.02] transition-all duration-300"
                              : darkMode
                                ? "glass-morphism-dark text-gray-200 neomorphic hover:scale-[1.02] transition-all duration-300"
                                : "glass-morphism text-gray-800 neomorphic hover:scale-[1.02] transition-all duration-300"
                            }`}
                        >
                          <div className={`absolute top-0 left-0 transform -translate-y-full -mb-1 px-2 py-0.5 text-xs font-medium rounded-t-md ${message.role === "user" ? "bg-indigo-700/80 text-white" : darkMode ? "bg-gray-700/80 text-indigo-300" : "bg-gray-200/80 text-indigo-700"}`}>
                            {message.role === "user" ? "You" : "MindCare"}
                          </div>
                          <div className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 transition-opacity items-center z-10">
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
                              onSpeak={() => speakText(message.content)} // Added TTS functionality
                            />
                          </div>

                          {message.replyTo &&
                            messages.find((m) => m.id === message.replyTo) && (
                              <div
                                className={`mb-1.5 px-2 py-1 text-xs rounded-md ${darkMode
                                    ? "bg-black bg-opacity-20"
                                    : "bg-gray-100"
                                  } border-l-2 ${darkMode
                                    ? "border-gray-500"
                                    : "border-gray-300"
                                  }`}
                              >
                                <p
                                  className={`font-medium text-xs ${darkMode ? "text-gray-400" : "text-gray-600"
                                    }`}
                                >
                                  Replying to{" "}
                                  {messages.find(
                                    (m) => m.id === message.replyTo
                                  )?.role === "user"
                                    ? "User"
                                    : "AI"}
                                  :
                                </p>
                                <em className="opacity-80 line-clamp-2 text-xs">
                                  "
                                  {
                                    messages.find(
                                      (m) => m.id === message.replyTo
                                    )?.content
                                  }
                                  "
                                </em>
                              </div>
                            )}
                          {/* Conditional rendering for editing or displaying message content */}
                          {editingMessage &&
                            editingMessage.id === message.id ? (
                            <div className="mt-2 w-full">
                              <textarea
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSaveEditMessage(message.id);
                                  }
                                }}
                                className={`w-full p-2 border rounded text-sm ${darkMode
                                    ? "bg-gray-600 border-gray-500 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                  } focus:ring-indigo-500 focus:border-indigo-500`}
                                rows="3"
                                autoFocus
                              />
                              <div className="mt-2 flex justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingMessage(null);
                                    setEditedContent("");
                                  }}
                                  className={`px-3 py-1 rounded text-xs ${darkMode
                                      ? "bg-gray-500 hover:bg-gray-400"
                                      : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() =>
                                    handleSaveEditMessage(message.id)
                                  }
                                  className={`px-3 py-1 rounded text-xs ${darkMode
                                      ? "bg-indigo-500 hover:bg-indigo-400 text-white"
                                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    }`}
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : message.isLoading ? (
                            <div className="typing-animation glass-effect" 
                              style={{ 
                                background: darkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                                backdropFilter: 'blur(8px)',
                                border: darkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                              }}>
                              <span style={{ backgroundColor: '#6366f1' }}></span>
                              <span style={{ backgroundColor: '#818cf8' }}></span>
                              <span style={{ backgroundColor: '#a5b4fc' }}></span>
                            </div>
                          ) : (
                            <div className="prose prose-sm max-w-none break-words text-sm sm:text-base font-light">
                              {" "}
                              {/* Enhanced markdown rendering with better styling */}
                              <Markdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  code({
                                    node,
                                    inline,
                                    className,
                                    children,
                                    ...props
                                  }) {
                                    const match = /language-(\w+)/.exec(
                                      className || ""
                                    );
                                    return !inline && match ? (
                                      <div className="relative group overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 my-4">
                                        <div
                                            className={`absolute top-0 left-0 right-0 px-4 py-2 text-xs font-medium flex justify-between items-center ${darkMode
                                              ? "bg-gray-800 text-gray-200 border-b border-gray-700"
                                              : "bg-gray-100 text-gray-700 border-b border-gray-200"
                                            }`}
                                        >
                                          <span className="flex items-center">
                                            <span className="mr-2">{match[1]}</span>
                                            {match[1] === "javascript" && <span className="text-yellow-500">●</span>}
                                            {match[1] === "python" && <span className="text-blue-500">●</span>}
                                            {match[1] === "jsx" && <span className="text-cyan-500">●</span>}
                                            {match[1] === "css" && <span className="text-pink-500">●</span>}
                                            {match[1] === "html" && <span className="text-orange-500">●</span>}
                                          </span>
                                          <button
                                            onClick={() =>
                                              handleCopyMessage(
                                                String(children).replace(
                                                  /\n$/,
                                                  ""
                                                )
                                              )
                                            }
                                            className={`opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 rounded ${darkMode
                                                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                              }`}
                                          >
                                            <span className="flex items-center">
                                              <FiCopy className="mr-1" size={12} />
                                              Copy
                                            </span>
                                          </button>
                                        </div>
                                        <div className="pt-10 pb-2 px-1">
                                          <SyntaxHighlighter
                                            language={match[1]}
                                            style={
                                              darkMode
                                                ? darkCodeTheme
                                                : lightCodeTheme
                                            }
                                            customStyle={{
                                              margin: 0,
                                              padding: '0.75rem',
                                              background: darkMode ? '#1e1e1e' : '#f8f8f8',
                                              borderRadius: '0',
                                              fontSize: '0.875rem',
                                              lineHeight: '1.5',
                                            }}
                                            showLineNumbers={true}
                                            wrapLines={true}
                                            PreTag="div"
                                            {...props}
                                          >
                                            {String(children).replace(/\n$/, "")}
                                          </SyntaxHighlighter>
                                        </div>
                                      </div>
                                    ) : (
                                      <code
                                        className={`${className} ${darkMode
                                            ? "bg-gray-700 text-gray-100"
                                            : "bg-gray-100 text-gray-800"
                                          } px-1.5 py-0.5 rounded font-mono text-sm`}
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  },
                                  p({ children }) {
                                    return (
                                      <p className={`mb-4 leading-relaxed font-poppins ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem' }}>
                                        {children}
                                      </p>
                                    );
                                  },
                                  h1({ children }) {
                                    return (
                                      <h1 className={`text-xl sm:text-2xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 font-poppins ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {children}
                                      </h1>
                                    );
                                  },
                                  h2({ children }) {
                                    return (
                                      <h2 className={`text-lg sm:text-xl font-semibold mb-3 mt-6 font-poppins ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {children}
                                      </h2>
                                    );
                                  },
                                  h3({ children }) {
                                    return (
                                      <h3 className={`text-md sm:text-lg font-medium mb-3 mt-5 font-poppins ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {children}
                                      </h3>
                                    );
                                  },
                                  ul({ children }) {
                                    return (
                                      <ul className={`list-disc pl-5 mb-4 space-y-2 font-poppins ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {children}
                                      </ul>
                                    );
                                  },
                                  ol({ children }) {
                                    return (
                                      <ol className={`list-decimal pl-5 mb-4 space-y-2 font-poppins ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {children}
                                      </ol>
                                    );
                                  },
                                  li({ children }) {
                                    return (
                                      <li className={`mb-1 font-poppins ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem' }}>
                                        {children}
                                      </li>
                                    );
                                  },
                                  blockquote({ children }) {
                                    return (
                                      <blockquote className={`border-l-4 ${darkMode ? 'border-indigo-400 bg-gray-800 text-gray-200' : 'border-indigo-500 bg-gray-50 text-gray-800'} pl-4 py-2 mb-4 italic rounded-r font-poppins`} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem' }}>
                                        {children}
                                      </blockquote>
                                    );
                                  },
                                  a({ children, href }) {
                                    return (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} hover:underline font-poppins`}
                                        style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem' }}
                                      >
                                        {children}
                                      </a>
                                    );
                                  },
                                  table({ children }) {
                                    return (
                                      <div className="overflow-x-auto mb-4">
                                        <table className={`min-w-full border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg`}>
                                          {children}
                                        </table>
                                      </div>
                                    );
                                  },
                                  thead({ children }) {
                                    return (
                                      <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        {children}
                                      </thead>
                                    );
                                  },
                                  tbody({ children }) {
                                    return (
                                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {children}
                                      </tbody>
                                    );
                                  },
                                  tr({ children }) {
                                    return (
                                      <tr>
                                        {children}
                                      </tr>
                                    );
                                  },
                                  th({ children }) {
                                    return (
                                      <th className={`px-4 py-2 text-left text-sm font-medium font-poppins ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {children}
                                      </th>
                                    );
                                  },
                                  td({ children }) {
                                    return (
                                      <td className="px-4 py-2 text-sm border-t dark:border-gray-700 font-poppins" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.05rem' }}>
                                        {children}
                                      </td>
                                    );
                                  },
                                  hr() {
                                    return (
                                      <hr className={`my-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                                    );
                                  },
                                  img({ src, alt }) {
                                    return (
                                      <img
                                        src={src}
                                        alt={alt || 'Image'}
                                        className="max-w-full h-auto rounded-lg my-4 shadow-sm"
                                      />
                                    );
                                  },
                                }}
                              >
                                {message.content}
                              </Markdown>
                            </div>
                          )}

                          {/* Attachments display section removed */}
                        </div>
                        {/* Reactions Display */}
                        {message.reactions &&
                          Object.keys(message.reactions).length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex flex-wrap gap-1.5 mt-2 pl-0"
                            >
                              {Object.entries(message.reactions).map(
                                ([emoji, count]) => (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    key={emoji}
                                    onClick={() =>
                                      addReactionToMessage(message.id, emoji)
                                    }
                                    className={`px-2 py-1 text-sm rounded-full transition-all duration-200 shadow-sm ${darkMode
                                        ? "bg-gray-700 hover:bg-indigo-600 hover:bg-opacity-40"
                                        : "bg-gray-100 hover:bg-indigo-100"
                                      } ${darkMode
                                        ? "text-gray-200"
                                        : "text-gray-800"
                                      } flex items-center space-x-1`}
                                  >
                                    <span className="text-base">{emoji}</span>
                                    {count > 1 && (
                                      <span className={`text-xs font-medium ml-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        {count}
                                      </span>
                                    )}
                                  </motion.button>
                                )
                              )}
                            </motion.div>
                          )}
                        <div
                          className={`text-xs mt-2 flex justify-between ${message.role === "user"
                              ? "text-indigo-200"
                              : darkMode
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                        >
                          {/* Robot icon removed as requested */}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}

                {/* Removed duplicate loading animation */}
                <div ref={messagesEndRef} />
                {/* Reaction Picker */}
                {reactingToMessageId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.2 }}
                    ref={reactionPickerRef}
                    className={`absolute z-30 p-3 rounded-xl shadow-2xl flex space-x-2 ${darkMode
                        ? "bg-gray-800 border border-gray-600"
                        : "bg-white border border-gray-200"
                      }`}
                    style={{ 
                      bottom: "80px", 
                      right: "20px",
                      backdropFilter: "blur(8px)",
                      boxShadow: darkMode ? "0 10px 25px -5px rgba(0, 0, 0, 0.5)" : "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <div className="flex space-x-2 items-center">
                      {["👍", "❤️", "😂", "😮", "😢", "🙏", "🎉"].map((emoji) => (
                        <motion.button
                          key={emoji}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            addReactionToMessage(reactingToMessageId, emoji);
                            setReactingToMessageId(null);
                          }}
                          className={`p-2 rounded-full text-2xl transition-all duration-200 ${darkMode 
                            ? "hover:bg-indigo-600 hover:bg-opacity-30" 
                            : "hover:bg-indigo-100"
                            } transform hover:-translate-y-1`}
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setReactingToMessageId(null)}
                      className={`p-2 ml-1 rounded-full flex items-center justify-center ${darkMode 
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        } transition-all duration-200`}
                    >
                      <FiX size={18} />
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Input area */}
          <div
            className={`p-2 sm:p-4 ${darkMode
                ? "glass-morphism-dark"
                : "glass-morphism"
              } border-t border-opacity-20 backdrop-blur-lg shadow-lg`}
          >
            {/* Removed attachments display section */}

            {showMic && browserSupportsSpeechRecognition && (
              <div
                className={`mb-4 p-3 rounded-lg flex flex-col items-center ${listening
                    ? darkMode
                      ? "bg-red-900 bg-opacity-30"
                      : "bg-red-100"
                    : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-100"
                  }`}
              >
                <div
                  className={`w-full flex items-center justify-between mb-2 ${listening
                      ? darkMode
                        ? "text-red-300"
                        : "text-red-800"
                      : darkMode
                        ? "text-gray-300"
                        : "text-gray-800"
                    }`}
                >
                  <span className="flex-1">
                    {listening
                      ? "Listening... Speak now"
                      : "Click the mic and start speaking"}
                  </span>
                  <button
                    onClick={toggleMic}
                    className={`p-2 rounded-full ${listening
                        ? darkMode
                          ? "bg-red-600 text-white"
                          : "bg-red-500 text-white"
                        : darkMode
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {listening ? (
                      <IoMdMicOff size={20} />
                    ) : (
                      <IoMdMic size={20} />
                    )}
                  </button>
                </div>
                {listening && (
                  <VoiceVisualizer
                    listening={listening}
                    audioLevel={audioLevel}
                    darkMode={darkMode}
                  />
                )}
              </div>
            )}

            {replyingToMessage && (
              <div
                className={`mb-2 p-2 rounded-lg text-sm flex justify-between items-center shadow ${darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                  }`}
              >
                <div className="flex-grow overflow-hidden">
                  <span className="text-xs opacity-80">Replying to:</span>{" "}
                  <strong className="truncate max-w-full inline-block align-bottom text-xs">
                    "{replyingToMessage.content.substring(0, 70)}..."
                  </strong>
                </div>
                <button
                  onClick={() => setReplyingToMessage(null)}
                  className={`ml-2 p-1 rounded-full ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-300"
                    }`}
                >
                  <FiX size={16} />
                </button>
              </div>
            )}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center justify-center space-x-2" // Changed items-end to items-center
            >
              {/* Outer div for width control */}
              {/* Changed width classes and removed flex-grow for centering */}
              <div className="w-full sm:w-3/4 md:w-3/5 lg:w-1/2">
                <div className={`relative ${isBotSpeaking ? "mb-5" : ""}`}> {/* Removed flex-1, width is controlled by parent */}
                  {isBotSpeaking && (
                  <div className="absolute bottom-full left-0 right-0 mx-auto mb-1 text-center text-xs text-gray-500 dark:text-gray-400 animate-pulse p-1 bg-opacity-50 rounded-md">
                    AI is speaking...
                  </div>
                )}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  rows="1"
                  className={`w-full py-3.5 px-4 pr-12 rounded-xl border  ${darkMode
                      ? "glass-morphism-dark text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                      : "glass-morphism text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                    } resize-none focus:outline-none transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base leading-relaxed scrollbar-thin ${darkMode ? 'scrollbar-thumb-gray-500 scrollbar-track-transparent' : 'scrollbar-thumb-gray-300 scrollbar-track-transparent'}`}
                  disabled={isLoading || isBotSpeaking}
                  style={{ minHeight: '52px', maxHeight: '140px' }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <div className="absolute right-2 bottom-4 flex space-x-1 sm:space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className={`p-1.5 rounded-full transition-all duration-300 hover:scale-110 ${darkMode
                        ? "text-gray-300 hover:text-indigo-400"
                        : "text-gray-600 hover:text-indigo-600"
                      }`}
                  >
                    <BsEmojiSmile size={20} />
                  </button>

                  {browserSupportsSpeechRecognition && (
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`p-1.5 rounded-full ${listening
                          ? darkMode
                            ? "text-red-400 hover:text-red-300"
                            : "text-red-600 hover:text-red-700"
                          : darkMode
                            ? "text-gray-400 hover:text-gray-300"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      title={listening ? "Stop listening" : "Start listening"}
                    >
                      {listening ? (
                        <IoMdMicOff size={20} />
                      ) : (
                        <IoMdMic size={20} />
                      )}
                    </button>
                  )}
                </div>

                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute right-0 bottom-12 z-50 max-w-[90vw] sm:max-w-full"
                  >
                    <Picker
                      onEmojiClick={onEmojiClick}
                      autoFocusSearch={false}
                      theme={darkMode ? "dark" : "light"}
                      emojiStyle={EmojiStyle.NATIVE}
                      lazyLoadEmojis={true}
                      previewConfig={{ showPreview: false }}
                      width="100%"
                      height="350px"
                    />
                  </div>
                )}
              </div>
              </div> {/* Closing tag for the flex-grow w-4/5 max-w-[80%] div */}
              {isBotSpeaking ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopSpeaking}
                  className={`p-3 rounded-full shadow-md ${darkMode
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  title="Stop speaking"
                >
                  <FiX size={20} />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleSendMessage(e)}
                  className={`p-3 rounded-full shadow-md ${!input.trim() || isLoading
                      ? darkMode
                        ? "bg-gray-700 text-gray-400"
                        : "bg-gray-200 text-gray-400"
                      : darkMode
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                    }`}
                >
                  <FiSend size={20} />
                </motion.button>
              )}
            </form>

            <div
              className={`text-xs mt-3 text-center font-light ${darkMode ? "text-gray-500" : "text-gray-400"
                }`}
            >
              <span className="inline-flex items-center">
                <RiRobot2Line className="mr-1.5" size={12} />
                AI Assistant may produce inaccurate information. Consider verifying important details.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Panel Component
const SettingsPanel = ({
  darkMode,
  userPreferences,
  setUserPreferences,
  modelSettings,
  setModelSettings,
  onClose,
  toggleMainDarkMode, // Added prop
}) => {
  const [activeTab, setActiveTab] = useState("preferences");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${darkMode ? "bg-gray-900 bg-opacity-80" : "bg-gray-500 bg-opacity-50"
        }`}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className={`relative rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`p-5 border-b flex items-center justify-between ${darkMode ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <h2 className="text-xl font-semibold flex items-center font-serif">
            <FiSettings className="mr-2" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 py-3 font-medium ${activeTab === "preferences"
                ? darkMode
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-indigo-600 border-b-2 border-indigo-600"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            onClick={() => setActiveTab("preferences")}
          >
            Preferences
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === "model"
                ? darkMode
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-indigo-600 border-b-2 border-indigo-600"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            onClick={() => setActiveTab("model")}
          >
            Model Settings
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === "account"
                ? darkMode
                  ? "text-indigo-400 border-b-2 border-indigo-400"
                  : "text-indigo-600 border-b-2 border-indigo-600"
                : darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "preferences" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-5 font-serif">
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
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
                      <div
                        className={`w-11 h-6 rounded-full peer ${darkMode ? "bg-indigo-600" : "bg-gray-200"
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Animations</p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        Enable/disable UI animations
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userPreferences.animations}
                        onChange={() =>
                          setUserPreferences({
                            ...userPreferences,
                            animations: !userPreferences.animations,
                          })
                        }
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer ${userPreferences.animations
                            ? "bg-indigo-600"
                            : "bg-gray-200"
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors duration-300 ease-in-out`}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sound Effects</p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        Enable/disable interface sounds
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userPreferences.soundEffects}
                        onChange={() =>
                          setUserPreferences({
                            ...userPreferences,
                            soundEffects: !userPreferences.soundEffects,
                          })
                        }
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer ${userPreferences.soundEffects
                            ? "bg-indigo-600"
                            : "bg-gray-200"
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors duration-300 ease-in-out`}
                      ></div>
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
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        Render markdown in messages
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userPreferences.markdown}
                        onChange={() =>
                          setUserPreferences({
                            ...userPreferences,
                            markdown: !userPreferences.markdown,
                          })
                        }
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer ${userPreferences.markdown
                            ? "bg-indigo-600"
                            : "bg-gray-200"
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors duration-300 ease-in-out`}
                      ></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Code Syntax Highlighting</p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        Enable syntax highlighting for code blocks
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userPreferences.syntaxHighlighting}
                        onChange={() =>
                          setUserPreferences({
                            ...userPreferences,
                            syntaxHighlighting:
                              !userPreferences.syntaxHighlighting,
                          })
                        }
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer ${userPreferences.syntaxHighlighting
                            ? "bg-indigo-600"
                            : "bg-gray-200 dark:bg-gray-600"
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors duration-300 ease-in-out`}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* TTS Settings UI */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">
                  Text-to-Speech (TTS)
                </h3>
                <div className="space-y-4">
                  {/* TTS Enabled Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable TTS</p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                      >
                        Have AI responses read aloud.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={userPreferences.ttsEnabled}
                        onChange={() =>
                          setUserPreferences(prev => ({
                            ...prev,
                            ttsEnabled: !prev.ttsEnabled,
                          }))
                        }
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer ${userPreferences.ttsEnabled
                            ? "bg-indigo-600"
                            : "bg-gray-200 dark:bg-gray-600"
                          } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors duration-300 ease-in-out`}
                      ></div>
                    </label>
                  </div>

                  {userPreferences.ttsEnabled && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-4 pt-4"
                      >
                        {availableVoices.length > 0 ? (
                          <>
                            {/* TTS Voice Select */}
                            <div>
                              <label
                                htmlFor="ttsVoice"
                                className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                              >
                                Voice
                              </label>
                              <select
                                id="ttsVoice"
                                name="ttsVoice"
                                value={userPreferences.ttsVoice || ""}
                                onChange={(e) =>
                                  setUserPreferences(prev => ({
                                    ...prev,
                                    ttsVoice: e.target.value,
                                  }))
                                }
                                className={`w-full p-2 rounded-lg ${darkMode
                                    ? "bg-gray-700 text-white"
                                    : "bg-gray-100 text-gray-900"
                                  } border ${darkMode
                                    ? "border-gray-600"
                                    : "border-gray-300"
                                  } focus:ring-indigo-500 focus:border-indigo-500`}
                              >
                                <option value="" disabled>
                                  Select a voice
                                </option>
                                {availableVoices.map((voice) => (
                                  <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* TTS Speed Slider */}
                            <div>
                              <label
                                htmlFor="ttsSpeed"
                                className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                              >
                                Speed: {userPreferences.ttsSpeed.toFixed(1)}x
                              </label>
                              <input
                                type="range"
                                id="ttsSpeed"
                                name="ttsSpeed"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={userPreferences.ttsSpeed}
                                onChange={(e) =>
                                  setUserPreferences(prev => ({
                                    ...prev,
                                    ttsSpeed: parseFloat(e.target.value),
                                  }))
                                }
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500 bg-gray-200 dark:bg-gray-600 transition-all duration-300 ease-in-out hover:h-3 focus:h-3 active:h-3"
                              />
                            </div>
                          </>
                        ) : (
                          <p
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                          >
                            Loading voices or no voices available in your
                            browser...
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "model" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">AI Model</h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Model Version
                    </label>
                    <select
                      value={modelSettings.model}
                      onChange={(e) =>
                        setModelSettings({
                          ...modelSettings,
                          model: e.target.value,
                        })
                      }
                      className={`w-full p-2 rounded-lg ${darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        } border ${darkMode ? "border-gray-600" : "border-gray-300"
                        }`}
                    >
                      <option value="gpt-4">GPT-4 (Most Capable)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo (Faster)</option>
                      <option value="gpt-3.5-turbo">
                        GPT-3.5 Turbo (Balanced)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Temperature: {modelSettings.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={modelSettings.temperature}
                      onChange={(e) =>
                        setModelSettings({
                          ...modelSettings,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-indigo-500 transition-all duration-300 ease-in-out hover:h-3 focus:h-3 active:h-3"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Precise</span>
                      <span>Balanced</span>
                      <span>Creative</span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      Controls randomness: Lower values for more focused
                      responses, higher values for more creativity.
                    </p>
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Max Tokens: {modelSettings.maxTokens}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="100"
                      value={modelSettings.maxTokens}
                      onChange={(e) =>
                        setModelSettings({
                          ...modelSettings,
                          maxTokens: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-indigo-500 transition-all duration-300 ease-in-out hover:h-3 focus:h-3 active:h-3"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>Short</span>
                      <span>Medium</span>
                      <span>Long</span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      Maximum length of responses. Higher values may take longer
                      to generate.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">
                  System Instructions
                </h3>
                <textarea
                  placeholder="You are a helpful AI assistant..."
                  className={`w-full p-3 rounded-lg ${darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                    } border ${darkMode ? "border-gray-600" : "border-gray-300"
                    } min-h-[100px]`}
                />
                <p
                  className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Custom instructions to guide the AI's behavior and responses.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-200"
                    } text-2xl font-bold`}
                >
                  {userPreferences.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {userPreferences.username || "User"}
                  </h3>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                  >
                    {userPreferences.email || "user@example.com"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="Username"
                      className={`w-full p-2 rounded-lg ${darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        } border ${darkMode ? "border-gray-600" : "border-gray-300"
                        }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Email"
                      className={`w-full p-2 rounded-lg ${darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        } border ${darkMode ? "border-gray-600" : "border-gray-300"
                        }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block mb-2 font-medium ${darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="New Password"
                      className={`w-full p-2 rounded-lg mb-2 ${darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        } border ${darkMode ? "border-gray-600" : "border-gray-300"
                        }`}
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className={`w-full p-2 rounded-lg ${darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        } border ${darkMode ? "border-gray-600" : "border-gray-300"
                        }`}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button
                  className={`w-full py-2 rounded-lg font-medium ${darkMode
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                    } text-white transition-colors`}
                >
                  Delete Account
                </button>
                <p
                  className={`text-xs mt-2 text-center ${darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  This action cannot be undone. All your data will be
                  permanently deleted.
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          className={`p-4 border-t flex justify-end ${darkMode ? "border-gray-700" : "border-gray-200"
            }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium ${darkMode
                ? "bg-indigo-600 hover:bg-indigo-500"
                : "bg-indigo-500 hover:bg-indigo-600"
              } text-white transition-colors`}
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Removed FileUpload Component

// Removed EmojiPicker Component - now imported from ./components/EmojiPicker