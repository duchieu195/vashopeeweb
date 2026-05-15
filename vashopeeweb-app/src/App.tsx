import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
              <p className="text-6xl mb-4">404</p>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Trang không tồn tại</h1>
              <a href="/" className="text-primary hover:underline">Về trang chủ</a>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
