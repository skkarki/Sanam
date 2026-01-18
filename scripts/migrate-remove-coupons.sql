-- Migration to remove coupon system
-- Run this manually if you need to preserve existing data

-- Step 1: Remove foreign key constraints from Order table
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_couponId_fkey";

-- Step 2: Remove coupon-related columns from Order table
ALTER TABLE "Order" DROP COLUMN IF EXISTS "couponId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "couponCode";

-- Step 3: Drop CouponUsage table (has foreign keys to Coupon and User)
DROP TABLE IF EXISTS "CouponUsage" CASCADE;

-- Step 4: Drop Coupon table
DROP TABLE IF EXISTS "Coupon" CASCADE;

-- Verify the changes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('Coupon', 'CouponUsage');
-- Should return no rows

-- Verify Order table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Order' 
  AND column_name IN ('couponId', 'couponCode');
-- Should return no rows
