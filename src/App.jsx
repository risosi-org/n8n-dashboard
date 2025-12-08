import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import ChatContainer from "./components/ChatContainer";
import EmptyState from "./components/EmptyState";
import LoadingOverlay from "./components/LoadingOverlay";
import Login from "./components/Login";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const API_BASE = RAW_API_URL.replace(/\/api\/?$/, "");
const API_URL = `${API_BASE}/api`;

function App() {
  const [conversations, setConversations] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [authUser, setAuthUser] = useState(() => {
    const savedUser = localStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const fetchWithAuth = async (
    url,
    options = {},
    _allowRetry = true,
    tokenOverride = null
  ) => {
    const activeToken = tokenOverride || accessToken;
    const headers = {
      ...(options.headers || {}),
      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
    };

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    console.log({response})

    if (response.status === 401) {
 
      throw new Error("Unauthorized");
    }

    return response;
  };

  // Load conversations
  const loadConversations = async (showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/conversations`);

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations. Please login again.");
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
    }
  };

  // Bootstrap session from refresh token if available
  useEffect(() => {
    const bootstrapAuth = async () => {
      setLoading(true);

      const storedUser = localStorage.getItem("authUser");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const storedToken = localStorage.getItem("accessToken");

      if (parsedUser) {
        setAuthUser(parsedUser);
      }

      if (storedToken && parsedUser) {
        setAccessToken(storedToken);
        await loadConversations();
      }

      setLoading(false);
    };

    bootstrapAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh every 5 seconds once authenticated
  useEffect(() => {
    if (!authUser) {
      return;
    }

    loadConversations();
    const interval = setInterval(() => loadConversations(), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  // Select conversation
  const handleSelectConversation = (userId) => {
    setCurrentUserId(userId);
  };

  // Toggle AI
  const handleToggleAI = async (userId) => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${API_URL}/conversations/${userId}/toggle`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle AI");
      }

      const updatedConv = await response.json();
      setConversations((prev) => ({
        ...prev,
        [userId]: updatedConv,
      }));

      toast.success(`AI ${updatedConv.aiEnabled ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error toggling AI:", error);
      toast.error("Failed to toggle AI");
    } finally {
      setLoading(false);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${API_URL}/conversations/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete conversation");
      }

      const updatedConvs = { ...conversations };
      delete updatedConvs[userId];
      setConversations(updatedConvs);

      if (currentUserId === userId) {
        setCurrentUserId(null);
      }

      toast.success("Conversation deleted successfully");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ username, password }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setAccessToken(data.accessToken);
      localStorage.setItem("accessToken", data.accessToken);

      const user = { username };
      setAuthUser(user);
      localStorage.setItem("authUser", JSON.stringify(user));
      toast.success("Logged in successfully");

      await loadConversations(true);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem("accessToken");
      setAuthUser(null);
      setCurrentUserId(null);
      setConversations({});
      localStorage.removeItem("authUser");
      setLoading(false);
    }
  };

  const currentConversation = currentUserId
    ? conversations[currentUserId]
    : null;

  if (!authUser) {
    return (
      <div className="min-h-screen">
        <Toaster position="top-right" />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Toaster position="top-right" />
      <LoadingOverlay loading={loading} />

      <Sidebar
        conversations={conversations}
        currentUserId={currentUserId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectConversation={handleSelectConversation}
        onLogout={handleLogout}
        authUser={authUser}
      />

      <main className="flex-1 flex flex-col bg-dark">
        {currentConversation ? (
          <ChatContainer
            conversation={currentConversation}
            userId={currentUserId}
            onToggleAI={handleToggleAI}
            onDelete={handleDeleteConversation}
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

export default App;
