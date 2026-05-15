import { useCart } from '../store/cartStore';
import CartItemComponent from './CartItem';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { items, isOpen, closeCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={closeCart} />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b bg-primary text-white">
          <h2 className="font-semibold text-lg">Giỏ Hàng ({items.length})</h2>
          <button onClick={closeCart} className="hover:text-accent transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">Giỏ hàng trống</p>
              <button onClick={closeCart} className="text-primary text-sm font-medium hover:underline">
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemComponent key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t px-4 py-4 space-y-3">
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Tổng tiền:</span>
              <span className="text-primary text-lg">{totalPrice().toLocaleString('vi-VN')}₫</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded font-semibold transition-colors"
            >
              Thanh Toán
            </button>
          </div>
        )}
      </div>
    </>
  );
}
