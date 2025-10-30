/* Create tables */
create table if not exists tags (
    id integer primary key generated always as identity,
    slug text not null unique,
    name text not null,
    created_at timestamp
    with
        time zone default now(),
        updated_at timestamp
    with
        time zone default now()
);

create table if not exists products (
    id integer primary key generated always as identity,
    name text not null,
    price decimal(10, 2),
    created_at timestamp
    with
        time zone default now(),
        updated_at timestamp
    with
        time zone default now()
);

create table if not exists sub_products (
    id integer primary key generated always as identity,
    product_id integer not null references products (id) on delete cascade,
    name text not null,
    price decimal(10, 2),
    available boolean default true,
    quantity integer default 0,
    created_at timestamp
    with
        time zone default now(),
        updated_at timestamp
    with
        time zone default now()
);

create table if not exists product_images (
    id integer primary key generated always as identity,
    product_id integer not null references products (id) on delete cascade,
    name text not null,
    url text not null,
    alt text,
    created_at timestamp
    with
        time zone default now(),
        updated_at timestamp
    with
        time zone default now()
);

create table if not exists product_tags (
    id integer primary key generated always as identity,
    product_id integer not null references products (id) on delete cascade,
    tag_id integer not null references tags (id) on delete cascade,
    created_at timestamp
    with
        time zone default now()
);
