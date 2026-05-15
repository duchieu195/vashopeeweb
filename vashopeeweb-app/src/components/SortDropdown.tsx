export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest';

interface Props {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Phổ biến nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
];

export default function SortDropdown({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 whitespace-nowrap">Sắp xếp:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="text-sm border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-primary cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
