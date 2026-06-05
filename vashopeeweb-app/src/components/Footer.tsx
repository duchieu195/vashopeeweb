import { siteConfig } from '../config/siteConfig';
import Logo from '../assets/logo.svg';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src={Logo} alt="VAbeauty" className="h-8 w-auto brightness-0 invert mb-3" />
          <p className="text-sm leading-relaxed">{siteConfig.description}</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Kết Nối Với VA</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://zalo.me/0941244190" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-400 transition-colors">
                <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="24" fill="#0068FF"/>
                    <path d="M10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24C38 31.732 31.732 38 24 38C21.5 38 19.15 37.32 17.13 36.13L10 38L11.87 31.13C10.68 29.1 10 26.65 10 24Z" fill="white"/>
                    <path d="M17 22H31M17 26H25" stroke="#0068FF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                Zalo
              </a>
            </li>
            <li>
              <a href="https://vn.shp.ee/ph6JjGZJ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-400 transition-colors">
                <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 48 48" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="24" fill="#EE4D2D"/>
                    <path d="M24 10C18.477 10 14 14.477 14 20C14 23.3 15.6 26.22 18.06 28.06L16 38L25.06 33.46C24.71 33.49 24.36 33.5 24 33.5C18.477 33.5 14 29.023 14 23.5" fill="none"/>
                    <path d="M33 17H15L16.5 28H31.5L33 17Z" fill="white"/>
                    <path d="M20 17V15C20 13.343 21.343 12 23 12H25C26.657 12 28 13.343 28 15V17" stroke="white" strokeWidth="2" fill="none"/>
                    <circle cx="21" cy="23" r="1.5" fill="#EE4D2D"/>
                    <circle cx="27" cy="23" r="1.5" fill="#EE4D2D"/>
                  </svg>
                </span>
                Shopee
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/share/1B9nAZzGoV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-400 transition-colors">
                <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 48 48" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="24" fill="#1877F2"/>
                    <path d="M26.5 38V25.5H30.5L31 21H26.5V18.5C26.5 17.5 27 17 28 17H31V13C30 12.9 28.7 12.8 27 12.8C23.5 12.8 21 15 21 18.8V21H17V25.5H21V38H26.5Z" fill="white"/>
                  </svg>
                </span>
                Fanpage
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Liên Hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 {siteConfig.address}</li>
            <li>📞 {siteConfig.phone}</li>
            <li>✉️ {siteConfig.email}</li>
            <li>🕐 {siteConfig.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        {siteConfig.copyright}
      </div>
    </footer>
  );
}
