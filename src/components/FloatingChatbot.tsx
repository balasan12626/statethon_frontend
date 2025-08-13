import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Bot, Paperclip, Mic, MicOff, Sparkles, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, ChatbotResponse } from '../types/chatbot';
import { 
  createUserMessage, 
  createBotMessage, 
  createErrorMessage, 
  getInitialMessages,
  formatTime 
} from '../utils/chatbot';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages());
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens and reset messages
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setMessages(getInitialMessages());
    }
  }, [isOpen]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim() || isLoading) return;

    const userMessage = createUserMessage(input);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://statethon-fastapi-backend.onrender.com/chat/general', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversation_id: null
        }),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      const data: ChatbotResponse = await response.json();
      const replyText = data.response ?? '';
      if (!replyText) throw new Error('Empty response');

      const botMessage = createBotMessage(replyText);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = createErrorMessage();
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      setInput("What is the NCO code for software developers?");
      setIsListening(false);
    }, 2000);
  };



  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 dark:from-gold-500 dark:via-gold-400 dark:to-gold-600 text-white p-5 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-gold-300"
              aria-label="Open chat"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={28} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed bottom-6 right-6 w-full max-w-md h-[600px] bg-white dark:bg-navy-900 shadow-2xl rounded-3xl flex flex-col z-50 border-2 border-neutral-200 dark:border-navy-700 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Enhanced Header */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 dark:from-gold-500 dark:via-gold-400 dark:to-gold-600 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Bot size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">NCO Career Assistant</h2>
                  <p className="text-sm text-white/80">AI-powered career guidance</p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                aria-label="Close chat"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Enhanced Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-neutral-50 via-white to-primary-50/30 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {message.from === 'bot' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 dark:from-gold-500 dark:to-gold-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-sm px-6 py-4 rounded-3xl shadow-lg ${
                        message.from === 'user'
                          ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-br-lg'
                          : 'bg-white dark:bg-navy-800 text-neutral-800 dark:text-neutral-200 border-2 border-neutral-200 dark:border-navy-700 rounded-bl-lg'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.from === 'user' ? 'text-primary-100' : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Enhanced Loading indicator */}
              {isLoading && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 dark:from-gold-500 dark:to-gold-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white dark:bg-navy-800 border-2 border-neutral-200 dark:border-navy-700 rounded-3xl rounded-bl-lg px-6 py-4 shadow-lg">
                    <div className="flex space-x-2">
                      <motion.div 
                        className="w-3 h-3 bg-primary-500 dark:bg-gold-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="w-3 h-3 bg-primary-500 dark:bg-gold-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-3 h-3 bg-primary-500 dark:bg-gold-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="p-6 border-t-2 border-neutral-200 dark:border-navy-700 bg-white dark:bg-navy-900">
              <div className="flex items-center space-x-3">
                {/* Attachment Button */}
                <motion.button
                  className="w-12 h-12 bg-neutral-100 dark:bg-navy-800 hover:bg-neutral-200 dark:hover:bg-navy-700 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  title="Attach file"
                >
                  <Paperclip size={20} className="text-neutral-600 dark:text-neutral-400" />
                </motion.button>

                {/* Voice Input Button */}
                <motion.button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg ${
                    isListening 
                      ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' 
                      : 'bg-neutral-100 dark:bg-navy-800 hover:bg-neutral-200 dark:hover:bg-navy-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  title={isListening ? "Listening..." : "Voice input"}
                >
                  {isListening ? (
                    <MicOff size={20} className="animate-pulse" />
                  ) : (
                    <Mic size={20} />
                  )}
                </motion.button>

                {/* Input Field */}
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about NCO Code 2015..."
                    className="w-full px-6 py-4 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-navy-800 dark:via-navy-800 dark:to-navy-900 border-2 border-neutral-300/60 dark:border-navy-600/60 rounded-2xl focus:border-primary-500 dark:focus:border-gold-500 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-gold-100/20 transition-all duration-300 placeholder-neutral-500 dark:placeholder-neutral-400 font-medium shadow-md"
                    disabled={isLoading}
                  />
                </div>

                {/* Send Button */}
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                    !input.trim() || isLoading
                      ? 'bg-neutral-200 text-neutral-400 dark:bg-navy-700 dark:text-neutral-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white'
                  }`}
                  whileHover={!input.trim() || isLoading ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Send message"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot; 
