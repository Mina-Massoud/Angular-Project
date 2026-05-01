// Owner: Mostafa Shanab — feature: shared/navbar

import { Component, inject, signal } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  cartCount = this.cartService.cartCount;
  wishlistCount = this.wishlistService.wishlistCount;

  isUserMenuOpen = signal(false);
  userName = 'Shanab';

  navLinks = [
    { label: 'All Category', path: '/category' },
    { label: 'New Arrival', path: '/new' },
    { label: 'Sale', path: '/sale', highlight: true },
    { label: 'Women', path: '/women' },
    { label: 'Men', path: '/men' },
    { label: 'Sneakers', path: '/sneakers' },
    { label: 'Store Location', path: '/store' },
    { label: 'Contact Us', path: '/contact' },
  ];

  ngOnInit() {
    this.cartService.loadCartCount();
    this.wishlistService.loadWishlistCount();
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  signOut() {
    this.isUserMenuOpen.set(false);
  }
}
