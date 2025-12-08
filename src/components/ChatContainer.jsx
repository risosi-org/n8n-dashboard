import { useEffect, useRef } from 'react'

function ChatContainer({ conversation, userId, onToggleAI, onDelete }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation.messages])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="glass border-b border-border px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text">{conversation.name}</h2>
            <p className="text-sm text-text-muted">{conversation.phone || 'No phone number'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-5 py-3 bg-dark-3 rounded-xl">
            <span className="text-sm font-medium text-text-muted">AI Assistant</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={conversation.aiEnabled}
                onChange={() => onToggleAI(userId)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-dark-4 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-secondary"></div>
            </label>
            <span
              className={`text-xs font-bold min-w-[35px] ${
                conversation.aiEnabled ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {conversation.aiEnabled ? 'ON' : 'OFF'}
            </span>
          </div>
          
          <button
            onClick={() => onDelete(userId)}
            className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-lg hover:bg-red-500/20 transition-all hover:scale-105"
            title="Delete conversation"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
        {conversation.messages && conversation.messages.length > 0 ? (
          <div className="space-y-5">
            {conversation.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[60%] px-4 py-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
                      : 'bg-dark-3 text-text rounded-bl-sm'
                  }`}
                >
                  <div className="text-sm leading-relaxed mb-1.5">{msg.text}</div>
                  <div className="text-xs opacity-70">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <p className="text-center text-text-muted py-5">No messages yet</p>
        )}
      </div>
    </div>
  )
}

export default ChatContainer

