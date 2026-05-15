import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';

export default function CategoryGrid() {
  const navigate = useNavigate();
  const { categories } = useCategories();

  return (
    <div className="bg-white rounded-sm p-4">
      <h2 className="font-semibold text-gray-800 mb-4 text-base">Danh Mục Sản Phẩm</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/products?category=${cat.slug}`)}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-pink-50 transition-colors group"
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-xs text-gray-600 group-hover:text-primary font-medium text-center leading-tight">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
