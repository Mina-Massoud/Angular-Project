// Owner: Mina — feature: chatbot/chatbot-widget
import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChatbotService } from '../services/chatbot.service';

interface RenderedSegment {
  kind: 'text' | 'link';
  text: string;
  href?: string;
  internal?: boolean;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './chatbot-widget.html',
  styleUrl: './chatbot-widget.css',
})
export class ChatbotWidget implements AfterViewChecked {
  private readonly chatbot = inject(ChatbotService);
  private readonly router = inject(Router);

  @ViewChild('messageList') messageListRef?: ElementRef<HTMLDivElement>;
  @ViewChild('inputArea') inputRef?: ElementRef<HTMLTextAreaElement>;

  readonly messages = this.chatbot.messages;
  readonly isOpen = this.chatbot.isOpen;
  readonly isTyping = this.chatbot.isTyping;
  readonly hasUnread = this.chatbot.hasUnread;
  readonly canSend = this.chatbot.canSend;

  readonly draft = signal('');
  readonly hasMessages = computed(() => this.messages().length > 0);
  readonly suggestions = [
    'What are your shipping times?',
    'How do I return an item?',
    'Where can I see my orders?',
    'Show me the categories.',
  ];

  private shouldScroll = false;

  constructor() {
    effect(() => {
      // Scroll to bottom whenever messages change while panel is open
      this.messages();
      this.isTyping();
      if (this.isOpen()) this.shouldScroll = true;
    });

    effect(() => {
      if (this.isOpen()) {
        queueMicrotask(() => this.inputRef?.nativeElement?.focus());
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.messageListRef) {
      const el = this.messageListRef.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.shouldScroll = false;
    }
  }

  toggle(): void {
    this.chatbot.toggle();
  }

  close(): void {
    this.chatbot.close();
  }

  clear(): void {
    this.chatbot.clear();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send(): void {
    const text = this.draft();
    if (!text.trim() || !this.canSend()) return;
    this.draft.set('');
    void this.chatbot.sendMessage(text);
  }

  sendSuggestion(text: string): void {
    if (!this.canSend()) return;
    void this.chatbot.sendMessage(text);
  }

  onLinkClick(event: MouseEvent, href: string, internal: boolean): void {
    if (!internal) return;
    event.preventDefault();
    this.chatbot.close();
    void this.router.navigateByUrl(href);
  }

  // Tiny markdown link parser: supports [text](url) — internal if url starts with '/'.
  parseSegments(content: string): RenderedSegment[] {
    const segments: RenderedSegment[] = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ kind: 'text', text: content.slice(lastIndex, match.index) });
      }
      const href = match[2].trim();
      const internal = href.startsWith('/');
      segments.push({ kind: 'link', text: match[1], href, internal });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      segments.push({ kind: 'text', text: content.slice(lastIndex) });
    }
    return segments.length ? segments : [{ kind: 'text', text: content }];
  }
}
