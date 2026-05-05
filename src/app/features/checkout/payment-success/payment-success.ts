// Owner: Mina — feature: checkout/payment-success
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.css',
})
export class PaymentSuccess implements OnInit {
  private readonly cart = inject(CartService);

  ngOnInit(): void {
    // Stripe redirects back here after paying — make sure cart badge reflects reality.
    this.cart.loadCartCount();
  }
}
