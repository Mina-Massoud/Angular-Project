// Owner: Noura — feature: categories/list
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [],
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

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

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
    this.loadCategories();
  }
}
