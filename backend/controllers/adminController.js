const pool = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const productsCount = await pool.query("SELECT COUNT(*) FROM products");
    const animalsCount = await pool.query("SELECT COUNT(*) FROM animals");

    const pCats = await pool.query("SELECT category as name, count(*) FROM products GROUP BY category");
    const aCats = await pool.query("SELECT category as name, count(*) FROM animals GROUP BY category");
    
    const categoryDataMap = {};
    pCats.rows.forEach(r => categoryDataMap[r.name] = parseInt(r.count));
    aCats.rows.forEach(r => {
      categoryDataMap[r.name] = (categoryDataMap[r.name] || 0) + parseInt(r.count);
    });
    const categoryData = Object.keys(categoryDataMap).map(k => ({ name: k, count: categoryDataMap[k] }));

    const usersGrowth = await pool.query("SELECT TO_CHAR(created_at, 'Mon') as month, count(*) as users FROM users GROUP BY TO_CHAR(created_at, 'Mon')");
    const productsGrowth = await pool.query("SELECT TO_CHAR(created_at, 'Mon') as month, count(*) as listings FROM products GROUP BY TO_CHAR(created_at, 'Mon')");
    const animalsGrowth = await pool.query("SELECT TO_CHAR(created_at, 'Mon') as month, count(*) as listings FROM animals GROUP BY TO_CHAR(created_at, 'Mon')");

    const growthMap = {};
    usersGrowth.rows.forEach(r => { growthMap[r.month] = { month: r.month, users: parseInt(r.users), listings: 0 } });
    
    const addListings = (rows) => {
      rows.forEach(r => {
        if(!growthMap[r.month]) growthMap[r.month] = { month: r.month, users: 0, listings: 0 };
        growthMap[r.month].listings += parseInt(r.listings);
      });
    };
    addListings(productsGrowth.rows);
    addListings(animalsGrowth.rows);
    
    const growthData = Object.values(growthMap);

    res.json({
      users: parseInt(usersCount.rows[0].count),
      products: parseInt(productsCount.rows[0].count),
      animals: parseInt(animalsCount.rows[0].count),
      categoryData,
      growthData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error fetching stats" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC");
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error deleting user" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await pool.query(`
      SELECT p.*, u.name as seller_name 
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching products" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error deleting product" });
  }
};

exports.getAnimals = async (req, res) => {
  try {
    const animals = await pool.query(`
      SELECT a.*, u.name as seller_name 
      FROM animals a 
      LEFT JOIN users u ON a.seller_id = u.id 
      ORDER BY a.created_at DESC
    `);
    res.json(animals.rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching animals" });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM animals WHERE id = $1", [id]);
    res.json({ message: "Animal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error deleting animal" });
  }
};
