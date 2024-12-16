import User from "../models/User.js";

const getAllUsers = async ({
  page = 1,
  limit = 20,
  keyword = "",
  sortBy = "name",
} = {}) => {
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
    const _sortBy = ["name", "email", "createdAt"].includes(sortBy)
      ? sortBy
      : "name";

    totalCount = await User.countDocuments(searchQuery);
    results = await User.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [_sortBy]: -1 });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      page,
      size: limit,
      totalCount,
      totalPages,
      data: results,
    };
  } catch (err) {
    throw err;
  }
};

const getUserById = async (id) => {
  try {
    let result = await User.findOne({ _id: id, deleted: false });
    return result;
  } catch (err) {
    throw err;
  }
};

const createUser = async ({ name, email, city, role }) => {
  try {
    let result = await User.create({
      name,
      email,
      city,
      role,
    });
    result.insertId = result.id;
    return result;
  } catch (err) {
    throw err;
  }
};

const editUser = async ({ id, name, email, city, role }) => {
  try {
    let result = await User.findOneAndUpdate(
      { _id: id, deleted: false },
      {
        name,
        email,
        city,
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!result) {
      throw new Error("User not found");
    }

    result.affectedRows = 1;
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteUser = async (id) => {
  try {
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return null;
    }
    await foundUser.softDelete({ deleteBy: foundUser.id });
    foundUser.affectedRows = 1;
    return foundUser;
  } catch (err) {
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

    totalCount = await User.countDocuments(searchQuery);
    results = await User.find(searchQuery).skip(skip).limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      page,
      size: limit,
      totalCount,
      totalPages,
      data: results,
    };
  } catch (err) {
    throw err;
  }
};

const restoreUser = async (id) => {
  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return null;
    }
    await foundUser.restore();
    foundUser.affectedRows = 1;
    return foundUser;
  } catch (err) {
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
