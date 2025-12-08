import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import ChatContainer from "./components/ChatContainer";
import EmptyState from "./components/EmptyState";
import LoadingOverlay from "./components/LoadingOverlay";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";


function App() {
  const [conversations, setConversations] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/conversations`);

      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error(
        "Failed to load conversations. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Select conversation
  const handleSelectConversation = (userId) => {
    setCurrentUserId(userId);
  };

  // Toggle AI
  const handleToggleAI = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
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
      const response = await fetch(`${API_URL}/conversations/${userId}`, {
        method: "DELETE",
      });

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

  const currentConversation = currentUserId
    ? conversations[currentUserId]
    : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster position="top-right" />
      <LoadingOverlay loading={loading} />

      <Sidebar
        conversations={conversations}
        currentUserId={currentUserId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectConversation={handleSelectConversation}
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
