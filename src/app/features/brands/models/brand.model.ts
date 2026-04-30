// // Owner: Noura — feature: brands/model
// export interface Brand {
//   _id: string;
//   name: string;
//   slug: string;
//   image: string;
//   // TODO: Noura — extend per API response
// }


// models/brand.model.ts

export interface Brand {
  _id:       string;
  name:      string;
  slug:      string;
  image:     string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandsResponse {
  results:  number;
  metadata: {
    currentPage:   number;
    numberOfPages: number;
    limit:         number;
  };
  data: Brand[];
}
