// Owner: Noura — feature: categories/details
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LowerCasePipe } from '@angular/common';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../../products/services/products.service';
import { Category } from '../models/category.model';
import { Product } from '../../products/models/product.model';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [RouterLink, ProductCard, Pagination, LowerCasePipe],
  templateUrl: './category-details.html',
  styleUrl: './category-details.css',
})
export class CategoryDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  category = signal<Category | null>(null);
  products = signal<Product[]>([]);
  isLoading = signal(true);
  isLoadingProducts = signal(true);
  hasError = signal(false);

  currentPage = signal(1);
  totalPages = signal(0);
  totalResults = signal(0);

  readonly limit = 10;
  readonly skeletons = Array.from({ length: 10 });

  resultsLabel = computed(() =>
    this.totalResults() === 1 ? '1 piece' : `${this.totalResults()} pieces`,
  );

  private categoryId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.hasError.set(true);
      return;
    }
    this.categoryId = id;
    this.loadCategory();
    this.loadProducts();
  }

  private loadCategory() {
    this.categoriesService
      .getCategoryById(this.categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cat) => {
          this.category.set(cat);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  loadProducts() {
    this.isLoadingProducts.set(true);
    this.productsService
      .getProductsByCategory(this.categoryId, this.currentPage(), this.limit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.products.set(res.data ?? []);
          this.totalPages.set(res.metadata?.numberOfPages ?? 0);
          this.totalResults.set(res.results ?? res.data?.length ?? 0);
          this.isLoadingProducts.set(false);
        },
        error: () => {
          this.products.set([]);
          this.totalPages.set(0);
          this.totalResults.set(0);
          this.isLoadingProducts.set(false);
        },
      });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.loadProducts();
  }
}
