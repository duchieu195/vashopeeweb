import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useProductVariants } from '../hooks/useProductVariants';
import { supabase } from '../lib/supabase';
import type { Review, ProductVariant } from '../types';
import ImageGallery from '../components/ImageGallery';
import QuantitySelector from '../components/QuantitySelector';
import ReviewList from '../components/ReviewList';
import VariantSelector from '../components/VariantSelector';
import { useCart } from '../store/cartStore';

function findMatchingVariant(
  variants: ProductVariant[],
  selectedIds: string[]
): ProductVariant | undefined {
  return variants.find(
    (v) =>
      v.isActive &&
      v.optionValueIds.length === selectedIds.length &&
      selectedIds.every((id) => v.optionValueIds.includes(id))
  );
}

function computeVariantLabel(
  variant: ProductVariant,
  groups: ReturnType<typeof useProductVariants>['groups']
): string {
  return [...groups]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((g) => {
      const val = g.values.find((v) => variant.optionValueIds.includes(v.id));
      return val?.value ?? '';
    })
    .filter(Boolean)
    .join(' / ');
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const { addItem, openCart } = useCart();
  const { product, loading, error } = useProduct(id);
  const { groups, variants } = useProductVariants(id, !!product?.hasVariants);

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

  const selectedIds = useMemo(() => Object.values(selected), [selected]);
  const allGroupsSelected = groups.length > 0 && groups.every((g) => selected[g.id]);
  const selectedVariant = allGroupsSelected ? findMatchingVariant(variants, selectedIds) : undefined;

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;
  const displayOrigPrice = selectedVariant?.originalPrice ?? product?.originalPrice;
  const displayImages =
    selectedVariant && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product?.images ?? [];
  const canAddToCart = product?.hasVariants
    ? allGroupsSelected && !!selectedVariant
    : true;

  const addToCartLabel = () => {
    if (added) return '✓ Đã thêm vào giỏ hàng!';
    if (product?.hasVariants && !allGroupsSelected) return 'Vui lòng chọn phân loại';
    return 'Thêm Vào Giỏ Hàng';
  };

  const handleSelect = (groupId: string, valueId: string) => {
    setSelected((prev) => ({ ...prev, [groupId]: valueId }));
  };

  const handleAddToCart = () => {
    if (!product || !canAddToCart) return;

    addItem(
      product,
      quantity,
      selectedVariant
        ? {
            variantId: selectedVariant.id,
            variantLabel: computeVariantLabel(selectedVariant, groups),
            variantPrice: selectedVariant.price,
          }
        : undefined
    );
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

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

  const discount = displayOrigPrice
    ? Math.round((1 - displayPrice / displayOrigPrice) * 100)
    : 0;

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
          <ImageGallery images={displayImages} productName={product.name} />

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
                  {displayPrice.toLocaleString('vi-VN')}₫
                </span>
                {displayOrigPrice && (
                  <>
                    <span className="text-gray-400 line-through text-lg">
                      {displayOrigPrice.toLocaleString('vi-VN')}₫
                    </span>
                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {product.hasVariants && groups.length > 0 && (
              <div className="mb-5">
                <VariantSelector
                  groups={groups}
                  variants={variants}
                  selected={selected}
                  onSelect={handleSelect}
                />
              </div>
            )}

            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm text-gray-600">Số lượng:</span>
              <QuantitySelector quantity={quantity} onChange={setQuantity} />
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`w-full py-3 rounded font-semibold text-white transition-all ${
                added
                  ? 'bg-green-500'
                  : canAddToCart
                  ? 'bg-primary hover:bg-primary-dark'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {addToCartLabel()}
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
