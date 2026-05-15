import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../store/cartStore';
import QRPayment from '../components/QRPayment';

const SHIPPING_KEY = 'vabeauty-shipping-info';
const POLL_INTERVAL = 3000;
const TIMEOUT_MS = 15 * 60 * 1000;

interface ShippingInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

function generateOrderCode(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VA-${ymd}-${rand}`;
}

type Step = 'form' | 'qr' | 'success' | 'expired';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const total = totalPrice();

  const [step, setStep] = useState<Step>('form');
  const [orderCode, setOrderCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MS);
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const [form, setForm] = useState<ShippingInfo>(() => {
    try {
      const saved = localStorage.getItem(SHIPPING_KEY);
      return saved ? JSON.parse(saved) : { name: '', phone: '', email: '', address: '', notes: '' };
    } catch {
      return { name: '', phone: '', email: '', address: '', notes: '' };
    }
  });

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (items.length === 0 && step === 'form') navigate('/');
  }, [items, step, navigate]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const validate = (): boolean => {
    const errs: Partial<ShippingInfo> = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email';
    if (!form.address.trim()) errs.address = 'Vui lòng nhập địa chỉ';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const code = generateOrderCode();

    const { error: orderErr } = await supabase.from('orders').insert({
      payment_code: code,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      shipping_address: form.address,
      notes: form.notes || null,
      total_amount: total,
      status: 'pending',
    });

    if (orderErr) { alert('Lỗi tạo đơn hàng. Vui lòng thử lại.'); return; }

    const { data: orderData } = await supabase
      .from('orders')
      .select('id')
      .eq('payment_code', code)
      .single();

    if (orderData) {
      await supabase.from('order_items').insert(
        items.map((item) => ({
          order_id: orderData.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.images[0] ?? null,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
        }))
      );
    }

    // Save shipping info for next time
    localStorage.setItem(SHIPPING_KEY, JSON.stringify({ ...form, notes: '' }));

    setOrderCode(code);
    setStep('qr');
    startPolling(code);
    startTimer();
  };

  const startPolling = (code: string) => {
    pollRef.current = setInterval(async () => {
      const { data } = await supabase
        .from('orders')
        .select('status')
        .eq('payment_code', code)
        .single();

      if (data?.status === 'paid') {
        stopAll();
        clearCart();
        setStep('success');
      }
    }, POLL_INTERVAL);
  };

  const startTimer = () => {
    const end = Date.now() + TIMEOUT_MS;
    timerRef.current = setInterval(() => {
      const left = end - Date.now();
      if (left <= 0) {
        stopAll();
        setStep('expired');
      } else {
        setTimeLeft(left);
      }
    }, 1000);
  };

  const stopAll = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đặt Hàng Thành Công!</h1>
        <p className="text-gray-500 mb-2">Mã đơn hàng: <strong className="text-gray-800">{orderCode}</strong></p>
        <p className="text-gray-500 text-sm mb-6">Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất.</p>
        <Link to="/" className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded font-semibold transition-colors">
          Tiếp Tục Mua Sắm
        </Link>
      </div>
    );
  }

  if (step === 'expired') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">⏰</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Hết thời gian thanh toán</h1>
        <p className="text-gray-500 text-sm mb-6">
          Nếu bạn đã chuyển tiền, vui lòng liên hệ shop qua SĐT <strong>0909 123 456</strong> và cung cấp mã đơn hàng <strong>{orderCode}</strong>.
        </p>
        <Link to="/" className="text-primary hover:underline text-sm">Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Thanh Toán</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: form or QR */}
        <div>
          {step === 'form' ? (
            <div className="bg-white rounded-sm p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Thông Tin Giao Hàng</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {([
                  { key: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A' },
                  { key: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '0909 123 456' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
                  { key: 'address', label: 'Địa chỉ giao hàng', type: 'text', placeholder: '123 Đường ABC, Quận 1, TP.HCM' },
                ] as const).map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label} <span className="text-red-500">*</span></label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className={`w-full border rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors ${errors[key] ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded font-semibold transition-colors"
                >
                  Đặt Hàng & Thanh Toán
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-sm p-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Thời gian còn lại:</span>
                <span className={`font-mono font-bold text-lg ${timeLeft < 60000 ? 'text-red-500' : 'text-gray-800'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <QRPayment orderCode={orderCode} amount={total} />
              <p className="text-xs text-gray-400 text-center">
                Đang chờ xác nhận thanh toán...
              </p>
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <div className="bg-white rounded-sm p-5 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Đơn Hàng ({items.length} sản phẩm)</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <img src={item.product.images[0]} alt={item.product.name} loading="lazy" className="w-14 h-14 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 line-clamp-2 leading-tight">{item.product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-gray-800 flex-shrink-0">
                  {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
            <span>Tổng cộng</span>
            <span className="text-primary text-lg">{total.toLocaleString('vi-VN')}₫</span>
          </div>
        </div>
      </div>
    </div>
  );
}
