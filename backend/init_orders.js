const pool = require('./config/db');

const setupOrdersTable = async () => {
  try {
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          full_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          address TEXT NOT NULL,
          city VARCHAR(50) NOT NULL,
          state VARCHAR(50) NOT NULL,
          pin_code VARCHAR(20) NOT NULL,
          delivery_option VARCHAR(20) DEFAULT 'Standard',
          total_amount NUMERIC(10, 2) NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          status VARCHAR(20) DEFAULT 'Placed',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createOrderItemsTable = `
      CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
          animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
          item_type VARCHAR(20) NOT NULL,
          name VARCHAR(100) NOT NULL,
          quantity INTEGER NOT NULL,
          price NUMERIC(10, 2) NOT NULL
      );
    `;

    await pool.query(createOrdersTable);
    console.log("Orders table created.");
    await pool.query(createOrderItemsTable);
    console.log("Order items table created.");

  } catch (error) {
    console.error("Error setting up orders tables:", error);
  } finally {
    process.exit();
  }
};

setupOrdersTable();
