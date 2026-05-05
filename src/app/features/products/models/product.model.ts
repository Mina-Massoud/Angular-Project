// Owner: Youssef — feature: products/model
export interface Product {
  _id: string;

  title: string;
  slug: string;
  description?: string;

  imageCover: string;
  images?: string[];

  price: number;
  priceAfterDiscount?: number;

  quantity?: number;
  sold?: number;

  ratingsAverage?: number;
  ratingsQuantity?: number;

  category?: {
    _id: string;
    name: string;
    slug: string;
    image?: string;
  };

  brand?: {
    _id: string;
    name: string;
    slug: string;
    image?: string;
  };

  createdAt?: string;
  updatedAt?: string;
}
