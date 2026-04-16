-- SwiftCart Supabase Schema
-- Run this in your Supabase SQL editor

-- Customers
CREATE TABLE customers (
  customer_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(20),
  email        VARCHAR(100) UNIQUE,
  location_status BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Admins
CREATE TABLE admins (
  admin_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      VARCHAR(100) NOT NULL,
  email     VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security Guards
CREATE TABLE security_guards (
  guard_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  product_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode        VARCHAR(50) UNIQUE NOT NULL,
  product_name   VARCHAR(200) NOT NULL,
  price          DECIMAL(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  category       VARCHAR(100),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Carts
CREATE TABLE carts (
  cart_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
  total_amount  DECIMAL(10, 2) DEFAULT 0,
  tax_amount    DECIMAL(10, 2) DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Cart Items (junction table)
CREATE TABLE cart_items (
  cart_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id      UUID REFERENCES carts(cart_id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(product_id),
  quantity     INT NOT NULL DEFAULT 1,
  subtotal     DECIMAL(10, 2) NOT NULL
);

-- Payments (no sensitive card data stored)
CREATE TABLE payments (
  payment_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id             UUID REFERENCES carts(cart_id),
  amount              DECIMAL(10, 2) NOT NULL,
  payment_status      VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | success | failed
  payment_method      VARCHAR(50),
  razorpay_order_id   VARCHAR(100),
  razorpay_payment_id VARCHAR(100),
  transaction_time    TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  invoice_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id          UUID REFERENCES payments(payment_id),
  customer_id         UUID REFERENCES customers(customer_id),
  total_amount        DECIMAL(10, 2) NOT NULL,
  exit_qr_code        VARCHAR(255) UNIQUE NOT NULL,
  qr_token            VARCHAR(100),
  qr_expires_at       TIMESTAMPTZ NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'unused', -- unused | used
  verified_at         TIMESTAMPTZ,
  invoice_date        TIMESTAMPTZ DEFAULT NOW()
);

-- Seed sample products (matching the frontend catalog)
INSERT INTO products (barcode, product_name, price, stock_quantity, category) VALUES
  ('1001', 'Organic Milk 1L',        68.00,  100, 'Dairy'),
  ('1002', 'Whole Wheat Bread',       45.00,  80,  'Bakery'),
  ('1003', 'Basmati Rice 5kg',       320.00,  50,  'Grains'),
  ('1004', 'Extra Virgin Olive Oil', 599.00,  30,  'Oils'),
  ('1005', 'Dark Chocolate Bar',     120.00,  200, 'Snacks'),
  ('1006', 'Free Range Eggs (12)',    95.00,  60,  'Dairy'),
  ('1007', 'Greek Yogurt 400g',       85.00,  75,  'Dairy'),
  ('1008', 'Almond Butter Jar',      450.00,  40,  'Spreads');
