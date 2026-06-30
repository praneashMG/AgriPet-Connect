const pool = require("../config/db");

// 1. Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id, animal_id } = req.body;
    const user_id = req.user.id;

    if (!product_id && !animal_id) {
      return res.status(400).json({ message: "Product ID or Animal ID is required" });
    }

    // Check if it already exists manually since we dropped the UNIQUE constraint
    const checkQuery = `
      SELECT * FROM wishlist 
      WHERE user_id = $1 
      AND (product_id = $2 OR animal_id = $3)
    `;
    const checkResult = await pool.query(checkQuery, [user_id, product_id || null, animal_id || null]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "Item is already in wishlist" });
    }

    const query = `
      INSERT INTO wishlist (user_id, product_id, animal_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [user_id, product_id || null, animal_id || null]);

    res.status(201).json({
      message: "Item added to wishlist successfully",
      wishlistItem: result.rows[0] || null,
    });
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get Wishlist Items
exports.getWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        w.id, 
        w.product_id, 
        w.animal_id,
        COALESCE(p.name, a.animal_name) AS name, 
        COALESCE(p.category, a.category) AS category, 
        COALESCE(p.price, a.price) AS price, 
        COALESCE(p.image, a.image) AS image, 
        p.stock, 
        COALESCE(p.description, a.description) AS description
      FROM wishlist w
      LEFT JOIN products p ON w.product_id = p.id
      LEFT JOIN animals a ON w.animal_id = a.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
    `;

    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check ownership
    const checkQuery = "SELECT * FROM wishlist WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "Access Denied: Not your wishlist item" });
    }

    await pool.query("DELETE FROM wishlist WHERE id = $1", [id]);

    res.json({ message: "Item removed from wishlist successfully" });
  } catch (error) {
    console.error("Remove from Wishlist Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
