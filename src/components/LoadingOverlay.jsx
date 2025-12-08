function LoadingOverlay({ loading }) {
  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-dark-3 border-t-primary rounded-full animate-spin"></div>
    </div>
  )
}

export default LoadingOverlay

