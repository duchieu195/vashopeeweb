import type { Review } from '../types';

interface Props {
  reviews: Review[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-800 text-lg mb-4">
        Đánh Giá Sản Phẩm ({reviews.length})
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {review.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{review.author}</p>
                <div className="flex items-center gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
