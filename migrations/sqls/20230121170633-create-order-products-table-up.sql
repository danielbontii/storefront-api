CREATE TABLE IF NOT EXISTS order_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER CHECK (quantity > 0)
);