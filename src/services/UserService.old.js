import { pool } from "../config/mysql.js";

const getAllUsers = async ({ page = 1, limit = 20, keyword = "" } = {}) => {
  try {
    const skip = (page - 1) * limit;
    const [countResults] = await pool.query(
      "SELECT COUNT(*) as count FROM Users WHERE name LIKE ? OR email LIKE ?",
      [`%${keyword}%`, `%${keyword}%`]
    );
    const totalCount = countResults[0].count;

    const [results] = await pool.query(
      "SELECT * FROM Users WHERE name LIKE ? OR email LIKE ? LIMIT ? OFFSET ?",
      [`%${keyword}%`, `%${keyword}%`, limit, skip]
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      page,
      size: limit,
      totalCount,
      totalPages,
      data: results,
    };
  } catch (err) {
    console.log(err);
    throw err;
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
    throw err;
  }
};

const createUser = async ({ name, email, city, role }) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO Users (email, name, city, role) VALUES (?, ?, ?, ?)",
      [email, name, city, role]
    );

    if (!result || !result.insertId) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const editUser = async ({ id, name, email, city, role }) => {
  try {
    const [result] = await pool.query(
      "UPDATE Users SET email = ?, name = ?, city = ?, role = ? WHERE id = ?",
      [email, name, city, role, id]
    );

    if (!result || result.affectedRows === 0) {
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
    const [result] = await pool.query(
      "UPDATE Users SET deleted = ?, deletedAt = ? WHERE id = ?",
      [true, new Date(), id]
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

const getDeletedUsers = async ({ page = 1, limit = 20, keyword = "" } = {}) => {
  try {
    const skip = (page - 1) * limit;

    const [countResults] = await pool.query(
      "SELECT COUNT(*) as count FROM Users WHERE name LIKE ? OR email LIKE ?",
      [`%${keyword}%`, `%${keyword}%`]
    );
    totalCount = countResults[0].count;

    [results] = await pool.query(
      "SELECT * FROM Users WHERE name LIKE ? OR email LIKE ? LIMIT ? OFFSET ?",
      [`%${keyword}%`, `%${keyword}%`, limit, skip]
    );

    const totalPages = Math.ceil(totalCount / limit);

    return {
      page,
      size: limit,
      totalCount,
      totalPages,
      data: results,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const restoreUser = async (id) => {
  try {
    const [result] = await pool.query(
      "UPDATE Users SET deleted = false WHERE id = ?",
      [id]
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

export {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
  restoreUser,
  getDeletedUsers,
};
