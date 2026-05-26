
export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number; 
  imageUrl: string;
  slug: string; 
}