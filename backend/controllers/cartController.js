const pool = require("../config/db");

// 1. Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, animal_id, quantity } = req.body;
    const user_id = req.user.id;
    const qty = quantity ? parseInt(quantity) : 1;

    if (!product_id && !animal_id) {
      return res.status(400).json({ message: "Product ID or Animal ID is required" });
    }

    // Check stock limit for products
    if (product_id) {
      const prodQuery = "SELECT stock FROM products WHERE id = $1";
      const prodResult = await pool.query(prodQuery, [product_id]);
      if (prodResult.rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (prodResult.rows[0].stock <= 0) {
        return res.status(400).json({ message: "Product is out of stock" });
      }
    }

    // Since we dropped the UNIQUE constraint, we manage it manually
    const checkQuery = `
      SELECT * FROM cart 
      WHERE user_id = $1 
      AND (product_id = $2 OR animal_id = $3)
    `;
    const checkResult = await pool.query(checkQuery, [user_id, product_id || null, animal_id || null]);

    let result;
    if (checkResult.rows.length > 0) {
      // Update quantity
      const existing = checkResult.rows[0];
      const newQty = animal_id ? 1 : existing.quantity + qty; // Force qty 1 for animals
      
      const updateQuery = `
        UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *
      `;
      result = await pool.query(updateQuery, [newQty, existing.id]);
    } else {
      // Insert new cart item
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, animal_id, quantity)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const itemQty = animal_id ? 1 : qty; // Force qty 1 for animals
      result = await pool.query(insertQuery, [user_id, product_id || null, animal_id || null, itemQty]);
    }

    res.status(201).json({
      message: "Item added to cart successfully",
      cartItem: result.rows[0],
    });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get Cart Items
exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        c.id, 
        c.product_id, 
        c.animal_id,
        c.quantity, 
        COALESCE(p.name, a.animal_name) AS name, 
        COALESCE(p.category, a.category) AS category, 
        COALESCE(p.price, a.price) AS price, 
        COALESCE(p.image, a.image) AS image, 
        p.stock
      FROM cart c
      LEFT JOIN products p ON c.product_id = p.id
      LEFT JOIN animals a ON c.animal_id = a.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;

    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Update Cart Item Quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    if (quantity === undefined || parseInt(quantity) < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Check ownership
    const checkQuery = "SELECT * FROM cart WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "Access Denied: Not your cart item" });
    }

    const cartItem = checkResult.rows[0];

    if (cartItem.animal_id) {
      return res.status(400).json({ message: "Animals cannot have quantity > 1" });
    }

    // Check product stock limit
    if (cartItem.product_id) {
      const prodQuery = "SELECT stock FROM products WHERE id = $1";
      const prodResult = await pool.query(prodQuery, [cartItem.product_id]);
      const stock = prodResult.rows[0].stock;

      if (parseInt(quantity) > stock) {
        return res.status(400).json({ message: `Only ${stock} units are available in stock` });
      }
    }

    const query = `
      UPDATE cart
      SET quantity = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [parseInt(quantity), id]);

    res.json({
      message: "Cart quantity updated successfully",
      cartItem: result.rows[0],
    });
  } catch (error) {
    console.error("Update Cart Quantity Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check ownership
    const checkQuery = "SELECT * FROM cart WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "Access Denied: Not your cart item" });
    }

    await pool.query("DELETE FROM cart WHERE id = $1", [id]);

    res.json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
