-- Enable pg_net extension for HTTP calls from triggers
create extension if not exists pg_net with schema extensions;

-- Function called after INSERT on orders
create or replace function notify_telegram_on_order()
returns trigger
language plpgsql
security definer
as $$
begin
  perform net.http_post(
    url     := 'https://tglmaigolkevuibyajsb.supabase.co/functions/v1/notify-telegram',
    body    := jsonb_build_object('record', row_to_json(NEW)),
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer a62bd9c5905d330c65a01bc9b221be2ed41669430919a7ee'
    )
  );
  return NEW;
end;
$$;

-- Trigger: fire after each new order row
drop trigger if exists on_order_created on orders;
create trigger on_order_created
  after insert on orders
  for each row
  execute function notify_telegram_on_order();
