const pool = require("./config/db");

async function updateUsersTable() {
  try {
    console.log("Adding profile_image column to users table...");
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255);
    `);
    console.log("Successfully added profile_image to users table.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating users table:", error);
    process.exit(1);
  }
}

updateUsersTable();
