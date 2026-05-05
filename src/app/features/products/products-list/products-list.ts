// Owner: Youssef — feature: products/list
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CurrencyFormatPipe],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  currentPage = signal(1);
  totalPages = signal(0);

  readonly limit = 8;
  readonly skeletons = Array.from({ length: 8 });

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.productsService
      .getAllProducts(this.currentPage(), this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.totalPages.set(res.metadata.numberOfPages);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load products', err);
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.loadProducts();
  }

  openDetails(id: string): void {
    this.router.navigate(['/products', id]);
  }
}
