// Owner: Mina — root app shell
import { Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';
import { ToastComponent } from './shared/components/toast/toast';
import { CartSheet } from './features/cart/cart-sheet/cart-sheet';
import { ChatbotWidget } from './features/chatbot/chatbot-widget/chatbot-widget';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, LoadingSpinner, ToastComponent, CartSheet, ChatbotWidget],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isHome = signal(true);

  constructor() {
    this.isHome.set(this.router.url === '/' || this.router.url.startsWith('/?'));
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        const url = (e as NavigationEnd).urlAfterRedirects;
        this.isHome.set(url === '/' || url.startsWith('/?'));
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      });

    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
      );

      const observeAll = () => {
        document.querySelectorAll('.reveal:not(.active)').forEach((el) => observer.observe(el));
      };
      observeAll();

      const mo = new MutationObserver(() => observeAll());
      mo.observe(document.body, { childList: true, subtree: true });

      const heroParallax = () => {
        const img = document.getElementById('hero-image') as HTMLElement | null;
        if (!img) return;
        const scrollPos = window.scrollY;
        if (scrollPos <= window.innerHeight) {
          img.style.setProperty('--scroll-y', `${scrollPos * 0.3}px`);
          img.style.setProperty('--scroll-scale', `${(scrollPos / window.innerHeight) * 0.05}`);
        }
      };

      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            heroParallax();
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      this.router.events
        .pipe(
          filter((e) => e instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => setTimeout(observeAll, 0));
    });
  }
}
