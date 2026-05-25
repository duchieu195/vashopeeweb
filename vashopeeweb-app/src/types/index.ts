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
  hasVariants?: boolean;
}

export interface ProductOptionValue {
  id: string;
  groupId: string;
  value: string;
  displayOrder: number;
}

export interface ProductOptionGroup {
  id: string;
  productId: string;
  name: string;
  displayOrder: number;
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  images: string[];
  isActive: boolean;
  optionValueIds: string[];
}

export interface CartItem {
  product: Product;
  variantId?: string;
  variantLabel?: string;
  variantPrice?: number;
  quantity: number;
}
