// Owner: Mina — feature: shared/pagination
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type PageItem = number | 'ellipsis';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageWindow = input(5);

  pageChange = output<number>();

  items = computed<PageItem[]>(() => {
    const total = Math.max(0, this.totalPages());
    const current = Math.min(Math.max(1, this.currentPage()), total || 1);
    if (total <= 0) return [];

    const window = Math.max(3, this.pageWindow());
    if (total <= window + 2) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(window / 2);
    let start = Math.max(2, current - half);
    let end = Math.min(total - 1, start + window - 1);
    if (end - start + 1 < window) {
      start = Math.max(2, end - window + 1);
    }

    const out: PageItem[] = [1];
    if (start > 2) out.push('ellipsis');
    for (let i = start; i <= end; i++) out.push(i);
    if (end < total - 1) out.push('ellipsis');
    out.push(total);
    return out;
  });

  isPrevDisabled = computed(() => this.currentPage() <= 1);
  isNextDisabled = computed(() => this.currentPage() >= this.totalPages());

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  prev(): void {
    this.goTo(this.currentPage() - 1);
  }
  next(): void {
    this.goTo(this.currentPage() + 1);
  }
}
