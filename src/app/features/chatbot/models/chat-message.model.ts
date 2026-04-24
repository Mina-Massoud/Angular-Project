// Owner: Mina — feature: chatbot/model
export interface ChatMessage {
  id: string;
  author: 'user' | 'bot';
  text: string;
  timestamp: number;
}
