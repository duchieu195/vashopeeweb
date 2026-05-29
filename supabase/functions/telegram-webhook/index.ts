import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const TELEGRAM_API = 'https://api.telegram.org';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify Telegram secret token
  const secretToken = req.headers.get('X-Telegram-Bot-Api-Secret-Token') ?? '';
  const expectedSecret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET') ?? '';
  if (!expectedSecret || secretToken !== expectedSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Only handle callback_query (button press)
  const callbackQuery = update.callback_query as Record<string, unknown> | undefined;
  if (!callbackQuery) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const callbackData = String(callbackQuery.data ?? '');
  const callbackQueryId = String(callbackQuery.id ?? '');
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';

  // Parse confirm_paid:<order_id>
  const match = callbackData.match(/^confirm_paid:(.+)$/);
  if (!match) {
    await answerCallback(botToken, callbackQueryId, '❌ Lệnh không hợp lệ');
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const orderId = match[1];

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Fetch order to check current status
  const { data: order, error: fetchErr } = await supabase
    .from('orders')
    .select('id, payment_code, status')
    .eq('id', orderId)
    .single();

  if (fetchErr || !order) {
    await answerCallback(botToken, callbackQueryId, '❌ Không tìm thấy đơn hàng');
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (order.status !== 'pending') {
    await answerCallback(botToken, callbackQueryId, `ℹ️ Đơn ${order.payment_code} đã ở trạng thái: ${order.status}`);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update to paid
  const { error: updateErr } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', orderId);

  if (updateErr) {
    console.error('[telegram-webhook] Update error:', updateErr);
    await answerCallback(botToken, callbackQueryId, '❌ Lỗi cập nhật đơn hàng');
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Edit the original message to remove button and show confirmed
  const message = callbackQuery.message as Record<string, unknown> | undefined;
  if (message) {
    const chatId = (message.chat as Record<string, unknown>)?.id;
    const messageId = message.message_id;
    await fetch(`${TELEGRAM_API}/bot${botToken}/editMessageReplyMarkup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] },
      }),
    });

    await fetch(`${TELEGRAM_API}/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `✅ Đã xác nhận thanh toán cho đơn *${order.payment_code}*`,
        parse_mode: 'Markdown',
      }),
    });
  }

  await answerCallback(botToken, callbackQueryId, '✅ Đã xác nhận!');
  console.log(`[telegram-webhook] Order ${order.payment_code} marked as paid`);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

async function answerCallback(botToken: string, callbackQueryId: string, text: string) {
  await fetch(`${TELEGRAM_API}/bot${botToken}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}
