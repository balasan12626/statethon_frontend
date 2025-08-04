# Floating Chatbot Component

## Overview
A TypeScript React component that provides a floating chatbot interface for NCO Career Assistant functionality.

## Features

### ✅ **Core Functionality**
- **Floating UI**: Bottom-right corner floating chat button
- **Static Model**: Uses 'groq' model as specified in requirements
- **Message History**: Stores and displays chat history in local state
- **Real-time Updates**: Auto-scrolls to latest messages
- **Loading States**: Shows typing indicators during API calls
- **Error Handling**: Graceful error handling with user-friendly messages

### ✅ **UI/UX Features**
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode Support**: Compatible with existing theme system
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Smooth Animations**: Hover effects and transitions
- **Modern Design**: Clean, professional appearance

### ✅ **Technical Features**
- **TypeScript**: Fully typed with proper interfaces
- **Modular Architecture**: Separated types and utilities
- **API Integration**: Connects to `/api/langchain/chat` endpoint
- **State Management**: Local state with React hooks
- **Performance**: Optimized with proper useRef and useEffect

## File Structure

```
src/
├── components/
│   └── FloatingChatbot.tsx      # Main chatbot component
├── types/
│   └── chatbot.ts               # TypeScript interfaces
├── utils/
│   └── chatbot.ts               # Helper functions
└── App.tsx                      # Integration point
```

## Usage

The chatbot is automatically integrated into the main App component and appears on all pages:

```tsx
// In App.tsx
import FloatingChatbot from './components/FloatingChatbot';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main>
            <Routes>
              {/* Your routes */}
            </Routes>
          </main>
          <Footer />
          <FloatingChatbot /> {/* Chatbot appears on all pages */}
        </div>
      </Router>
    </ThemeProvider>
  );
}
```

## API Integration

The chatbot sends requests to `/api/langchain/chat` with the following format:

**Request:**
```json
{
  "message": "What is NCO code 20215?",
  "model": "groq"
}
```

**Response:**
```json
{
  "success": true,
  "response": "According to the Indian National Classification of Occupations...",
  "model": "groq",
  "timestamp": "2025-08-04T06:57:06.142Z",
  "usage": {
    "model": "llama3-8b-8192",
    "timestamp": "2025-08-04T06:57:06.142Z"
  }
}
```

## Customization

### Styling
The component uses Tailwind CSS classes and supports dark mode. You can customize:
- Colors: Modify blue-600 classes for brand colors
- Size: Adjust w-96 h-[500px] for different dimensions
- Position: Change bottom-6 right-6 for different placement

### Messages
- Initial welcome message: Edit `getInitialMessages()` in `utils/chatbot.ts`
- Error messages: Modify `createErrorMessage()` function
- Loading indicators: Customize the bouncing dots animation

### API Endpoint
- Change the fetch URL in `sendMessage()` function
- Modify request/response handling as needed

## Dependencies

- **React**: Core framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons (Send, X, MessageCircle)
- **React Router**: Navigation (for integration)

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive
- Touch-friendly interface

## Performance

- Lightweight component (~15KB gzipped)
- Efficient re-renders with proper state management
- Minimal API calls (only when sending messages)
- Auto-cleanup of event listeners and refs 