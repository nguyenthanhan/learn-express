import { pool } from "../config/mysql.js";
import { mongoIsConnected } from "../config/mongo.js";
import user from "../models/user.js";

const getAllUsers = async ({ page = 1, limit = 20, keyword = "" } = {}) => {
  try {
    const skip = (page - 1) * limit;
    let searchQuery = { deleted: false };
    if (keyword) {
      searchQuery["$or"] = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } },
      ];
    }
    let totalCount;
    let results = [];
    if (mongoIsConnected) {
      totalCount = await user.countDocuments(searchQuery);
      results = await user.find(searchQuery).skip(skip).limit(limit);
    } else {
      const [countResults] = await pool.query(
        "SELECT COUNT(*) as count FROM Users WHERE name LIKE ? OR email LIKE ?",
        [`%${keyword}%`, `%${keyword}%`]
      );
      totalCount = countResults[0].count;

      [results] = await pool.query(
        "SELECT * FROM Users WHERE name LIKE ? OR email LIKE ? LIMIT ? OFFSET ?",
        [`%${keyword}%`, `%${keyword}%`, limit, skip]
      );
    }

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
    if (mongoIsConnected) {
      let result = await user.findOne({ _id: id, deleted: false });
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

const editUser = async ({ id, name, email, city, role }) => {
  try {
    if (mongoIsConnected) {
      let result = await user.findOneAndUpdate(
        { _id: id, deleted: false },
        {
          name,
          email,
          city,
          role,
        },
        { new: true }
      );

      if (!result) {
        return null;
      }

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
      const foundUser = await user.findById(id);

      if (!foundUser) {
        return null;
      }
      await foundUser.softDelete({ deleteBy: 1 });
      foundUser.affectedRows = 1;
      return foundUser;
    }

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
    let searchQuery = { deleted: true };
    if (keyword) {
      searchQuery["$or"] = [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } },
      ];
    }
    let totalCount;
    let results = [];
    if (mongoIsConnected) {
      totalCount = await user.countDocuments(searchQuery);
      results = await user.find(searchQuery).skip(skip).limit(limit);
    } else {
      const [countResults] = await pool.query(
        "SELECT COUNT(*) as count FROM Users WHERE name LIKE ? OR email LIKE ?",
        [`%${keyword}%`, `%${keyword}%`]
      );
      totalCount = countResults[0].count;

      [results] = await pool.query(
        "SELECT * FROM Users WHERE name LIKE ? OR email LIKE ? LIMIT ? OFFSET ?",
        [`%${keyword}%`, `%${keyword}%`, limit, skip]
      );
    }

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
    if (mongoIsConnected) {
      const foundUser = await user.findById(id);
      if (!user) {
        return null;
      }
      await foundUser.restore();
      foundUser.affectedRows = 1;
      return foundUser;
    }

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
