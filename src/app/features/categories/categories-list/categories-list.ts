// Owner: Noura — feature: categories/list
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category.model';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [Pagination, RouterLink],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css',
})
export class CategoriesList implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  categories = signal<Category[]>([]);
  isLoading = signal(true);
  hasError = signal(false);
  currentPage = signal(1);
  totalPages = signal(0);

  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  private readonly limit = 8;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.categoriesService.getAllCategories(this.currentPage(), this.limit).subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.totalPages.set(res.metadata.numberOfPages);
        this.isLoading.set(false);
      },
      error: () => {
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
    this.loadCategories();
  }

  tileLabel(i: number): string {
    return ((this.currentPage() - 1) * this.limit + i + 1).toString().padStart(2, '0');
  }
}
