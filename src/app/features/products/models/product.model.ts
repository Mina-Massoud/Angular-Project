// Owner: Youssef — feature: products/model
export interface Product {
  _id: string;
  title: string;
  description?: string;
  imageCover: string;
  images?: string[];
  price: number;
  priceAfterDiscount?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  quantity?: number;
  sold?: number;
  category?: { _id: string; name: string; slug: string };
  brand?: { _id: string; name: string; slug: string };
  // TODO: Youssef — extend per API response
}
