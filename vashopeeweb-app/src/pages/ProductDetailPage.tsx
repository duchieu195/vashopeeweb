import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { supabase } from '../lib/supabase';
import type { Review } from '../types';
import ImageGallery from '../components/ImageGallery';
import QuantitySelector from '../components/QuantitySelector';
import ReviewList from '../components/ReviewList';
import { useCart } from '../store/cartStore';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { addItem, openCart } = useCart();
  const { product, loading, error } = useProduct(id);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('reviews')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(
          (data ?? []).map((r) => ({
            id: r.id,
            productId: r.product_id,
            author: r.author,
            rating: r.rating,
            comment: r.comment,
            date: r.created_at?.slice(0, 10) ?? '',
          }))
        );
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-sm p-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'not_found' || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h1>
        <p className="text-gray-500 mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
        <Link to="/products" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded font-semibold transition-colors">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <nav className="text-sm text-gray-400 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>›</span>
        <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
        <span>›</span>
        <span className="text-gray-600 line-clamp-1">{product.name}</span>
      </nav>

      <div className="bg-white rounded-sm p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageGallery images={product.images} productName={product.name} />

          <div>
            <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
            <h1 className="text-xl font-semibold text-gray-800 mb-3 leading-snug">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500">{product.rating} ({product.reviewCount} đánh giá)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">Đã bán {product.soldCount.toLocaleString()}</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-lg">
                      {product.originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm text-gray-600">Số lượng:</span>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded font-semibold text-white transition-all ${added ? 'bg-green-500' : 'bg-primary hover:bg-primary-dark'}`}
            >
              {added ? '✓ Đã thêm vào giỏ hàng!' : 'Thêm Vào Giỏ Hàng'}
            </button>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Mô Tả Sản Phẩm</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              {product.ingredients && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Thành Phần:</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{product.ingredients}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm p-4 md:p-6 mt-4">
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
