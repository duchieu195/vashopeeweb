import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setCategories(
          (data ?? []).map((r) => ({
            id: r.id,
            name: r.name,
            icon: r.icon,
            slug: r.slug,
          }))
        );
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}
