import { useCategories } from '../hooks/useCategories';

interface Props {
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
  onCategoryChange: (cat: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
}

const priceRanges = [
  { label: 'Tất cả', min: 0, max: Infinity },
  { label: 'Dưới 200k', min: 0, max: 200000 },
  { label: '200k - 500k', min: 200000, max: 500000 },
  { label: '500k - 1 triệu', min: 500000, max: 1000000 },
  { label: 'Trên 1 triệu', min: 1000000, max: Infinity },
];

export default function FilterSidebar({
  selectedCategory,
  minPrice,
  maxPrice,
  onCategoryChange,
  onPriceChange,
  onReset,
}: Props) {
  const { categories } = useCategories();
  const activePriceRange = priceRanges.find(
    (r) => r.min === minPrice && r.max === maxPrice
  );

  return (
    <aside className="bg-white rounded-sm p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Bộ Lọc</h3>
        <button
          onClick={onReset}
          className="text-xs text-primary hover:underline"
        >
          Xóa bộ lọc
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Danh Mục</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ''}
              onChange={() => onCategoryChange('')}
              className="accent-primary"
            />
            <span className="text-sm text-gray-600">Tất cả</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.slug}
                onChange={() => onCategoryChange(cat.slug)}
                className="accent-primary"
              />
              <span className="text-sm text-gray-600">{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Khoảng Giá</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={activePriceRange?.label === range.label}
                onChange={() => onPriceChange(range.min, range.max)}
                className="accent-primary"
              />
              <span className="text-sm text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
