import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ORDER_CODE_REGEX = /VA-\d{8}-[A-Z0-9]{4}/;

Deno.serve(async (req: Request) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Verify API key
  const apiKey = req.headers.get('Authorization') ?? req.headers.get('apikey') ?? '';
  const expectedKey = Deno.env.get('SEPAY_API_KEY') ?? '';
  if (!expectedKey || apiKey !== expectedKey) {
    console.error('[webhook-sepay] Unauthorized request');
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const content = String(payload.content ?? '');
  const transferAmount = Number(payload.transferAmount ?? 0);
  const transferType = String(payload.transferType ?? '');

  // Only process incoming transfers
  if (transferType !== 'in') {
    return new Response(JSON.stringify({ success: true, skipped: 'outgoing' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Extract order code from transfer content
  const match = content.match(ORDER_CODE_REGEX);
  if (!match) {
    console.log(`[webhook-sepay] No order code found in content: "${content}"`);
    return new Response(JSON.stringify({ success: true, skipped: 'no_order_code' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const orderCode = match[0];

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // Find the order
  const { data: order, error: fetchErr } = await supabase
    .from('orders')
    .select('id, total_amount, status')
    .eq('payment_code', orderCode)
    .single();

  if (fetchErr || !order) {
    console.log(`[webhook-sepay] Order not found: ${orderCode}`);
    return new Response(JSON.stringify({ success: true, skipped: 'order_not_found' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Idempotency: already paid
  if (order.status !== 'pending') {
    console.log(`[webhook-sepay] Order ${orderCode} already has status: ${order.status}`);
    return new Response(JSON.stringify({ success: true, skipped: 'already_processed' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Verify amount
  if (transferAmount < order.total_amount) {
    console.warn(`[webhook-sepay] Amount mismatch for ${orderCode}: received ${transferAmount}, expected ${order.total_amount}`);
    return new Response(JSON.stringify({ success: true, skipped: 'amount_mismatch' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Update order status to paid
  const { error: updateErr } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', order.id);

  if (updateErr) {
    console.error(`[webhook-sepay] Failed to update order ${orderCode}:`, updateErr);
    return new Response(JSON.stringify({ success: false, error: updateErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`[webhook-sepay] Order ${orderCode} marked as paid. Amount: ${transferAmount}`);
  return new Response(JSON.stringify({ success: true, orderCode }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
