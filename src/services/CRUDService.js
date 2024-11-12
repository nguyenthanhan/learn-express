import { pool } from "../config/database.js";

const getAllUsers = async () => {
  try {
    const [results, fields] = await pool.query("SELECT * FROM Users");
    return results;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getUserById = async (id) => {
  try {
    const [results, fields] = await pool.query(
      "SELECT * FROM Users WHERE id = ?",
      [id]
    );

    if (!results.length) {
      return null;
    }

    return results[0];
  } catch (err) {
    console.log(err);
    return err;
  }
};

const createUser = async ({ name, email, city }) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO Users (email, name, city) VALUES (?, ?, ?)",
      [email, name, city]
    );

    if (!result?.insertId) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const editUser = async ({ id, name, email, city }) => {
  try {
    const [result] = await pool.query(
      "UPDATE Users SET email = ?, name = ?, city = ? WHERE id = ?",
      [email, name, city, id]
    );

    if (!result?.affectedRows) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const deleteUser = async (id) => {
  try {
    const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [id]);

    if (!result?.affectedRows) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { getAllUsers, getUserById, createUser, editUser, deleteUser };
