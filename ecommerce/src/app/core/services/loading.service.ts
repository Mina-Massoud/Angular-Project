// Owner: Mina — feature: core/services/loading
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  readonly visible = signal(false);
  private active = 0;

  show(): void {
    this.active += 1;
    this.visible.set(true);
  }

  hide(): void {
    this.active = Math.max(0, this.active - 1);
    if (this.active === 0) this.visible.set(false);
  }
}
