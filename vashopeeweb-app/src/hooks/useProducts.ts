import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

interface UseProductsOptions {
  categorySlug?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'popular' | 'price-asc' | 'price-desc' | 'newest';
  isBestSeller?: boolean;
  isNew?: boolean;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    categorySlug,
    query,
    minPrice = 0,
    maxPrice = Infinity,
    sort = 'popular',
    isBestSeller,
    isNew,
    limit,
  } = options;

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        let q = supabase
          .from('products')
          .select('*, categories!inner(slug)');

        if (categorySlug) {
          q = q.eq('categories.slug', categorySlug);
        }
        if (query) {
          q = q.or(`name.ilike.%${query}%,brand.ilike.%${query}%`);
        }
        if (minPrice > 0) q = q.gte('price', minPrice);
        if (maxPrice < Infinity) q = q.lte('price', maxPrice);
        if (isBestSeller !== undefined) q = q.eq('is_best_seller', isBestSeller);
        if (isNew !== undefined) q = q.eq('is_new', isNew);

        switch (sort) {
          case 'price-asc':  q = q.order('price', { ascending: true }); break;
          case 'price-desc': q = q.order('price', { ascending: false }); break;
          case 'newest':     q = q.order('created_at', { ascending: false }); break;
          default:           q = q.order('sold_count', { ascending: false });
        }

        if (limit) q = q.limit(limit);

        const { data, error: err } = await q;

        if (cancelled) return;
        if (err) throw err;

        setProducts((data ?? []).map(mapRow));
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Lỗi tải sản phẩm');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [categorySlug, query, minPrice, maxPrice, sort, isBestSeller, isNew, limit]);

  return { products, loading, error };
}

// Map Supabase snake_case row → Product type
function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    brand: row.brand as string,
    categoryId: row.category_id as string,
    price: row.price as number,
    originalPrice: row.original_price as number | undefined,
    images: (row.images as string[]) ?? [],
    rating: Number(row.rating),
    reviewCount: row.review_count as number,
    soldCount: row.sold_count as number,
    description: row.description as string,
    ingredients: row.ingredients as string | undefined,
    isNew: row.is_new as boolean,
    isBestSeller: row.is_best_seller as boolean,
  };
}
