import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown, { type SortOption } from '../components/SortDropdown';
import ProductGrid from '../components/ProductGrid';
import ProductGridSkeleton from '../components/ProductGridSkeleton';

const PAGE_SIZE = 30;

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortOption>('popular');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => { setVisible(PAGE_SIZE); }, [query, category, sort, minPrice, maxPrice]);

  const { products, loading } = useProducts({
    categorySlug: category || undefined,
    query: query || undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < Infinity ? maxPrice : undefined,
    sort,
  });

  const shown = products.slice(0, visible);
  const hasMore = visible < products.length;

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat) params.set('category', cat);
    else params.delete('category');
    params.delete('q');
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
    setMinPrice(0);
    setMaxPrice(Infinity);
    setSort('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-4">
        <div className="hidden md:block w-56 flex-shrink-0">
          <FilterSidebar
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onCategoryChange={handleCategoryChange}
            onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
            onReset={handleReset}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-sm px-4 py-3 flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="text-sm text-gray-500">
              {query && <span>Kết quả cho "<strong className="text-gray-800">{query}</strong>" — </span>}
              {!loading && (
                <span>
                  Hiển thị <strong className="text-gray-800">{shown.length}</strong>
                  {' / '}{products.length} sản phẩm
                </span>
              )}
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {loading ? (
            <ProductGridSkeleton count={30} />
          ) : shown.length === 0 ? (
            <div className="bg-white rounded-sm p-12 text-center">
              <p className="text-gray-400 text-lg mb-2">Không tìm thấy sản phẩm</p>
              <p className="text-gray-400 text-sm mb-4">Thử thay đổi từ khóa hoặc bộ lọc</p>
              <button onClick={handleReset} className="text-primary text-sm hover:underline">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={shown} />

              {hasMore && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-1 max-w-xs">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((shown.length / products.length) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {shown.length}/{products.length} sản phẩm
                  </p>
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="mt-1 px-8 py-2.5 border border-primary text-primary text-sm font-medium rounded hover:bg-primary hover:text-white transition-colors"
                  >
                    Xem thêm
                  </button>
                </div>
              )}

              {!hasMore && products.length > PAGE_SIZE && (
                <p className="mt-6 text-center text-xs text-gray-400">
                  Đã hiển thị tất cả {products.length} sản phẩm
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
