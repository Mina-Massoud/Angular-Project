// // Owner: Noura — feature: categories/model
// export interface Category {
//   _id: string;
//   name: string;
//   slug: string;
//   image: string;
//   // TODO: Noura — extend per API response
// }


// core/models/category.model.ts

export interface Category {
  _id:       string;
  name:      string;
  slug:      string;
  image:     string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  results:  number;
  metadata: {
    currentPage:   number;
    numberOfPages: number;
    limit:         number;
  };
  data: Category[];
}