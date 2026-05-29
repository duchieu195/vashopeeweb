import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_API = 'https://api.telegram.org';

interface OrderRecord {
  id: string;
  payment_code: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  notes: string | null;
  total_amount: number;
  coupon_code: string | null;
  discount_amount: number | null;
  status: string;
}

interface OrderItem {
  product_name: string;
  variant_label: string | null;
  quantity: number;
  price_at_purchase: number;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify internal secret shared between DB trigger and this function
  const authHeader = req.headers.get('Authorization') ?? '';
  const internalSecret = Deno.env.get('INTERNAL_FUNCTION_SECRET') ?? '';
  if (!internalSecret || authHeader !== `Bearer ${internalSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  let body: { record?: OrderRecord };
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const order = body.record;
  if (!order?.id) {
    return new Response('No record', { status: 400 });
  }

  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID') ?? '';
  if (!botToken || !chatId) {
    console.error('[notify-telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return new Response('Config error', { status: 500 });
  }

  // Fetch order items
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  const { data: items } = await supabase
    .from('order_items')
    .select('product_name, variant_label, quantity, price_at_purchase')
    .eq('order_id', order.id);

  const itemLines = (items as OrderItem[] ?? [])
    .map((i) => {
      const label = i.variant_label ? ` (${i.variant_label})` : '';
      return `  • ${i.product_name}${label} x${i.quantity} — ${i.price_at_purchase.toLocaleString('vi-VN')}₫`;
    })
    .join('\n');

  const text = [
    `🛍 *Đơn hàng mới* #${order.payment_code}`,
    ``,
    `👤 ${order.customer_name} · ${order.customer_phone}`,
    `📍 ${order.shipping_address}`,
    order.notes ? `📝 ${order.notes}` : null,
    ``,
    itemLines,
    ``,
    order.coupon_code && order.discount_amount
      ? `🏷 Mã giảm: ${order.coupon_code} (−${order.discount_amount.toLocaleString('vi-VN')}₫)`
      : null,
    `💰 *Thanh toán: ${order.total_amount.toLocaleString('vi-VN')}₫*`,
  ].filter((l) => l !== null).join('\n');

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        {
          text: '✅ Đã nhận chuyển khoản',
          callback_data: `confirm_paid:${order.id}`,
        },
      ]],
    },
  };

  const res = await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[notify-telegram] Telegram error:', err);
    return new Response('Telegram error', { status: 500 });
  }

  console.log(`[notify-telegram] Notified for order ${order.payment_code}`);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
