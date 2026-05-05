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

  shopLinks = [
    { label: 'New Arrivals', path: '/products' },
    { label: 'All Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Brands', path: '/brands' },
  ];

  accountLinks = [
    { label: 'My Profile', path: '/profile' },
    { label: 'My Orders', path: '/orders' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Bag', path: '/cart' },
  ];
}
