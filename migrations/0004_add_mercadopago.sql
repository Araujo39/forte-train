-- Migration 0004: Add Mercado Pago Integration
-- Adds fields for Mercado Pago payment processing and subscriptions

-- ======================================
-- 1. UPDATE SUBSCRIPTIONS TABLE
-- ======================================
-- Add Mercado Pago specific fields
ALTER TABLE subscriptions ADD COLUMN mercadopago_subscription_id TEXT;
ALTER TABLE subscriptions ADD COLUMN mercadopago_preapproval_id TEXT;
ALTER TABLE subscriptions ADD COLUMN payment_method_id TEXT; -- credit_card, pix, boleto
ALTER TABLE subscriptions ADD COLUMN next_billing_date INTEGER;
ALTER TABLE subscriptions ADD COLUMN auto_recurring INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_subscriptions_mp_sub ON subscriptions(mercadopago_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_mp_preapproval ON subscriptions(mercadopago_preapproval_id);

-- ======================================
-- 2. UPDATE PAYMENTS TABLE
-- ======================================
-- Add Mercado Pago specific fields
ALTER TABLE payments ADD COLUMN mercadopago_payment_id TEXT;
ALTER TABLE payments ADD COLUMN mercadopago_preference_id TEXT;
ALTER TABLE payments ADD COLUMN payment_type TEXT; -- regular, credit_card, debit_card, ticket, bank_transfer
ALTER TABLE payments ADD COLUMN installments INTEGER DEFAULT 1;
ALTER TABLE payments ADD COLUMN transaction_amount REAL;
ALTER TABLE payments ADD COLUMN net_amount REAL; -- Amount after fees
ALTER TABLE payments ADD COLUMN mercadopago_fee REAL;
ALTER TABLE payments ADD COLUMN status_detail TEXT; -- accredited, pending_contingency, pending_review_manual, etc
ALTER TABLE payments ADD COLUMN external_reference TEXT;

CREATE INDEX IF NOT EXISTS idx_payments_mp_payment ON payments(mercadopago_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_mp_preference ON payments(mercadopago_preference_id);

-- ======================================
-- 3. UPDATE TENANTS TABLE
-- ======================================
-- Add Mercado Pago customer info
ALTER TABLE tenants ADD COLUMN mercadopago_customer_id TEXT;
ALTER TABLE tenants ADD COLUMN payment_method_saved TEXT; -- JSON with saved payment methods
ALTER TABLE tenants ADD COLUMN billing_day INTEGER DEFAULT 1; -- Day of month for billing (1-28)

CREATE INDEX IF NOT EXISTS idx_tenants_mp_customer ON tenants(mercadopago_customer_id);

-- ======================================
-- 4. CREATE WEBHOOK LOGS TABLE
-- ======================================
CREATE TABLE IF NOT EXISTS mercadopago_webhook_logs (
  id TEXT PRIMARY KEY,
  webhook_type TEXT NOT NULL, -- payment, plan, subscription
  action TEXT NOT NULL, -- payment.created, payment.updated, etc
  data_id TEXT NOT NULL,
  raw_payload TEXT NOT NULL, -- JSON
  processed INTEGER DEFAULT 0,
  processed_at INTEGER,
  error_message TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_mp_webhooks_type ON mercadopago_webhook_logs(webhook_type);
CREATE INDEX IF NOT EXISTS idx_mp_webhooks_processed ON mercadopago_webhook_logs(processed);
CREATE INDEX IF NOT EXISTS idx_mp_webhooks_data_id ON mercadopago_webhook_logs(data_id);

-- ======================================
-- 5. CREATE PAYMENT METHODS TABLE
-- ======================================
CREATE TABLE IF NOT EXISTS tenant_payment_methods (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  mercadopago_card_id TEXT,
  card_last_four TEXT,
  card_brand TEXT, -- visa, mastercard, amex, elo
  card_holder_name TEXT,
  expiration_month INTEGER,
  expiration_year INTEGER,
  is_default INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_tenant ON tenant_payment_methods(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON tenant_payment_methods(tenant_id, is_default);

-- ======================================
-- 6. CREATE INVOICE TABLE
-- ======================================
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  subscription_id TEXT,
  invoice_number TEXT UNIQUE NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL, -- draft, open, paid, void, uncollectible
  due_date INTEGER NOT NULL,
  paid_at INTEGER,
  payment_id TEXT, -- References payments.id
  pdf_url TEXT,
  items TEXT, -- JSON array of line items
  notes TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
