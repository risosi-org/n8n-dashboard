import { useMemo } from 'react'

function Sidebar({ conversations, currentUserId, searchQuery, onSearchChange, onSelectConversation }) {
  // Calculate stats
  const stats = useMemo(() => {
    const total = Object.keys(conversations).length
    const aiActive = Object.values(conversations).filter(c => c.aiEnabled).length
    return { total, aiActive }
  }, [conversations])

  // Filter conversations
  const filteredConversations = useMemo(() => {
    const convsArray = Object.entries(conversations)
      .map(([userId, conv]) => ({ userId, ...conv }))
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))

    if (!searchQuery) return convsArray

    const query = searchQuery.toLowerCase()
    return convsArray.filter(conv =>
      conv.name.toLowerCase().includes(query) ||
      conv.phone.includes(query)
    )
  }, [conversations, searchQuery])

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
    <aside className="w-96 glass border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
          🤖 AI Control
        </h1>
        <p className="text-sm text-text-muted">Facebook Messenger</p>
      </div>
      
      <div className="p-6 border-b border-border">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="🔍 Search conversations..."
          className="w-full px-4 py-3 bg-dark-3 border border-border rounded-xl text-text placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      
      <div className="flex gap-3 px-6 py-4 border-b border-border">
        <div className="flex-1 bg-dark-3 p-3 rounded-xl text-center">
          <div className="text-xs text-text-muted mb-1">Total</div>
          <div className="text-xl font-bold text-primary">{stats.total}</div>
        </div>
        <div className="flex-1 bg-dark-3 p-3 rounded-xl text-center">
          <div className="text-xs text-text-muted mb-1">AI Active</div>
          <div className="text-xl font-bold text-primary">{stats.aiActive}</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {filteredConversations.length === 0 ? (
          <p className="text-center text-text-muted py-5">No conversations yet</p>
        ) : (
          filteredConversations.map(conv => (
            <div
              key={conv.userId}
              onClick={() => onSelectConversation(conv.userId)}
              className={`p-4 bg-dark-3 rounded-xl mb-3 cursor-pointer transition-all border-2 ${
                currentUserId === conv.userId
                  ? 'border-primary bg-dark-4'
                  : 'border-transparent hover:bg-dark-4 hover:translate-x-1'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm text-text">{conv.name}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                    conv.aiEnabled
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {conv.aiEnabled ? 'AI ON' : 'AI OFF'}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate mb-1">
                {conv.lastMessage || 'No messages'}
              </p>
              <span className="text-xs text-text-muted">{formatTime(conv.lastUpdated)}</span>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}

export default Sidebar

