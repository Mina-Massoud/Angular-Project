// Owner: Noura — feature: brands/list
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrandsService } from '../services/brands.service';
import { Brand } from '../models/brand.model';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-brands-list',
  standalone: true,
  imports: [FormsModule, Pagination, RouterLink],
  templateUrl: './brands-list.html',
  styleUrl: './brands-list.css',
})
export class BrandsList implements OnInit {
  private readonly brandsService = inject(BrandsService);

  private allBrands = signal<Brand[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  currentPage = signal(1);
  totalPages = signal(0);
  searchQuery = signal('');
  activeLetter = signal('all');

  brands = computed(() => {
    let result = this.allBrands();
    const letter = this.activeLetter();
    const search = this.searchQuery().toLowerCase().trim();

    if (letter && letter !== 'all') {
      result = result.filter((b) => b.name.toLowerCase().startsWith(letter.toLowerCase()));
    }
    if (search) {
      result = result.filter((b) => b.name.toLowerCase().includes(search));
    }
    return result;
  });

  skeletonItems = Array(12).fill(0);
  alphabetFilters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.brandsService.getAllBrands(this.currentPage(), 40).subscribe({
      next: (res) => {
        this.allBrands.set(res.data);
        this.currentPage.set(res.metadata.currentPage);
        this.totalPages.set(res.metadata.numberOfPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  gotoPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.loadBrands();
  }

  onSearch(value: string): void {
    this.activeLetter.set('all');
    this.searchQuery.set(value);
  }

  filterByLetter(letter: string): void {
    this.activeLetter.set(letter);
    this.searchQuery.set('');
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.activeLetter.set('all');
  }

  onImageError(e: Event): void {
    const img = e.target as HTMLImageElement;
    img.onerror = null;
    img.src = BRAND_IMAGE_FALLBACK;
  }
}

const BRAND_IMAGE_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">' +
      '<rect width="80" height="80" fill="#ECE5D2"/>' +
      '<text x="40" y="44" font-size="9" text-anchor="middle" fill="#6B5C7E" font-family="serif">No image</text>' +
      '</svg>',
  );
