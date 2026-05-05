// Owner: Mina — feature: chatbot/types
export type ChatRole = 'user' | 'model';

export interface ChatMessage {
  role: ChatRole;
  content: string;
  ts: number;
}

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

export interface GeminiRequest {
  system_instruction?: { parts: GeminiPart[] };
  contents: GeminiContent[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  error?: { code: number; message: string; status: string };
}
