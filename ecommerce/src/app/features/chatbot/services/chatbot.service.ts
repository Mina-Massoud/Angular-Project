// Owner: Mina — feature: chatbot/service
import { Injectable } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  // TODO: Mina — local FAQ matcher and/or external Dialogflow integration
  ask(_text: string): ChatMessage {
    return { id: '0', author: 'bot', text: '', timestamp: Date.now() };
  }
}
