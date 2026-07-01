const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users(name,email,phone,password)
       VALUES($1,$2,$3,$4)
       RETURNING id,name,email`,
      [name, email, phone, hashedPassword]
    );

    res.status(201).json({
      message: "User Registered Successfully",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};exports.profile = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id,name,email,phone,role,profile_image FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const imageUrl = req.file.filename;

    const updatedUser = await pool.query(
      "UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING id, name, email, profile_image",
      [imageUrl, req.user.id]
    );

    res.json({
      message: "Profile image updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Server Error" });
  }
};