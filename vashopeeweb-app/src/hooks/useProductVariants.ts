import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { ProductOptionGroup, ProductVariant } from '../types';

interface UseProductVariantsResult {
  groups: ProductOptionGroup[];
  variants: ProductVariant[];
  loading: boolean;
}

export function useProductVariants(productId: string | undefined, _enabled?: boolean): UseProductVariantsResult {
  const [groups, setGroups] = useState<ProductOptionGroup[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!productId) {
      setGroups([]);
      setVariants([]);
      return;
    }

    cancelledRef.current = false;

    async function load() {
      setLoading(true);

      const [groupsRes, variantsRes] = await Promise.all([
        supabase
          .from('product_option_groups')
          .select('*, product_option_values(*)')
          .eq('product_id', productId)
          .order('display_order'),
        supabase
          .from('product_variants')
          .select('id, product_id, sku, price, original_price, stock_quantity, images, is_active, product_variant_options(option_value_id)')
          .eq('product_id', productId),
      ]);

      if (cancelledRef.current) return;

      if (groupsRes.data) {
        const mapped: ProductOptionGroup[] = groupsRes.data.map((g) => ({
          id: g.id,
          productId: g.product_id,
          name: g.name,
          displayOrder: g.display_order,
          values: (g.product_option_values ?? [])
            .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
            .map((v: { id: string; group_id: string; value: string; display_order: number }) => ({
              id: v.id,
              groupId: v.group_id,
              value: v.value,
              displayOrder: v.display_order,
            })),
        }));
        setGroups(mapped);
      }

      if (variantsRes.data) {
        const mapped: ProductVariant[] = variantsRes.data.map((v) => ({
          id: v.id,
          productId: v.product_id,
          sku: v.sku ?? undefined,
          price: v.price,
          originalPrice: v.original_price ?? undefined,
          stockQuantity: v.stock_quantity,
          images: v.images ?? [],
          isActive: v.is_active,
          optionValueIds: (v.product_variant_options ?? []).map(
            (o: { option_value_id: string }) => o.option_value_id
          ),
        }));
        setVariants(mapped);
      }

      setLoading(false);
    }

    load();
    return () => { cancelledRef.current = true; };
  }, [productId]);

  return { groups, variants, loading };
}
