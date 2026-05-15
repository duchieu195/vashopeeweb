import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
