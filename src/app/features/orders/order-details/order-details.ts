// Owner: Mostafa Shanab — feature: orders/details
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { Order } from '../models/order.model';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [RouterLink, CurrencyFormatPipe, DatePipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetails implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.ordersService.getOrderById(id).subscribe({
      next: (res) => {
        this.order.set(res);
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
