ALTER TABLE orders 
    DROP COLUMN IF EXISTS product_id, 
    DROP COLUMN IF EXISTS quantity, 
    DROP COLUMN IF EXISTS cost;
