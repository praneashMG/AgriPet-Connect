const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

// Helper to delete local uploaded file
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting image file:", err);
  });
};

// 1. Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;
    const seller_id = req.user.id;
    const image = req.file ? req.file.filename : null;

    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Product name, category, and price are required.",
      });
    }

    const query = `
      INSERT INTO products (
        seller_id, name, category, price, stock, description, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(query, [
      seller_id,
      name,
      category,
      parseFloat(price),
      stock ? parseInt(stock) : 0,
      description,
      image,
    ]);

    res.status(201).json({
      message: "Product listed successfully!",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get All Products (with Search & Filters)
exports.getProducts = async (req, res) => {
  try {
    let query = `
      SELECT p.*, u.name as seller_name, u.email as seller_email 
      FROM products p 
      LEFT JOIN users u ON p.seller_id = u.id
    `;
    const conditions = [];
    const params = [];
    let paramCount = 1;

    // Search keywords
    if (req.query.search) {
      conditions.push(`(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.category ILIKE $${paramCount})`);
      params.push(`%${req.query.search}%`);
      paramCount++;
    }

    // Category filter
    if (req.query.category) {
      conditions.push(`p.category = $${paramCount}`);
      params.push(req.query.category);
      paramCount++;
    }

    // Price range filters
    if (req.query.minPrice) {
      conditions.push(`p.price >= $${paramCount}`);
      params.push(parseFloat(req.query.minPrice));
      paramCount++;
    }

    if (req.query.maxPrice) {
      conditions.push(`p.price <= $${paramCount}`);
      params.push(parseFloat(req.query.maxPrice));
      paramCount++;
    }

    // Seller ID filter (for Seller Dashboard)
    if (req.query.sellerId) {
      conditions.push(`p.seller_id = $${paramCount}`);
      params.push(parseInt(req.query.sellerId));
      paramCount++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY p.created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Get Single Product Details
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT p.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Product Details Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    // Check ownership
    const checkQuery = "SELECT * FROM products WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Product listing not found" });
    }

    const product = checkResult.rows[0];

    if (product.seller_id !== seller_id) {
      return res.status(403).json({ message: "Access Denied: You are not the seller of this listing" });
    }

    const { name, category, price, stock, description } = req.body;

    let image = product.image;
    if (req.file) {
      // Replaced photo, clean up old one
      deleteFile(product.image);
      image = req.file.filename;
    }

    const updateQuery = `
      UPDATE products
      SET name = $1, category = $2, price = $3, stock = $4, description = $5, image = $6
      WHERE id = $7
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      name || product.name,
      category || product.category,
      price !== undefined ? parseFloat(price) : product.price,
      stock !== undefined ? parseInt(stock) : product.stock,
      description !== undefined ? description : product.description,
      image,
      id,
    ]);

    res.json({
      message: "Product updated successfully!",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 5. Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    // Check ownership
    const checkQuery = "SELECT * FROM products WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Product listing not found" });
    }

    const product = checkResult.rows[0];

    if (product.seller_id !== seller_id) {
      return res.status(403).json({ message: "Access Denied: You are not the seller of this listing" });
    }

    // Clean photo from server disk
    deleteFile(product.image);

    // Delete listing from DB
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
