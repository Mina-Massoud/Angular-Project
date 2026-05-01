// Owner: Noura — feature: categories/list
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css',
})
export class CategoriesList {
  // TODO: Noura — fetch + display all categories
  //services injected categories.service.ts
  private readonly categoriesService = inject(CategoriesService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  //properties:
  categories: Category[] = [];
  currentPage: number = 1;
  limit: number = 8;
  totalPages: number = 0;
  pages: number[] = [];


  //methods:
  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.getAllCategories(this.currentPage, this.limit).subscribe({
      next: (res) => {
        this.categories = res.data;
        this.totalPages = res.metadata.numberOfPages;
        this.pages = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
        console.log(res.data);
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    })
  }

  //pagination methods:
  goToPage(p: number) {
    this.currentPage = p;
    this.loadCategories();
  }
}