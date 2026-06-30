const pool = require("./config/db");

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createAnimalsTableQuery = `
  CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    seller_id INT REFERENCES users(id) ON DELETE CASCADE,
    animal_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INT,
    weight DECIMAL,
    gender VARCHAR(20),
    price DECIMAL NOT NULL,
    description TEXT,
    location VARCHAR(100),
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    seller_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL NOT NULL,
    stock INT DEFAULT 0,
    description TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createWishlistTableQuery = `
  CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
  );
`;

const createCartTableQuery = `
  CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
  );
`;

async function init() {
  try {
    await pool.query(createUsersTableQuery);
    console.log("Users table verified/created successfully.");
    
    await pool.query(createAnimalsTableQuery);
    console.log("Animals table verified/created successfully.");

    await pool.query(createProductsTableQuery);
    console.log("Products table verified/created successfully.");

    await pool.query(createWishlistTableQuery);
    console.log("Wishlist table verified/created successfully.");

    await pool.query(createCartTableQuery);
    console.log("Cart table verified/created successfully.");
    
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database tables:", err);
    process.exit(1);
  }
}

init();
