// Owner: Mina — feature: checkout/payment-failure
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment-failure.html',
  styleUrl: './payment-failure.css',
})
export class PaymentFailure {
  // TODO: Mina — show failure reason, retry CTA
}
