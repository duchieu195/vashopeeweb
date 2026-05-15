import { useState, useEffect, useCallback } from 'react';

const banners = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/banner1/1200/400',
    title: 'Mỹ Phẩm Chính Hãng',
    subtitle: 'Giảm đến 30% cho đơn hàng đầu tiên',
    bg: 'from-pink-500 to-rose-400',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/banner2/1200/400',
    title: 'Serum & Dưỡng Da',
    subtitle: 'Bộ sưu tập mới nhất từ các thương hiệu hàng đầu',
    bg: 'from-purple-500 to-pink-400',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/banner3/1200/400',
    title: 'Flash Sale Cuối Tuần',
    subtitle: 'Ưu đãi đặc biệt — chỉ trong 48 giờ',
    bg: 'from-rose-500 to-orange-400',
  },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), []);
  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden rounded-sm">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`min-w-full h-48 md:h-64 bg-gradient-to-r ${banner.bg} flex items-center relative`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 px-10 text-white">
              <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
              <p className="text-sm md:text-base opacity-90">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Prev/Next */}
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

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
