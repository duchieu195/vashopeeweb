import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../store/cartStore';

interface Props {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 ${star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }: Props) {
  const { addItem, openCart } = useCart();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow group block"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {product.isNew && !discount && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            MỚI
          </span>
        )}
      </div>

      <div className="p-2.5">
        <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
        <p className="text-sm text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-primary font-semibold text-sm">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-primary hover:bg-primary-dark text-white text-xs font-medium px-2 py-1 rounded transition-colors"
            title="Thêm vào giỏ hàng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Thêm
          </button>
        </div>
      </div>
    </Link>
  );
}
