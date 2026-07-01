const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabaseClient");

// Helper to delete local uploaded file (no longer needed for Supabase, but keeping stub)
const deleteFile = async (filename) => {
  if (!filename) return;
  
  if (filename.startsWith('http')) {
    try {
      // Extract path after 'uploads/'
      const urlParts = filename.split('/uploads/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("uploads").remove([filePath]);
      }
    } catch (err) {
      console.error("Error deleting Supabase image file:", err);
    }
  } else {
    // Legacy local delete
    const filePath = path.join(__dirname, "../uploads", filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local image file:", err);
    });
  }
};

// 1. Add Animal
exports.addAnimal = async (req, res) => {
  try {
    const {
      animal_name,
      category,
      breed,
      age,
      weight,
      gender,
      price,
      description,
      location,
    } = req.body;

    const seller_id = req.user.id;
    let image = null;

    if (req.file) {
      const fileName = `animals/${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return res.status(500).json({ message: "Image upload failed" });
      }

      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(fileName);

      image = publicUrlData.publicUrl;
    }

    if (!animal_name || !category || !price) {
      return res.status(400).json({
        message: "Animal name, category, and price are required.",
      });
    }

    const query = `
      INSERT INTO animals (
        seller_id, animal_name, category, breed, age, weight, gender, price, description, location, image
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, [
      seller_id,
      animal_name,
      category,
      breed,
      age ? parseInt(age) : null,
      weight ? parseFloat(weight) : null,
      gender,
      parseFloat(price),
      description,
      location,
      image,
    ]);

    res.status(201).json({
      message: "Animal listed successfully!",
      animal: result.rows[0],
    });
  } catch (error) {
    console.error("Add Animal Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 2. Get All Animals (with Search & Filters)
exports.getAnimals = async (req, res) => {
  try {
    let query = `
      SELECT a.*, u.name as seller_name, u.email as seller_email 
      FROM animals a 
      LEFT JOIN users u ON a.seller_id = u.id
    `;
    const conditions = [];
    const params = [];
    let paramCount = 1;

    // Search term
    if (req.query.search) {
      conditions.push(`(a.animal_name ILIKE $${paramCount} OR a.breed ILIKE $${paramCount} OR a.description ILIKE $${paramCount})`);
      params.push(`%${req.query.search}%`);
      paramCount++;
    }

    // Category filter
    if (req.query.category) {
      conditions.push(`a.category = $${paramCount}`);
      params.push(req.query.category);
      paramCount++;
    }

    // Location filter
    if (req.query.location) {
      conditions.push(`a.location ILIKE $${paramCount}`);
      params.push(`%${req.query.location}%`);
      paramCount++;
    }

    // Price range filters
    if (req.query.minPrice) {
      conditions.push(`a.price >= $${paramCount}`);
      params.push(parseFloat(req.query.minPrice));
      paramCount++;
    }

    if (req.query.maxPrice) {
      conditions.push(`a.price <= $${paramCount}`);
      params.push(parseFloat(req.query.maxPrice));
      paramCount++;
    }

    // Filter by seller id (for Seller Dashboard listings)
    if (req.query.sellerId) {
      conditions.push(`a.seller_id = $${paramCount}`);
      params.push(parseInt(req.query.sellerId));
      paramCount++;
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY a.created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get Animals Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 3. Get Single Animal Details
exports.getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT a.*, u.name as seller_name, u.email as seller_email, u.phone as seller_phone
      FROM animals a
      LEFT JOIN users u ON a.seller_id = u.id
      WHERE a.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Animal listing not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Animal Details Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 4. Update Animal
exports.updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    // Check ownership
    const checkQuery = "SELECT * FROM animals WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Animal listing not found" });
    }

    const animal = checkResult.rows[0];

    if (animal.seller_id !== seller_id) {
      return res.status(403).json({ message: "Access Denied: You are not the seller of this listing" });
    }

    const {
      animal_name,
      category,
      breed,
      age,
      weight,
      gender,
      price,
      description,
      location,
    } = req.body;

    let image = animal.image;
    if (req.file) {
      // New image uploaded, delete old one
      await deleteFile(animal.image);
      
      const fileName = `animals/${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`;
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return res.status(500).json({ message: "Image upload failed" });
      }

      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(fileName);

      image = publicUrlData.publicUrl;
    }

    const updateQuery = `
      UPDATE animals
      SET animal_name = $1, category = $2, breed = $3, age = $4, weight = $5,
          gender = $6, price = $7, description = $8, location = $9, image = $10
      WHERE id = $11
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      animal_name || animal.animal_name,
      category || animal.category,
      breed || animal.breed,
      age !== undefined ? (age ? parseInt(age) : null) : animal.age,
      weight !== undefined ? (weight ? parseFloat(weight) : null) : animal.weight,
      gender || animal.gender,
      price !== undefined ? parseFloat(price) : animal.price,
      description !== undefined ? description : animal.description,
      location || animal.location,
      image,
      id,
    ]);

    res.json({
      message: "Animal listing updated successfully!",
      animal: result.rows[0],
    });
  } catch (error) {
    console.error("Update Animal Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 5. Delete Animal
exports.deleteAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    const seller_id = req.user.id;

    // Check ownership
    const checkQuery = "SELECT * FROM animals WHERE id = $1";
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Animal listing not found" });
    }

    const animal = checkResult.rows[0];

    if (animal.seller_id !== seller_id) {
      return res.status(403).json({ message: "Access Denied: You are not the seller of this listing" });
    }

    // Delete image file first
    await deleteFile(animal.image);

    // Delete from DB
    await pool.query("DELETE FROM animals WHERE id = $1", [id]);

    res.json({ message: "Animal listing deleted successfully!" });
  } catch (error) {
    console.error("Delete Animal Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
