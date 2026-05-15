interface Props {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ quantity, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="flex items-center border border-gray-300 rounded w-fit">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <input
        type="number"
        value={quantity}
        min={min}
        max={max}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val)) onChange(Math.min(max, Math.max(min, val)));
        }}
        className="w-12 h-9 text-center text-sm font-medium border-x border-gray-300 outline-none"
      />
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}
