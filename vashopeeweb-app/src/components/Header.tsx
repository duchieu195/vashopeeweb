import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/cartStore';
import { useCategories } from '../hooks/useCategories';

export default function Header() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems, toggleCart } = useCart();
  const count = totalItems();
  const { categories } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-primary sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Row 1: logo + cart (mobile) | logo + search + cart (desktop) */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex-shrink-0">
            <span className="text-white font-bold text-xl md:text-2xl tracking-tight">
              VA<span className="text-accent">Beauty</span>
            </span>
          </Link>

          {/* Search — desktop only in row 1 */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm mỹ phẩm..."
              className="flex-1 px-4 py-2 rounded-l-sm text-sm outline-none text-gray-800"
            />
            <button
              type="submit"
              className="bg-primary-dark hover:bg-pink-800 text-white px-5 py-2 rounded-r-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex-1 md:hidden" />

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative text-white hover:text-accent transition-colors flex-shrink-0"
            aria-label="Giỏ hàng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: search bar full width — mobile only */}
        <form onSubmit={handleSearch} className="flex md:hidden mt-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 px-3 py-2 rounded-l-sm text-sm outline-none text-gray-800"
          />
          <button
            type="submit"
            className="bg-primary-dark hover:bg-pink-800 text-white px-4 py-2 rounded-r-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Nav links — scrollable on mobile, no page overflow */}
      <div className="bg-primary-dark">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-4 md:gap-6 text-sm text-white/90 py-1.5 whitespace-nowrap">
            <Link to="/" className="hover:text-white transition-colors flex-shrink-0">Trang Chủ</Link>
            <Link to="/products" className="hover:text-white transition-colors flex-shrink-0">Tất Cả Sản Phẩm</Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="hover:text-white transition-colors flex-shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
