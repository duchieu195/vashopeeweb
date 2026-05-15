import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown, { type SortOption } from '../components/SortDropdown';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import ProductGridSkeleton from '../components/ProductGridSkeleton';

const PAGE_SIZE = 12;

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => { setPage(1); }, [query, category, sort, minPrice, maxPrice]);

  const { products, loading } = useProducts({
    categorySlug: category || undefined,
    query: query || undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < Infinity ? maxPrice : undefined,
    sort,
  });

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page]
  );

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

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              {!loading && <span>{products.length} sản phẩm</span>}
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : paginated.length === 0 ? (
            <div className="bg-white rounded-sm p-12 text-center">
              <p className="text-gray-400 text-lg mb-2">Không tìm thấy sản phẩm</p>
              <p className="text-gray-400 text-sm mb-4">Thử thay đổi từ khóa hoặc bộ lọc</p>
              <button onClick={handleReset} className="text-primary text-sm hover:underline">
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <ProductGrid products={paginated} />
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
