import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }

    let cancelled = false;

    async function fetchProduct() {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (cancelled) return;

      if (err) {
        setError(err.code === 'PGRST116' ? 'not_found' : err.message);
        setProduct(null);
      } else {
        setProduct({
          id: data.id,
          name: data.name,
          brand: data.brand,
          categoryId: data.category_id,
          price: data.price,
          originalPrice: data.original_price ?? undefined,
          images: data.images ?? [],
          rating: Number(data.rating),
          reviewCount: data.review_count,
          soldCount: data.sold_count,
          description: data.description,
          ingredients: data.ingredients ?? undefined,
          isNew: data.is_new,
          isBestSeller: data.is_best_seller,
        });
      }
      setLoading(false);
    }

    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  return { product, loading, error };
}
