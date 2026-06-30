const pool = require('./config/db');

async function updateDbSchema() {
  try {
    console.log("Altering wishlist table...");
    // Drop the unique constraint
    await pool.query("ALTER TABLE wishlist DROP CONSTRAINT IF EXISTS wishlist_user_id_product_id_key");
    // Alter product_id to drop NOT NULL if it exists
    await pool.query("ALTER TABLE wishlist ALTER COLUMN product_id DROP NOT NULL");
    // Add animal_id column
    await pool.query("ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS animal_id INT REFERENCES animals(id) ON DELETE CASCADE");

    console.log("Altering cart table...");
    // Drop the unique constraint
    await pool.query("ALTER TABLE cart DROP CONSTRAINT IF EXISTS cart_user_id_product_id_key");
    // Alter product_id to drop NOT NULL if it exists
    await pool.query("ALTER TABLE cart ALTER COLUMN product_id DROP NOT NULL");
    // Add animal_id column
    await pool.query("ALTER TABLE cart ADD COLUMN IF NOT EXISTS animal_id INT REFERENCES animals(id) ON DELETE CASCADE");

    console.log("Database schema updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating database schema:", error);
    process.exit(1);
  }
}

updateDbSchema();
