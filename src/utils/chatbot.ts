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
    id: 'bot-welcome-msg',
    from: 'bot',
    text: 'Hello! 👋 I\'m your AI-powered NCO Career Assistant. I can help you with:\n\n• Finding NCO codes for specific jobs\n• Understanding career classifications\n• Exploring job opportunities\n• Career guidance and advice\n\nWhat would you like to know about NCO Code 2015?',
    timestamp: new Date()
  }
]; 