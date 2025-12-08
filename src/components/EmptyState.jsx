function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
      <div className="text-6xl mb-4 opacity-50">💬</div>
      <h2 className="text-2xl mb-2 text-text">Select a conversation</h2>
      <p>Choose a conversation from the sidebar to view messages</p>
    </div>
  )
}

export default EmptyState

