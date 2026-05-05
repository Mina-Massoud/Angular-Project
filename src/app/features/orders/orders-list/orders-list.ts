// Owner: Mostafa Shanab — feature: orders/list
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [RouterLink, CurrencyFormatPipe, DatePipe],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersList implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const user = this.auth.currentUser();
    const userId = user?._id ?? user?.id;

    if (!userId) {
      this.isLoading.set(false);
      this.hasError.set(true);
      return;
    }

    this.isLoading.set(true);
    this.hasError.set(false);

    this.ordersService
      .getUserOrders(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.orders.set(res ?? []);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load orders', err);
          this.toast.error('Failed to load orders');
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }
}
