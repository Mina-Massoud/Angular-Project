// Owner: Mostafa Shanab — feature: orders/list
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/orders.service';
import { DatePipe } from '@angular/common';

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
  private readonly cdr = inject(ChangeDetectorRef);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    // const userId = this.auth.currentUser()?.id ?? '';
    const user = this.auth.currentUser();
    const userId = (user as any)?._id ?? user?.id ?? '';
    this.ordersService.getUserOrders(userId).subscribe({
      next: (res) => {
        this.orders.set(Array.isArray(res) ? res : []);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
    });
  }
}
