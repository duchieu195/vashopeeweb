import { supabaseClient } from '../../lib/supabase';
import type { OptionGroupDraft } from './OptionGroupBuilder';
import type { VariantDraft } from './VariantTable';

export async function saveProductVariants(
  productId: string,
  hasVariants: boolean,
  groups: OptionGroupDraft[],
  variants: VariantDraft[]
): Promise<void> {
  if (!hasVariants) {
    // Deactivate all variants when switching off
    await supabaseClient
      .from('product_variants')
      .update({ is_active: false })
      .eq('product_id', productId);
    return;
  }

  // 1. Upsert option groups
  const activeGroups = groups.filter((g) => !g.isDeleted);
  const deletedGroupIds = groups.filter((g) => g.isDeleted && !g.isNew).map((g) => g.id);

  if (deletedGroupIds.length > 0) {
    // Deleting a group cascades to its values and deactivates variants via app logic
    await supabaseClient
      .from('product_option_groups')
      .delete()
      .in('id', deletedGroupIds);
  }

  for (const group of activeGroups) {
    if (group.isNew) {
      const { data } = await supabaseClient
        .from('product_option_groups')
        .insert({ product_id: productId, name: group.name, display_order: group.displayOrder })
        .select('id')
        .single();
      if (data) {
        // Remap group id for value inserts below
        group.id = data.id;
      }
    } else {
      await supabaseClient
        .from('product_option_groups')
        .update({ name: group.name, display_order: group.displayOrder })
        .eq('id', group.id);
    }

    // 2. Upsert option values for this group
    const activeValues = group.values.filter((v) => !v.isDeleted);
    const deletedValueIds = group.values.filter((v) => v.isDeleted && !v.isNew).map((v) => v.id);

    if (deletedValueIds.length > 0) {
      // Soft-deactivate variants that use these values before deleting
      const { data: affectedJunctions } = await supabaseClient
        .from('product_variant_options')
        .select('variant_id')
        .in('option_value_id', deletedValueIds);

      if (affectedJunctions && affectedJunctions.length > 0) {
        const variantIds = affectedJunctions.map((j) => j.variant_id);
        await supabaseClient
          .from('product_variants')
          .update({ is_active: false })
          .in('id', variantIds);
      }

      await supabaseClient
        .from('product_option_values')
        .delete()
        .in('id', deletedValueIds);
    }

    for (const val of activeValues) {
      if (val.isNew) {
        const { data } = await supabaseClient
          .from('product_option_values')
          .insert({ group_id: group.id, value: val.value, display_order: val.displayOrder })
          .select('id')
          .single();
        if (data) val.id = data.id;
      } else {
        await supabaseClient
          .from('product_option_values')
          .update({ value: val.value, display_order: val.displayOrder })
          .eq('id', val.id);
      }
    }
  }

  // 3. Upsert variants
  const activeVariants = variants.filter((v) => !v.isDeleted);
  const deletedVariantIds = variants.filter((v) => v.isDeleted && !v.isNew).map((v) => v.id);

  if (deletedVariantIds.length > 0) {
    await supabaseClient
      .from('product_variants')
      .update({ is_active: false })
      .in('id', deletedVariantIds);
  }

  for (const variant of activeVariants) {
    const variantPayload = {
      product_id: productId,
      sku: variant.sku || null,
      price: variant.price,
      original_price: variant.originalPrice ?? null,
      stock_quantity: variant.stockQuantity,
      images: variant.images,
      is_active: variant.isActive,
    };

    if (variant.isNew) {
      const { data } = await supabaseClient
        .from('product_variants')
        .insert(variantPayload)
        .select('id')
        .single();

      if (data) {
        variant.id = data.id;
        // Insert junction rows
        const junctionRows = variant.optionValueIds.map((ovId) => ({
          variant_id: data.id,
          option_value_id: ovId,
        }));
        if (junctionRows.length > 0) {
          await supabaseClient.from('product_variant_options').insert(junctionRows);
        }
      }
    } else {
      await supabaseClient
        .from('product_variants')
        .update(variantPayload)
        .eq('id', variant.id);
    }
  }

  // 4. Update products.price = min(active variant prices)
  const activePrices = activeVariants.filter((v) => v.isActive).map((v) => v.price);
  if (activePrices.length > 0) {
    const minPrice = Math.min(...activePrices);
    await supabaseClient
      .from('products')
      .update({ price: minPrice })
      .eq('id', productId);
  }
}
