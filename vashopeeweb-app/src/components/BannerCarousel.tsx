import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
}

const FALLBACK_BANNERS: Banner[] = [
  { id: '1', image_url: 'https://picsum.photos/seed/banner1/1200/400', title: 'Mỹ Phẩm Chính Hãng', subtitle: 'Giảm đến 30% cho đơn hàng đầu tiên' },
  { id: '2', image_url: 'https://picsum.photos/seed/banner2/1200/400', title: 'Serum & Dưỡng Da', subtitle: 'Bộ sưu tập mới nhất từ các thương hiệu hàng đầu' },
  { id: '3', image_url: 'https://picsum.photos/seed/banner3/1200/400', title: 'Flash Sale Cuối Tuần', subtitle: 'Ưu đãi đặc biệt — chỉ trong 48 giờ' },
];

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from('banners')
      .select('id, title, subtitle, image_url')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setBanners(data && data.length > 0 ? data : FALLBACK_BANNERS);
      });
  }, []);

  const displayBanners = banners.length > 0 ? banners : FALLBACK_BANNERS;

  const next = useCallback(() => setCurrent((c) => (c + 1) % displayBanners.length), [displayBanners.length]);
  const prev = () => setCurrent((c) => (c - 1 + displayBanners.length) % displayBanners.length);

  useEffect(() => {
    setCurrent(0);
  }, [displayBanners.length]);

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, displayBanners.length]);

  return (
    <div className="relative overflow-hidden rounded-sm">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {displayBanners.map((banner) => (
          <div key={banner.id} className="min-w-full h-48 md:h-64 relative">
            <img
              src={banner.image_url}
              alt={banner.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-center px-10 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
              {banner.subtitle && (
                <p className="text-sm md:text-base opacity-90">{banner.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayBanners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
