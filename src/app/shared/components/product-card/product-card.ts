// Owner: Youssef — feature: shared/product-card
import { Component, input } from '@angular/core';
import { Product } from '../../../features/products/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  // Reused by products list, wishlist, cart, category detail.
  readonly product = input.required<Product>();
  // TODO: Youssef — emit add-to-cart / add-to-wishlist outputs
}
