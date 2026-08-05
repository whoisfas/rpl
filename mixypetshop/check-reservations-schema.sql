-- Check reservations table schema
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reservations'
ORDER BY ordinal_position;
