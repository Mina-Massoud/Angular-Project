// Owner: Mostafa Shanab — feature: shared/footer
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  year = new Date().getFullYear();

  columns = [
    {
      heading: 'Shop',
      links: ['New Arrivals', 'Best Sellers', 'Sale', 'Collections', 'Gift Cards'],
    },
    {
      heading: 'Help',
      links: ['FAQ', 'Shipping & Returns', 'Size Guide', 'Track Order', 'Contact Us'],
    },
    {
      heading: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Store Locations', 'Sustainability'],
    },
  ];

  payments = ['VISA', 'Mastercard', 'PayPal', 'Apple Pay', 'Stripe'];
}
