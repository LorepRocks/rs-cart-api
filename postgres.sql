create table carts(
	id uuid not null default gen_random_uuid() primary key,
	create_at date not null default current_timestamp,
	update_at date not null default current_timestamp
);

create table cart_items(
 product_id uuid not null default gen_random_uuid(),
 count integer not null
);


alter table cart_items add column cart_id uuid references carts(id);

insert into carts (create_at) values (current_times);
insert into cart_items (cart_id, count) values ('c7a61cf8-698a-4b16-9a79-dce944b8c80a', 10);