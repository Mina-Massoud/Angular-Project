import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  currentPage = signal(1);
  totalPages = signal(0);

  limit = 8;

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.productsService.getAllProducts(this.currentPage(), this.limit).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.totalPages.set(res.metadata.numberOfPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadProducts();
  }

  openDetails(id: string): void {
    this.router.navigate(['/products', id]);
  }
}