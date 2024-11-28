import { pool } from "../config/mysql.js";
import { mongoIsConnected } from "../config/mongo.js";
import user from "../models/user.js";

const getAllUsers = async () => {
  try {
    if (mongoIsConnected) {
      let results = await user.find();
      return results;
    }

    const [results, fields] = await pool.query("SELECT * FROM Users");
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getUserById = async (id) => {
  try {
    if (mongoIsConnected) {
      let result = await user.findById(id);
      return result;
    }

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
    throw err;
  }
};

const createUser = async ({ name, email, city, role }) => {
  try {
    if (mongoIsConnected) {
      let result = await user.create({ name, email, city, role });
      result.insertId = result._id;
      return result;
    }

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
    throw err;
  }
};

const editUser = async ({ id, name, email, city }) => {
  try {
    if (mongoIsConnected) {
      let result = await user.findByIdAndUpdate(id, { name, email, city });
      result.affectedRows = 1;
      return result;
    }

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
    throw err;
  }
};

const deleteUser = async (id) => {
  try {
    if (mongoIsConnected) {
      let result = await user.findByIdAndDelete(id);
      result.affectedRows = 1;
      return result;
    }

    const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [id]);

    if (!result?.affectedRows) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { getAllUsers, getUserById, createUser, editUser, deleteUser };
