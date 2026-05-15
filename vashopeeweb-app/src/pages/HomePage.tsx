import BannerCarousel from '../components/BannerCarousel';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { products: bestSellers, loading: loadingBest } = useProducts({ isBestSeller: true, limit: 8, sort: 'popular' });
  const { products: newest, loading: loadingNew } = useProducts({ isNew: true, limit: 8, sort: 'newest' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      <BannerCarousel />
      <CategoryGrid />

      <section className="bg-white rounded-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg uppercase tracking-wide border-b-2 border-primary pb-1">
            🔥 Bán Chạy Nhất
          </h2>
          <Link to="/products" className="text-primary text-sm hover:underline">Xem tất cả →</Link>
        </div>
        {loadingBest ? <ProductGridSkeleton count={8} /> : <ProductGrid products={bestSellers} />}
      </section>

      <section className="bg-white rounded-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg uppercase tracking-wide border-b-2 border-green-500 pb-1">
            ✨ Sản Phẩm Mới
          </h2>
          <Link to="/products" className="text-primary text-sm hover:underline">Xem tất cả →</Link>
        </div>
        {loadingNew ? <ProductGridSkeleton count={8} /> : <ProductGrid products={newest} />}
      </section>
    </div>
  );
}
