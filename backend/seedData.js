const pool = require('./config/db');

const seedData = async () => {
  try {
    // 1. Get or create a seller
    let sellerRes = await pool.query("SELECT id FROM users WHERE email='admin123@gmail.com'");
    if (sellerRes.rows.length === 0) {
        console.log("No user found. Please run node seedAdmin.js first.");
        process.exit(1);
    }
    const sellerId = sellerRes.rows[0].id;

    // 2. Insert 5 animals
    const animals = [
        { animal_name: 'Premium Holstein Cow', category: 'Cow', breed: 'Holstein', age: 4, weight: 600, gender: 'Female', price: 65000, description: 'High yield milk cow', location: 'Punjab' },
        { animal_name: 'Golden Retriever Puppy', category: 'Dog', breed: 'Golden Retriever', age: 1, weight: 5, gender: 'Male', price: 15000, description: 'Vaccinated active puppy', location: 'Mumbai' },
        { animal_name: 'Beetal Goat', category: 'Goat', breed: 'Beetal', age: 2, weight: 45, gender: 'Female', price: 12000, description: 'Healthy goat for milk', location: 'Rajasthan' },
        { animal_name: 'Persian Cat', category: 'Cat', breed: 'Persian', age: 1, weight: 4, gender: 'Female', price: 18000, description: 'Fluffy white cat, trained', location: 'Delhi' },
        { animal_name: 'Thoroughbred Horse', category: 'Horse', breed: 'Thoroughbred', age: 5, weight: 500, gender: 'Male', price: 120000, description: 'Strong riding horse', location: 'Haryana' },
    ];

    console.log("Inserting animals...");
    for (const a of animals) {
        await pool.query(
            "INSERT INTO animals (seller_id, animal_name, category, breed, age, weight, gender, price, description, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            [sellerId, a.animal_name, a.category, a.breed, a.age, a.weight, a.gender, a.price, a.description, a.location]
        );
    }

    // 3. Insert 5 products
    const products = [
        { name: 'Premium Calf Starter Feed', category: 'Cow Feed', price: 1200, stock: 50, description: 'High quality 25KG feed' },
        { name: 'Multivitamin Syrup', category: 'Medicine', price: 450, stock: 100, description: '500ML general health syrup' },
        { name: 'Heavy Duty Dog Collar', category: 'Accessories', price: 300, stock: 200, description: 'Nylon collar for large breeds' },
        { name: 'Organic Poultry Feed', category: 'Bird Food', price: 850, stock: 80, description: '20KG organic feed for hens' },
        { name: 'Goat Mineral Block', category: 'Medicine', price: 250, stock: 150, description: 'Essential minerals for goats' },
    ];

    console.log("Inserting products...");
    for (const p of products) {
        await pool.query(
            "INSERT INTO products (seller_id, name, category, price, stock, description) VALUES ($1, $2, $3, $4, $5, $6)",
            [sellerId, p.name, p.category, p.price, p.stock, p.description]
        );
    }

    console.log("Seeding complete!");
    process.exit(0);

  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
