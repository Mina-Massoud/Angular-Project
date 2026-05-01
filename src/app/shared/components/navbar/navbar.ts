// Owner: Mostafa Shanab — feature: shared/navbar

import { Component, signal } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../features/cart/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  cartCount = signal(3);
  wishlistCount = signal(5);
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

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  signOut() {
    this.isUserMenuOpen.set(false);
  }

}
