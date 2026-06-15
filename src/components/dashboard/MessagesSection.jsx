import React, { useState, useEffect, useRef, useCallback } from "react";
import { chatApi } from "../services/chatApi";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://backend-q0wc.onrender.com";

export default function MessagesSection() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [recentChatsLoading, setRecentChatsLoading] = useState(true);
  const [showDeleteOption, setShowDeleteOption] = useState(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [messageLimitReached, setMessageLimitReached] = useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

  // Scroll position maintain 
const messagesContainerRef = useRef(null);
const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
const [userScrolled, setUserScrolled] = useState(false);

  //  PROFILE PICTURES STATES
  const [userProfilePictures, setUserProfilePictures] = useState({});
  const [profilePicturesLoaded, setProfilePicturesLoaded] = useState(false);

  // for open img
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // plant states
  const [planStatus, setPlanStatus] = useState({
    loading: true,
    active: false,
    daysLeft: 0,
  });

  const socketRef = useRef(null);
  const fileInputRef = useRef();
  const messagesEndRef = useRef();
  const [socketConnected, setSocketConnected] = useState(false);
  const location = useLocation();

  // User ne manually scroll kiya to auto-scroll band karo - YEH NAYA FUNCTION
const handleScroll = () => {
  if (messagesContainerRef.current) {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    if (!isAtBottom && !userScrolled) {
      setUserScrolled(true);
      setShouldAutoScroll(false);
    } else if (isAtBottom) {
      setUserScrolled(false);
      setShouldAutoScroll(true);
    }
  }
};

  // Close emoji picker when clicking outside - NEW
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiButtonRef.current?.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle emoji click - NEW
  const onEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    // Keep picker open for multiple emojis (like WhatsApp)
    // Agar band karna ho to ye line add karo:
    // setShowEmojiPicker(false);
  };

  useEffect(() => {
    console.log("🔑 Token check:");
    console.log("Access Token:", localStorage.getItem("accessToken"));
    console.log("Token length:", localStorage.getItem("accessToken")?.length);

    const token = localStorage.getItem("accessToken");
    if (token) {
      console.log("Token starts with:", token.substring(0, 20) + "...");
    }
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  //  IMPROVED PROFILE PICTURES FETCH
  useEffect(() => {
    const fetchAllProfilePictures = async () => {
      if (!currentUserId || profilePicturesLoaded) return;

      try {
        console.log("🔄 Fetching all profile pictures...");
        const response = await chatApi.searchUsers("");

        if (response.data && Array.isArray(response.data)) {
          const pictures = {};

          response.data.forEach((user) => {
            if (user.id && user.id !== currentUserId) {
              //  Check all possible image fields with priority
              pictures[user.id] =
                user.profile_picture_url ||
                user.profile_picture ||
                user.image_url ||
                user.profile_image ||
                user.avatar_url ||
                user.avatar ||
                user.photo_url ||
                null;
            }
          });

          console.log(
            `${Object.keys(pictures).length} profile pictures loaded`,
          );
          setUserProfilePictures(pictures);
          setProfilePicturesLoaded(true);

          // Cache in localStorage for 1 day
          localStorage.setItem(
            "chat_profile_pictures",
            JSON.stringify({
              data: pictures,
              timestamp: Date.now(),
            }),
          );
        }
      } catch (error) {
        console.error("❌ Error fetching profile pictures:", error);
      }
    };

    // Check cache first
    const cached = localStorage.getItem("chat_profile_pictures");
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Cache valid for 1 day
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setUserProfilePictures(data);
          setProfilePicturesLoaded(true);
          console.log("Using cached profile pictures");
          return;
        }
      } catch (e) {
        console.log("Cache invalid, fetching fresh...");
      }
    }

    fetchAllProfilePictures();
  }, [currentUserId, profilePicturesLoaded]);

  // CORRECT
  useEffect(() => {
    if (location.state?.selectedUser) {
      console.log(
        "📍 User received from location state:",
        location.state.selectedUser,
      );
      const userFromState = location.state.selectedUser;
      setSelectedUser(userFromState);

      // Auto-select and load messages for this user
      if (userFromState.id && currentUserId) {
        console.log("🔄 Auto-loading messages for user:", userFromState.name);
        // Hide sidebar on mobile for better UX
        if (window.innerWidth < 768) {
          setShowSidebar(false);
        }
        // Load messages for this user
        loadMessages(userFromState.id);
        loadReactions(userFromState.id);
      }
    }
  }, [location.state, currentUserId]);

  // Jab naya user select ho to scroll top se start karo - YEH NAYA EFFECT
useEffect(() => {
  if (selectedUser) {
    setShouldAutoScroll(true);
    setUserScrolled(false);
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }
}, [selectedUser]);

  // Fetch recent chats
  const fetchRecentChats = async () => {
    try {
      setRecentChatsLoading(true);
      const response = await chatApi.getRecentChats(currentUserId);
      setRecentChats(response.data);

      // AUTO-SELECT FIRST RECENT CHAT IF NO USER IS SELECTED
      if (response.data && response.data.length > 0 && !selectedUser) {
        const firstChat = response.data[0];
        const user = {
          id: firstChat.user_id,
          name: firstChat.name,
          email: firstChat.email,
          profile_picture_url: firstChat.profile_picture_url,
        };
        // Small delay to ensure state is set
        setTimeout(() => {
          handleUserSelect(user);
        }, 100);
      }
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    } finally {
      setRecentChatsLoading(false);
    }
  };

  // Handle recent chat selection
  const handleRecentChatSelect = (chat) => {
    const user = {
      id: chat.user_id,
      name: chat.name,
      email: chat.email,
      profile_picture_url: chat.profile_picture_url,
    };
    handleUserSelect(user);
    setShowSidebar(false);
  };

  // Add this function
  const formatNameWithSpace = (name) => {
    if (!name) return "User";

    // Add space before capital letters (except first)
    const formatted = name.replace(/([a-z])([A-Z])/g, "$1 $2");

    return formatted || name;
  };

  // RECENT CHATS USE EFFECT
  useEffect(() => {
    if (currentUserId) {
      fetchRecentChats();
    }
  }, [currentUserId]);

  // Click outside to close reaction picker and delete option
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showReactionPicker &&
        !event.target.closest(".reaction-picker") &&
        !event.target.closest(".reaction-btn")
      ) {
        setShowReactionPicker(null);
      }
      if (
        showDeleteOption &&
        !event.target.closest(".delete-option") &&
        !event.target.closest(".more-options-btn")
      ) {
        setShowDeleteOption(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showReactionPicker, showDeleteOption]);

  // Get current user once
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const userId = userData.user_id || userData.id;
        if (userId) {
          setCurrentUser(userData);
          setCurrentUserId(userId);
          console.log(" User ID Set:", userId);
        }
      }
    } catch (err) {
      console.error("Error getting user:", err);
    }
  }, []);

  // PLAN STATUS FETCH USEEFFECT
  useEffect(() => {
    const fetchPlanStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE_URL}/api/me/plan-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setPlanStatus({
          loading: false,
          active: !!data?.active,
          daysLeft: data?.days_left || 0,
        });
      } catch {
        setPlanStatus({ loading: false, active: false, daysLeft: 0 });
      }
    };

    if (currentUserId) fetchPlanStatus();
  }, [currentUserId]);

  // Image Modal Effects
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showImageModal]);

  // SOCKET WITH REACTION HANDLING
  useEffect(() => {
    if (!currentUserId) return;

    console.log("🔌 Initializing socket for user:", currentUserId);

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(" Socket connected");
      setSocketConnected(true);
      socket.emit("join", { userId: currentUserId });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setSocketConnected(false);
    });

    // HANDLE NEW REACTIONS VIA SOCKET
    socket.on("new_reaction", (reactionData) => {
      console.log(" New reaction received via socket:", reactionData);
      if (reactionData && selectedUser) {
        setReactions((prev) => {
          const exists = prev.some(
            (r) =>
              r.id === reactionData.id ||
              (r.message_id === reactionData.message_id &&
                r.user_id === reactionData.user_id),
          );
          if (exists) {
            return prev.map((r) =>
              r.message_id === reactionData.message_id &&
              r.user_id === reactionData.user_id
                ? reactionData
                : r,
            );
          }
          return [...prev, reactionData];
        });
      }
    });

    // Handle incoming messages
    const handleIncomingMessage = (message) => {
      console.log("📩 Socket message received:", message);
      fetchRecentChats();

      if (!selectedUser) return;

      const isRelevant =
        (message.sender_id === currentUserId &&
          message.receiver_id === selectedUser.id) ||
        (message.sender_id === selectedUser.id &&
          message.receiver_id === currentUserId);

      if (isRelevant) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;

          const filtered = prev.filter(
            (m) =>
              !m.isTemporary ||
              (m.isTemporary && m.content !== message.content),
          );

          return [...filtered, message];
        });
      }
    };

    socket.on("new_message", handleIncomingMessage);

    return () => {
      socket.off("new_message", handleIncomingMessage);
      socket.off("new_reaction");
      socket.disconnect();
    };
  }, [currentUserId, selectedUser]);

  // // Auto-scroll
  // useEffect(() => {
  //   if (messagesEndRef.current && messages.length > 0) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  // Auto-scroll - YEH UPDATE KARO (purane ko replace karo)
useEffect(() => {
  if (messagesEndRef.current && shouldAutoScroll && messages.length > 0) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages, shouldAutoScroll]);

  // FUNCTION TO REMOVE NUMBERS FROM USERNAME
  const cleanUserName = (name) => {
    if (!name) return "User";
    // Remove numbers from the end of the username
    return name.replace(/\d+$/, "").trim() || name;
  };

  // Search users
  const searchUsers = useCallback(
    async (query) => {
      if (!query.trim() || !currentUserId) return;
      setLoading(true);
      try {
        const response = await chatApi.searchUsers(query);
        const filteredUsers = (response.data || [])
          .filter((user) => user.id !== currentUserId)
          .map((user) => ({
            ...user,
            name: cleanUserName(
              user.name || user.email?.split("@")[0] || "User",
            ),
          }));
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Search error:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUserId],
  );

  // LOAD MESSAGES
  const loadMessages = async (otherUserId) => {
    if (!currentUserId) return;
    try {
      console.log(
        `📨 Loading messages between ${currentUserId} and ${otherUserId}`,
      );
      setLoading(true);

      const response = await chatApi.getMessages(otherUserId, currentUserId);
      console.log("📝 Messages response:", response.data);

      let messagesData = response.data;
      if (Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (response.data && Array.isArray(response.data.messages)) {
        messagesData = response.data.messages;
      } else {
        messagesData = [];
      }

      const conversationMessages = messagesData
        .filter(
          (msg) =>
            (msg.sender_id === currentUserId &&
              msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId &&
              msg.receiver_id === currentUserId),
        )
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      console.log(` Loaded ${conversationMessages.length} messages`);
      setMessages(conversationMessages);
    } catch (err) {
      console.error("❌ Load messages error:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // LOAD REACTIONS PROPERLY
  const loadReactions = async (userId) => {
    if (!currentUserId || !userId) return;
    try {
      console.log(
        ` Loading reactions for users: ${currentUserId} and ${userId}`,
      );
      const res = await chatApi.getReactions(currentUserId, userId);
      console.log(" Reactions loaded from API:", res.data);

      let reactionsData = [];
      if (Array.isArray(res.data)) {
        reactionsData = res.data;
      } else if (res.data && Array.isArray(res.data.reactions)) {
        reactionsData = res.data.reactions;
      } else if (res.data && Array.isArray(res.data.data)) {
        reactionsData = res.data.data;
      }

      console.log("🎭 Final reactions data:", reactionsData);
      setReactions(reactionsData);
    } catch (e) {
      console.error("❌ Load reactions error:", e);
      setReactions([]);
    }
  };

  // SELECT USER - WITH MOBILE SUPPORT
  const handleUserSelect = async (user) => {
    if (!currentUserId) return;

    console.log("👤 Selecting user:", user.name);
    const selectedUserData = {
      id: user.id,
      name: cleanUserName(user.name || user.email?.split("@")[0] || "User"),
      email: user.email,
      profile_picture_url: user.profile_picture_url,
    };

    setSelectedUser(selectedUserData);

    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }

    await loadMessages(user.id);
    await loadReactions(user.id);
  };

  // DELETE MESSAGE FUNCTION
  const handleDeleteMessage = async (messageId) => {
    if (!messageId || !currentUserId) {
      console.error("❌ Cannot delete: missing message ID or user ID");
      return;
    }

    const confirmDelete = window.confirm("You want to Delete this messagee");
    if (!confirmDelete) {
      setShowDeleteOption(null);
      return;
    }

    console.log(`🗑️ Deleting message: ${messageId}`);
    setDeletingMessageId(messageId);

    try {
      const response = await chatApi.deleteMessage(messageId);
      console.log(" Message deleted successfully:", response);

      // Remove message from state
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      // Update recent chats
      if (selectedUser) {
        fetchRecentChats();
      }

      // Show success message
      alert("Message deleted successfully!");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("faild to some erro for Dlete this Meaasage");
    } finally {
      setDeletingMessageId(null);
      setShowDeleteOption(null);
    }
  };

  // SEND MESSAGE
  const handleSendMessage = async () => {
    // phale status check karega yha pr
    if (!planStatus.active) {
      alert("Your plan has expired. Please upgrade to continue chatting.");
      return;
    }

    // 🔒 MESSAGE LIMIT OVER — CLICK ALLOWED, BUT ALERT
    if (messageLimitReached) {
      alert("Your message limit is over. Please upgrade your plan.");
      return;
    }

    if (!newMessage.trim() || !selectedUser || !currentUserId) return;

    const messageContent = newMessage.trim();
    console.log(`🚀 Sending: "${messageContent}" to ${selectedUser.name}`);

    const tempMsg = {
      id: `temp-${Date.now()}`,
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      attachment_url: null,
      isTemporary: true,
    };

    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");

    try {
      const response = await chatApi.sendMessage({
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        content: messageContent,
        attachment_url: null,
      });

      console.log(" Message sent successfully");
      fetchRecentChats();

      setTimeout(() => {
        setMessages((prev) => {
          const realMessageExists = prev.some(
            (msg) =>
              !msg.isTemporary &&
              msg.sender_id === currentUserId &&
              msg.content === messageContent,
          );

          if (!realMessageExists && response.data) {
            console.log("🔄 Replacing temporary with real message");
            return prev.map((msg) =>
              msg.id === tempMsg.id ? response.data : msg,
            );
          }
          return prev;
        });
      }, 3000);
    } catch (error) {
      console.error("❌ Send failed:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMsg.id));

      //  ADDED: message limit handling
      if (
        error.response?.status === 403 &&
        error.response?.data?.code === "MESSAGE_LIMIT_EXCEEDED"
      ) {
        setMessageLimitReached(true);
        alert("Your message limit is over. Please upgrade your plan.");
      } else if (error.response?.status === 403) {
        alert("Your plan has expired. Please upgrade to send messages.");
      } else {
        alert("Failed to send message");
      }
    }
  };

  // ADD REACTION - PROPER REAL-TIME HANDLING
  const addReaction = async (messageId, emoji) => {
    // 🔒 PLAN EXPIRED
    if (!planStatus.active) {
      alert("Your plan has expired. Please upgrade.");
      return;
    }

    // 🔒 MESSAGE LIMIT OVER
    if (messageLimitReached) {
      alert("Your message limit is over. Please upgrade your plan.");
      return;
    }

    if (!currentUserId || !messageId) {
      console.error("❌ Cannot add reaction: missing user ID or message ID");
      return;
    }
    console.log(
      `🎭 Adding reaction: ${emoji} to message ${messageId} by user ${currentUserId}`,
    );

    try {
      const response = await chatApi.addReaction({
        message_id: messageId,
        user_id: currentUserId,
        emoji: emoji,
      });

      console.log(" Reaction sent successfully:", response.data);

      if (selectedUser) {
        setTimeout(() => {
          loadReactions(selectedUser.id);
        }, 500);
      }

      if (socketRef.current && response.data) {
        socketRef.current.emit("send_reaction", response.data);
      }

      setShowReactionPicker(null);
    } catch (err) {
      console.error("❌ Reaction failed:", err);
      alert("Failed to add reaction");
    }
  };

  // GET REACTIONS FOR MESSAGE - SIMPLE AND WORKING
  const getMessageReactions = (messageId) => {
    if (!messageId) return [];

    const messageReactions = reactions.filter((r) => {
      return r.message_id == messageId;
    });

    console.log(`🎭 Reactions for message ${messageId}:`, messageReactions);

    return messageReactions;
  };

  // RECONNECT SOCKET
  const reconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  };

  // FILE UPLOAD
  const handleFileUpload = async (file) => {
    // 🔒 PLAN EXPIRED
    if (!planStatus.active) {
      alert("Your plan has expired. Please upgrade to upload files.");
      return;
    }

    // 🔒 MESSAGE LIMIT OVER
    if (messageLimitReached) {
      alert("Your message limit is over. Please upgrade your plan.");
      return;
    }

    if (!selectedUser || !currentUserId) return;

    setFileUploading(true);
    const tempId = `file-${Date.now()}`;
    const tempMsg = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      content: `Sending: ${file.name}`,
      isTemporary: true,
      isUploading: true,
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      const uploadResponse = await chatApi.uploadFile(file);
      if (uploadResponse.data?.url) {
        await chatApi.sendMessage({
          sender_id: currentUserId,
          receiver_id: selectedUser.id,
          content: `File: ${file.name}`,
          attachment_url: uploadResponse.data.url,
        });

        setTimeout(() => {
          setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        }, 1000);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    } finally {
      setFileUploading(false);
    }
  };

  // FILE INPUT
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedUser && currentUserId) {
      handleFileUpload(file);
    }
    e.target.value = "";
  };

  // SEARCH EFFECT
  useEffect(() => {
    if (searchTerm.trim() && currentUserId) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setUsers([]);
    }
  }, [searchTerm, searchUsers, currentUserId]);

  // ENTER KEY HANDLING
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // FORMAT TIME
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // RENDER ATTACHMENT
  const renderAttachment = (message) => {
    if (!message.attachment_url) return null;

    const isImage = message.attachment_url.match(
      /\.(jpg|jpeg|png|gif|webp|bmp|svg|webp)$/i,
    );

    if (isImage) {
      return (
        <div className="mt-2">
          <img
            src={message.attachment_url}
            onClick={() => {
              setSelectedImage({
                url: message.attachment_url,
                sender:
                  message.sender_id === currentUserId
                    ? "You"
                    : selectedUser?.name,
                timestamp: message.created_at,
              });
              setShowImageModal(true);
            }}
            alt="Attachment"
            className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 max-h-64 object-cover"
          />
          <p className="text-xs text-gray-500 mt-1">Click to view image</p>
        </div>
      );
    }

    return (
      <a
        href={message.attachment_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition mt-2"
      >
        <span>📎</span>
        <span className="text-sm">Download File</span>
      </a>
    );
  };

  //  SIMPLE FUNCTION FOR GRADIENT COLOR
  const getGradientColor = (name) => {
    const nameChar = name?.charAt(0) || "U";
    const colors = [
      "bg-gradient-to-br from-indigo-400 to-purple-500",
      "bg-gradient-to-br from-green-400 to-blue-500",
      "bg-gradient-to-br from-pink-400 to-red-500",
      "bg-gradient-to-br from-yellow-400 to-orange-500",
      "bg-gradient-to-br from-teal-400 to-cyan-500",
    ];
    const index = nameChar.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Show login message if no user
  if (!currentUserId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Please Login First
          </h3>
          <p className="text-gray-500">You need to login to access messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
     ref={messagesContainerRef} 
  onScroll={handleScroll}    
  
  style={{ maxHeight: "350px" }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages</h2>

      {/* PLAN STATUS BANNER - TOP ME ADD KIYA HAI */}
      {!planStatus.loading && (
        <div
          className={`mb-4 p-3 text-sm text-center rounded-lg border ${
            planStatus.active
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {planStatus.active ? (
            <>
              ✅ <strong>Plan Active</strong> — {planStatus.daysLeft} day
              {planStatus.daysLeft !== 1 && "s"} remaining
            </>
          ) : (
            <>
              ❌ <strong>Plan Expired</strong> — Upgrade to continue chatting
            </>
          )}
        </div>
      )}

      {/* RESPONSIVE CHAT CONTAINER - HEIGHT REDUCED */}
      <div className="bg-white rounded-2xl shadow-lg h-[55vh] sm:h-[500px] flex flex-col md:flex-row border border-gray-200 relative">
        {/*  MOBILE HEADER FOR CHAT */}
        {selectedUser && !showSidebar && (
          <div className="md:hidden p-4 border-b border-gray-200 bg-white flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              ← Back
            </button>
            {/*  PROFILE PICTURE WITH FALLBACK */}
            {selectedUser.profile_picture_url ? (
              <img
                src={selectedUser.profile_picture_url}
                alt={selectedUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.querySelector(
                    ".mobile-fallback-avatar",
                  ).style.display = "flex";
                }}
              />
            ) : userProfilePictures[selectedUser.id] ? (
              <img
                src={userProfilePictures[selectedUser.id]}
                alt={selectedUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.querySelector(
                    ".mobile-fallback-avatar",
                  ).style.display = "flex";
                }}
              />
            ) : null}

            <div
              className={`mobile-fallback-avatar w-8 h-8 ${getGradientColor(selectedUser.name)} rounded-full flex items-center justify-center text-white font-bold text-sm ${
                selectedUser.profile_picture_url ||
                userProfilePictures[selectedUser.id]
                  ? "hidden"
                  : "flex"
              }`}
            >
              {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="font-medium text-gray-800 text-sm">
                {selectedUser.name}
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        )}

        {/* SIDEBAR - Responsive */}
        <div
          className={`
          ${showSidebar ? "flex" : "hidden"} 
          md:flex
          w-full md:w-1/3 lg:w-1/4 
          border-r border-gray-200 
          flex-col 
          absolute md:relative 
          h-full bg-white z-10
        `}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {/* Mobile back button */}
              <button
                onClick={() => setShowSidebar(false)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                ←
              </button>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* RECENT CHATS SECTION - RESPONSIVE */}
          <div className="border-b border-gray-200">
            <div className="px-4 py-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">
                Recent Chats
              </h3>
            </div>

            <div className="max-h-48 overflow-y-auto">
              {recentChatsLoading ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  Loading recent chats...
                </div>
              ) : recentChats.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No recent conversations
                </div>
              ) : (
                recentChats.map((chat) => (
                  <div
                    key={chat.user_id}
                    onClick={() => handleRecentChatSelect(chat)}
                    className={`p-3 cursor-pointer transition border-b border-gray-100 ${
                      selectedUser?.id === chat.user_id
                        ? "bg-indigo-50 border-indigo-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* ✅ PROFILE PICTURE WITH FALLBACK */}
                      {chat.profile_picture_url ? (
                        <img
                          src={chat.profile_picture_url}
                          alt={chat.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.querySelector(
                              ".chat-fallback-avatar",
                            ).style.display = "flex";
                          }}
                        />
                      ) : userProfilePictures[chat.user_id] ? (
                        <img
                          src={userProfilePictures[chat.user_id]}
                          alt={chat.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.querySelector(
                              ".chat-fallback-avatar",
                            ).style.display = "flex";
                          }}
                        />
                      ) : null}

                      <div
                        className={`chat-fallback-avatar w-10 h-10 ${getGradientColor(chat.name)} rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          chat.profile_picture_url ||
                          userProfilePictures[chat.user_id]
                            ? "hidden"
                            : "flex"
                        }`}
                      >
                        {cleanUserName(chat.name)?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-gray-800 truncate text-sm">
                            {cleanUserName(chat.name)}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              chat.last_message_time,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-600 truncate">
                            {chat.last_message || "No messages yet"}
                          </p>
                          {chat.unread_count > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {chat.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {loading && searchTerm ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : users.length === 0 && searchTerm ? (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-3 cursor-pointer transition border-b border-gray-100 ${
                    selectedUser?.id === user.id
                      ? "bg-indigo-50 border-indigo-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/*  PROFILE PICTURE WITH FALLBACK */}
                    {user.profile_picture_url ? (
                      <img
                        src={user.profile_picture_url}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.querySelector(
                            ".user-fallback-avatar",
                          ).style.display = "flex";
                        }}
                      />
                    ) : userProfilePictures[user.id] ? (
                      <img
                        src={userProfilePictures[user.id]}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.querySelector(
                            ".user-fallback-avatar",
                          ).style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className={`user-fallback-avatar w-12 h-12 ${getGradientColor(user.name)} rounded-full flex items-center justify-center text-white font-bold ${
                        user.profile_picture_url || userProfilePictures[user.id]
                          ? "hidden"
                          : "flex"
                      }`}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CHAT AREA - Responsive with reduced height */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/*  Desktop Header with Profile Picture */}
              <div className="hidden md:flex p-4 border-b border-gray-200 bg-white items-center gap-3">
                {/*  PROFILE PICTURE WITH FALLBACK */}
                {selectedUser.profile_picture_url ? (
                  <img
                    src={selectedUser.profile_picture_url}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.querySelector(
                        ".desktop-fallback-avatar",
                      ).style.display = "flex";
                    }}
                  />
                ) : userProfilePictures[selectedUser.id] ? (
                  <img
                    src={userProfilePictures[selectedUser.id]}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.querySelector(
                        ".desktop-fallback-avatar",
                      ).style.display = "flex";
                    }}
                  />
                ) : null}

                <div
                  className={`desktop-fallback-avatar w-10 h-10 ${getGradientColor(selectedUser.name)} rounded-full flex items-center justify-center text-white font-bold ${
                    selectedUser.profile_picture_url ||
                    userProfilePictures[selectedUser.id]
                      ? "hidden"
                      : "flex"
                  }`}
                >
                  {selectedUser.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    {selectedUser.name}
                  </p>
                </div>
              </div>

              {/* Messages Area - Height reduced */}
              <div
                className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
                style={{ maxHeight: "350px" }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600">
                      Loading messages...
                    </span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm">
                      Start the conversation with {selectedUser.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === currentUserId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] xs:max-w-xs sm:max-w-md relative message-bubble ${
                            message.sender_id === currentUserId
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                              : "bg-white text-gray-800 shadow-sm border border-gray-200"
                          } rounded-2xl p-3 sm:p-4 ${
                            message.isTemporary
                              ? "opacity-70 border-2 border-dashed border-yellow-400"
                              : ""
                          } ${
                            deletingMessageId === message.id ? "opacity-50" : ""
                          }`}
                        >
                          {/* MORE OPTIONS BUTTON - Only show for user's own messages */}
                          {message.sender_id === currentUserId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteOption(
                                  showDeleteOption === message.id
                                    ? null
                                    : message.id,
                                );
                              }}
                              className="absolute top-2 right-2 more-options-btn text-white/70 hover:text-white text-sm"
                              title="More options"
                            >
                              <span className="text-sm color-white-500">
                                🗑️
                              </span>
                            </button>
                          )}

                          {/* DELETE OPTION DROPDOWN */}
                          {showDeleteOption === message.id &&
                            message.sender_id === currentUserId && (
                              <div className="absolute top-8 right-2 bg-white border border-gray-200 rounded-lg shadow-lg p-1 delete-option z-20">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessage(message.id);
                                  }}
                                  disabled={deletingMessageId === message.id}
                                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium w-full disabled:opacity-50"
                                >
                                  {deletingMessageId === message.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                                      Deleting...
                                    </>
                                  ) : (
                                    <>🗑️ Delete Message</>
                                  )}
                                </button>
                              </div>
                            )}

                          {/* Message content */}
                          {message.content && (
                            <p className="break-words whitespace-pre-wrap text-sm sm:text-base">
                              {message.content}
                            </p>
                          )}

                          {/* Attachment */}
                          {renderAttachment(message)}

                          {/* Message Footer - Timestamp + Reaction Button */}
                          <div className="flex justify-between items-center mt-2">
                            <p
                              className={`text-xs ${
                                message.sender_id === currentUserId
                                  ? "text-indigo-200"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.created_at)}
                              {message.isTemporary && " • Sending..."}
                              {deletingMessageId === message.id &&
                                " • Deleting..."}
                            </p>

                            {/* WhatsApp Style Reaction Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowReactionPicker(
                                  showReactionPicker === message.id
                                    ? null
                                    : message.id,
                                );
                              }}
                              className={`text-xs p-1 rounded-full reaction-btn ${
                                message.sender_id === currentUserId
                                  ? "bg-white/20 hover:bg-white/30 text-white"
                                  : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                              } transition`}
                              title="Add reaction"
                            >
                              😊
                            </button>
                          </div>
                          {/* REACTIONS DISPLAY */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {getMessageReactions(message.id).map(
                              (reaction, index) => (
                                <span
                                  key={reaction.id || index}
                                  className="text-xs bg-white bg-opacity-90 px-2 py-1 rounded-full border border-gray-300 flex items-center gap-1 shadow-sm"
                                  title={`Reaction by user`}
                                >
                                  <span className="text-sm">
                                    {reaction.emoji ||
                                      reaction.reaction ||
                                      "❤️"}
                                  </span>
                                </span>
                              ),
                            )}
                          </div>

                          {/* Reaction Picker - LEFT SIDE FOR USER MESSAGES */}
                          {showReactionPicker === message.id && (
                            <div className="absolute -top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex gap-1 reaction-picker z-50">
                              {["❤️", "👍", "😂", "😮", "😢", "🎉"].map(
                                (emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addReaction(message.id, emoji);
                                    }}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition text-lg"
                                  >
                                    {emoji}
                                  </button>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={fileUploading || !planStatus.active}
                    className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 text-sm"
                  >
                    {fileUploading ? "📤" : "📎"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept="*/*"
                  />
                  {/* Emoji Button - NEW */}
                  <button
                    ref={emojiButtonRef}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    disabled={!planStatus.active}
                    className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 text-lg"
                    title="Add emoji"
                  >
                    😊
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      planStatus.active
                        ? `Message ${selectedUser.name}...`
                        : "Upgrade plan to send messages..."
                    }
                    onKeyPress={handleKeyPress}
                    disabled={!planStatus.active}
                    className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl text-sm sm:text-base bg-white ${
                      planStatus.active ? "cursor-text" : "cursor-not-allowed"
                    }`}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !newMessage.trim() ||
                      !planStatus.active ||
                      messageLimitReached
                    }
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium disabled:opacity-50 text-sm sm:text-base"
                  >
                    Send
                  </button>
                  {/* Emoji Picker Popup - NEW */}
                  {showEmojiPicker && (
                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-16 left-0 z-50 shadow-2xl"
                    >
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                        width={300}
                        height={400}
                        previewConfig={{ showPreview: false }}
                        searchPlaceholder="Search emojis..."
                        skinTonesDisabled={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
              <div className="text-center">
                <div className="text-4xl sm:text-6xl mb-4">💬</div>
                <p className="text-lg font-medium">
                  Select a user to start chatting
                </p>
                <p className="text-sm mt-2">Search for users in the sidebar</p>
                {/* Mobile sidebar toggle */}
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Open Contacts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>

            {/* Image */}
            <img
              src={selectedImage.url}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span>Sent by: {selectedImage.sender}</span>
                <span>{formatTime(selectedImage.timestamp)}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => window.open(selectedImage.url, "_blank")}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = selectedImage.url;
                    link.download = "image";
                    link.click();
                  }}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
