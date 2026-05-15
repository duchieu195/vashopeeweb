import type { Review } from '../types';

const reviewTemplates = [
  { author: 'Nguyễn Thị Lan', comment: 'Sản phẩm rất tốt, dùng được một tuần thấy da cải thiện rõ rệt. Sẽ mua lại!', rating: 5 },
  { author: 'Trần Minh Châu', comment: 'Chất lượng ổn, giá hợp lý. Giao hàng nhanh, đóng gói cẩn thận.', rating: 4 },
  { author: 'Lê Thị Hoa', comment: 'Mình da nhạy cảm dùng không bị kích ứng. Rất hài lòng với sản phẩm này.', rating: 5 },
  { author: 'Phạm Thu Hương', comment: 'Sản phẩm đúng như mô tả, mùi thơm dễ chịu. Sẽ giới thiệu cho bạn bè.', rating: 4 },
  { author: 'Hoàng Thị Mai', comment: 'Dùng được 2 tuần thấy hiệu quả rõ ràng. Texture nhẹ, thấm nhanh.', rating: 5 },
  { author: 'Vũ Thị Ngọc', comment: 'Hàng chính hãng, chất lượng tốt. Tuy nhiên giá hơi cao so với mặt bằng chung.', rating: 4 },
  { author: 'Đặng Thị Linh', comment: 'Mình mua lần thứ 3 rồi, sản phẩm này thực sự hiệu quả!', rating: 5 },
  { author: 'Bùi Thị Thanh', comment: 'Sản phẩm ổn, nhưng mình thấy cần dùng lâu hơn mới thấy rõ hiệu quả.', rating: 3 },
  { author: 'Ngô Thị Bích', comment: 'Rất thích sản phẩm này! Da mình sau khi dùng mềm mịn hơn hẳn.', rating: 5 },
  { author: 'Đinh Thị Yến', comment: 'Chất lượng tốt, đóng gói đẹp. Phù hợp làm quà tặng.', rating: 4 },
];

const dates = [
  '2024-01-15', '2024-02-20', '2024-03-10', '2024-04-05',
  '2024-05-18', '2024-06-22', '2024-07-08', '2024-08-14',
  '2024-09-30', '2024-10-12',
];

export const reviews: Review[] = [];

const productIds = ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10',
  'p11','p12','p13','p14','p15','p16','p17','p18','p19','p20',
  'p21','p22','p23','p24','p25','p26','p27','p28','p29','p30'];

let reviewId = 1;
productIds.forEach((productId) => {
  const count = 3 + Math.floor(Math.random() * 3); // 3-5 reviews
  for (let i = 0; i < count; i++) {
    const template = reviewTemplates[(reviewId - 1) % reviewTemplates.length];
    reviews.push({
      id: `r${reviewId}`,
      productId,
      author: template.author,
      rating: template.rating,
      comment: template.comment,
      date: dates[(reviewId - 1) % dates.length],
    });
    reviewId++;
  }
});
