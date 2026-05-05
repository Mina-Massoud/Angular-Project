// Owner: Mostafa Shanab — feature: shared/navbar
import { Component, HostListener, inject, signal, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
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
  private router = inject(Router);

  cartCount = this.cartService.cartCount;
  wishlistCount = this.wishlistService.wishlistCount;
  currentUser = this.auth.currentUser;

  isUserMenuOpen = signal(false);
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);
  isOnHome = signal(true);

  navLinks = [
    { label: 'Shop', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Brands', path: '/brands' },
    { label: 'Orders', path: '/orders' },
  ];

  ngOnInit() {
    this.cartService.loadCartCount();
    this.wishlistService.loadWishlistCount();

    this.isOnHome.set(this.router.url === '/' || this.router.url.startsWith('/?'));
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      const url = (e as NavigationEnd).urlAfterRedirects;
      this.isOnHome.set(url === '/' || url.startsWith('/?'));
      this.isMobileMenuOpen.set(false);
      this.isUserMenuOpen.set(false);
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const threshold = window.innerHeight * 0.85;
    this.isScrolled.set(window.scrollY > threshold);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }

  signOut() {
    this.isUserMenuOpen.set(false);
    this.auth.logout();
  }

  openCart() {
    this.cartService.openSheet();
  }
}
