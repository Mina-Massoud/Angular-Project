// Owner: Mina — feature: chatbot/service
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ChatMessage, GeminiContent, GeminiRequest, GeminiResponse } from '../chatbot.types';
import { buildSystemPrompt } from '../data/system-prompt';

const STORAGE_KEY = 'chatbot_history';
const MAX_TURNS = 12;
const MAX_INPUT_CHARS = 2000;

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly messages = signal<ChatMessage[]>(this.loadHistory());
  readonly isOpen = signal(false);
  readonly isTyping = signal(false);
  readonly hasUnread = signal(false);
  readonly canSend = computed(() => !this.isTyping() && !!environment.geminiApiKey);

  private lastUserId: string | null | undefined = undefined;

  constructor() {
    effect(() => {
      const user = this.auth.currentUser();
      const id = user?._id ?? user?.id ?? null;
      if (this.lastUserId !== undefined && this.lastUserId && !id) {
        this.clear();
      }
      this.lastUserId = id;
    });

    effect(() => {
      const list = this.messages();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch {
        // ignore quota / disabled storage
      }
    });
  }

  open(): void {
    this.isOpen.set(true);
    this.hasUnread.set(false);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    if (this.isOpen()) this.close();
    else this.open();
  }

  clear(): void {
    this.messages.set([]);
    this.hasUnread.set(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  async sendMessage(rawText: string): Promise<void> {
    const text = rawText.trim().slice(0, MAX_INPUT_CHARS);
    if (!text || this.isTyping()) return;

    if (!environment.geminiApiKey) {
      this.toast.error('Chatbot API key is not configured. Add geminiApiKey to environment.ts.');
      return;
    }

    const userMsg: ChatMessage = { role: 'user', content: text, ts: Date.now() };
    this.messages.update((m) => [...m, userMsg]);
    this.isTyping.set(true);

    try {
      const reply = await this.callGemini();
      const modelMsg: ChatMessage = { role: 'model', content: reply, ts: Date.now() };
      this.messages.update((m) => [...m, modelMsg]);
      if (!this.isOpen()) this.hasUnread.set(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Chatbot request failed.';
      this.toast.error(message);
      this.messages.update((m) => (m.at(-1) === userMsg ? m.slice(0, -1) : m));
    } finally {
      this.isTyping.set(false);
    }
  }

  private async callGemini(): Promise<string> {
    const recent = this.messages().slice(-MAX_TURNS);
    const contents: GeminiContent[] = recent.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const body: GeminiRequest = {
      system_instruction: {
        parts: [{ text: buildSystemPrompt(this.auth.currentUser()) }],
      },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    };

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/` +
      `${environment.geminiModel}:generateContent?key=${environment.geminiApiKey}`;

    // Use fetch (not HttpClient) to bypass the global error interceptor.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      throw new Error('Chatbot is busy, try again in a minute.');
    }

    const data = (await res.json().catch(() => ({}))) as GeminiResponse;

    if (!res.ok || data.error) {
      const msg = data.error?.message || `Chatbot error (${res.status}).`;
      throw new Error(msg);
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) throw new Error('Chatbot returned an empty response.');
    return reply;
  }

  private loadHistory(): ChatMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (m): m is ChatMessage =>
          m && (m.role === 'user' || m.role === 'model') && typeof m.content === 'string',
      );
    } catch {
      return [];
    }
  }
}
