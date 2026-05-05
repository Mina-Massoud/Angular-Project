// Owner: Noura — feature: brands/details
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandsService } from '../services/brands.service';
import { ProductsService } from '../../products/services/products.service';
import { Brand } from '../models/brand.model';
import { Product } from '../../products/models/product.model';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-brand-details',
  standalone: true,
  imports: [RouterLink, ProductCard, Pagination],
  templateUrl: './brand-details.html',
  styleUrl: './brand-details.css',
})
export class BrandDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly brandsService = inject(BrandsService);
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);

  brand = signal<Brand | null>(null);
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

  private brandId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.hasError.set(true);
      return;
    }
    this.brandId = id;
    this.loadBrand();
    this.loadProducts();
  }

  private loadBrand() {
    this.brandsService
      .getBrandById(this.brandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (b) => {
          this.brand.set(b);
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
      .getProductsByBrand(this.brandId, this.currentPage(), this.limit)
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

  onImageError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.onerror = null;
    img.src = BRAND_IMAGE_FALLBACK;
  }
}

const BRAND_IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" fill="#F2D9DB"/>' +
      '<text x="100" y="108" font-size="14" text-anchor="middle" fill="#8A8783" font-family="serif">No image</text>' +
      '</svg>',
  );
