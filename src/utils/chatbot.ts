import { ChatMessage } from '../types/chatbot';

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const createUserMessage = (text: string): ChatMessage => ({
  id: generateId(),
  from: 'user',
  text: text.trim(),
  timestamp: new Date()
});

export const createBotMessage = (text: string): ChatMessage => ({
  id: generateId(),
  from: 'bot',
  text,
  timestamp: new Date()
});

export const createErrorMessage = (): ChatMessage => ({
  id: generateId(),
  from: 'bot',
  text: 'Sorry, I encountered an error. Please try again.',
  timestamp: new Date()
});

export const getInitialMessages = (): ChatMessage[] => [
  {
    id: '1',
    from: 'bot',
    text: 'Hi! I\'m your NCO Career Assistant. Ask me anything about NCO Code 20215 and related career information.',
    timestamp: new Date()
  }
]; 