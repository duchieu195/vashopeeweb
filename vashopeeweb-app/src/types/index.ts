export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  description: string;
  ingredients?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
