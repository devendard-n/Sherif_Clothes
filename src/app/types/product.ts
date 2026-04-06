export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;

  price: number;
  offerprice?: number;

  stock: number;

  images: string[];

  description: string;

  sizes: string[];

 colors: string[]

  isfeaturedproduct: boolean;
  badge?: string;
}