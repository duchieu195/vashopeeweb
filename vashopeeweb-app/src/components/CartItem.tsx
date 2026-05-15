import type { CartItem } from '../types';
import { useCart } from '../store/cartStore';

interface Props {
  item: CartItem;
}

export default function CartItemComponent({ item }: Props) {
  const { removeItem, updateQuantity } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex gap-3 py-3 border-b last:border-0">
      <img
        src={product.images[0]}
        alt={product.name}
        loading="lazy"
        className="w-16 h-16 object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">{product.name}</p>
        <p className="text-primary font-semibold text-sm mt-1">
          {product.price.toLocaleString('vi-VN')}₫
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors text-sm"
          >
            −
          </button>
          <span className="text-sm font-medium w-6 text-center">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-gray-600 hover:border-primary hover:text-primary transition-colors text-sm"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => removeItem(product.id)}
        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 self-start mt-1"
        aria-label="Xóa sản phẩm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
