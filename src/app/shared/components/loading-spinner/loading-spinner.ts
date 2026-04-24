// Owner: Mina — feature: shared/loading-spinner
import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
  private readonly loading = inject(LoadingService);
  readonly visible = this.loading.visible;
}
