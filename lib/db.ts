import mysql from "mysql2/promise";

// creating a reusable connection pool, 
// so the app can talk to MySQL efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

//TEST CONNECTION
export async function test_Db() {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("Database connected successfully:", rows);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}


export default pool;