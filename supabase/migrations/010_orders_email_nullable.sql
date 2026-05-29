-- customer_email is no longer collected at checkout
alter table orders alter column customer_email drop not null;
