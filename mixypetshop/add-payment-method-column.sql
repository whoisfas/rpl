-- ============================================
-- ADD METHOD COLUMN TO PAYMENTS TABLE
-- ============================================
-- This adds the 'method' column to track payment method (bca/qris)

-- Add method column to payments table
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS method VARCHAR(20) DEFAULT 'bca';

-- Update existing payments to have default method
UPDATE payments
SET method = 'bca'
WHERE method IS NULL;

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'payments'
AND column_name = 'method';
