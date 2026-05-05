// Owner: Youssef — feature: shared/product-card
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../features/products/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly showNewDot = input<boolean>(false);

  secondaryImage = computed(() => {
    const p = this.product();
    return p.images?.find((img) => img !== p.imageCover) ?? null;
  });

  displayPrice = computed(() => {
    const p = this.product();
    return p.priceAfterDiscount ?? p.price;
  });
}
