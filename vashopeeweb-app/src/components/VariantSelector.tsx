import type { ProductOptionGroup, ProductVariant } from '../types';

interface Props {
  groups: ProductOptionGroup[];
  variants: ProductVariant[];
  selected: Record<string, string>;
  onSelect: (groupId: string, valueId: string) => void;
}

function isValueOutOfStock(
  groupId: string,
  valueId: string,
  selected: Record<string, string>,
  groups: ProductOptionGroup[],
  variants: ProductVariant[]
): boolean {
  const hypothetical = { ...selected, [groupId]: valueId };
  const allGroupIds = groups.map((g) => g.id);
  const fullySelected = allGroupIds.every((id) => hypothetical[id]);
  if (!fullySelected) return false;

  const match = variants.find(
    (v) =>
      v.isActive &&
      allGroupIds.every((gId) => {
        const group = groups.find((g) => g.id === gId);
        const valId = hypothetical[gId];
        return group?.values.some((val) => val.id === valId && v.optionValueIds.includes(val.id));
      })
  );

  return !match || match.stockQuantity === 0;
}

export default function VariantSelector({ groups, variants, selected, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {groups.map((group) => (
        <div key={group.id}>
          <p className="text-sm font-medium text-gray-700 mb-2">{group.name}</p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((val) => {
              const isSelected = selected[group.id] === val.id;
              const outOfStock = isValueOutOfStock(group.id, val.id, selected, groups, variants);

              return (
                <button
                  key={val.id}
                  onClick={() => !outOfStock && onSelect(group.id, val.id)}
                  disabled={outOfStock}
                  className={[
                    'px-3 py-1.5 rounded border text-sm transition-colors',
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : outOfStock
                      ? 'border-gray-200 bg-gray-50 text-gray-300 line-through cursor-not-allowed'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary',
                  ].join(' ')}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
