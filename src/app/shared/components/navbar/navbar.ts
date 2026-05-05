// Owner: Mostafa Shanab — feature: shared/navbar
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private auth = inject(AuthService);

  cartCount = this.cartService.cartCount;
  wishlistCount = this.wishlistService.wishlistCount;
  currentUser = this.auth.currentUser;

  isUserMenuOpen = signal(false);

  navLinks = [
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Brands', path: '/brands' },
    { label: 'Orders', path: '/orders' },
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
    this.auth.logout();
  }
}
