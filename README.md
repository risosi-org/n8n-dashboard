# N8N Dashboard

React dashboard for N8N AI Control with Tailwind CSS.

## Features

- 🤖 Toggle AI on/off for individual users
- 💬 View full conversation history
- 📊 Real-time statistics
- 🎨 Modern dark UI with glassmorphism
- 📱 Mobile responsive
- 🔄 Auto-refresh every 5 seconds
- ✨ Toast notifications

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Backend server running (see `n8n_server`)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your API URL (if different from default)
```

### Environment Variables

Create a `.env` file with the following variable:

```env
VITE_API_URL=http://localhost:3001/api
```

### Running

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dashboard will be available at `http://localhost:3000`

## Project Structure

```
n8n_dashboard/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── ChatContainer.jsx
│   │   ├── EmptyState.jsx
│   │   └── LoadingOverlay.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications

## Development

The app uses Vite's proxy feature to forward API requests to the backend server during development. Make sure the backend server is running on port 3001.

