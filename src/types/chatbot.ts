export interface ChatMessage {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatbotRequest {
  message: string;
  conversation_id?: string | null;
}

export interface ChatbotResponse {
  // Many backends simply return a `response` field
  response: string;
  conversation_id?: string | null;
  nco_matches?: unknown[];
  // Optional fields for compatibility with other backends
  success?: boolean;
  model?: string;
  timestamp?: string;
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