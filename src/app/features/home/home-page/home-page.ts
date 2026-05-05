// Owner: Mina — feature: home/page
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../categories/services/categories.service';
import { ProductsService } from '../../products/services/products.service';
import { Category } from '../../categories/models/category.model';
import { Product } from '../../products/models/product.model';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, FormsModule, ProductCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);
  private toast = inject(ToastService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  email = '';

  heroImage = 'hero.webp';

  constructor() {
    this.categoriesService.getAllCategories(1, 4).subscribe({
      next: (res) => this.categories.set(res.data ?? []),
      error: () => this.categories.set([]),
    });
    this.productsService.getAllProducts(1, 10).subscribe({
      next: (res) => this.products.set(res.data ?? []),
      error: () => this.products.set([]),
    });
  }

  onSubscribe(event: Event) {
    event.preventDefault();
    if (!this.email || !this.email.includes('@')) {
      this.toast.error('Please enter a valid email address');
      return;
    }
    this.toast.success('Thanks for subscribing — keep an eye on your inbox.');
    this.email = '';
  }

  goToShop() {
    this.router.navigate(['/products']);
  }
}
