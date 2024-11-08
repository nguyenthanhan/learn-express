import { pool } from "../config/database.js";

const getUsersApi = async (req, res) => {
  try {
    const [results, fields] = await pool.query("SELECT * FROM Users");
    console.log(results);

    res.json({
      results: results,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
};

const getUserByIdApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const [results, fields] = await pool.query(
      "SELECT * FROM Users WHERE id = ?",
      [id]
    );

    if (!results.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      results: results[0],
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
};

const createUserApi = async (req, res) => {
  console.log("req", req.body);
  const { name, email, city } = req.body ?? {};

  if (!name || !email || !city) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO Users (email, name, city) VALUES (?, ?, ?)",
      [email, name, city]
    );

    if (!result?.insertId) {
      res.status(400).json({ error: "Failed to create user" });
    }

    res
      .status(201)
      .json({ message: "User created successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUserApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [id]);

    if (!result?.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getUsersApi, createUserApi, deleteUserApi, getUserByIdApi };
