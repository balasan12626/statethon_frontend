export interface ChatMessage {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatbotRequest {
  message: string;
  model: string;
}

export interface ChatbotResponse {
  success: boolean;
  response: string;
  model: string;
  timestamp: string;
  usage?: {
    model: string;
    timestamp: string;
  };
}

export interface ChatbotState {
  isOpen: boolean;
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
} 