CREATE TABLE if not exists guests(
    email text PRIMARY KEY,
    first_name text,
    last_name text,
    address text,
    phone text,
    table_name text,
    rsvp boolean
);