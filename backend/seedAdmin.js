const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const password = "Admin@1234";
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const res = await pool.query("SELECT * FROM users WHERE email='admin123@gmail.com'");
    if (res.rows.length > 0) {
      console.log("Admin already exists. Updating password and role to ensure access...");
      await pool.query(
        "UPDATE users SET password=$1, role='admin', name='Admin' WHERE email='admin123@gmail.com'",
        [hashedPassword]
      );
      console.log("Admin account updated.");
    } else {
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Admin", "admin123@gmail.com", hashedPassword, "admin"]
      );
      console.log("Admin account created.");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
