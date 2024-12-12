import mongoose from "mongoose";
import User from "../models/User.js";
import City from "../models/City.js";

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

    totalCount = await User.countDocuments(searchQuery);
    results = await User.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .populate("city");

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
    let result = await User.findOne({ _id: id, deleted: false }).populate(city);
    return result;
  } catch (err) {
    throw err;
  }
};

const createUser = async ({ name, email, city, role }) => {
  try {
    let foundCity = await City.findOne({ name: city.name });
    if (!foundCity) {
      foundCity = new City({ name: city.name, address: city.address });
      await foundCity.save();
    }

    let result = await User.create({
      name,
      email,
      city: foundCity._id,
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
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }

    let cityId = city;
    if (city && typeof city === "object") {
      let foundCity = await City.findOne({ name: city.name });
      if (!foundCity) {
        foundCity = new City({ name: city.name, address: city.address });
        await foundCity.save();
      }
      cityId = foundCity._id;
    }

    let result = await User.findOneAndUpdate(
      { _id: id, deleted: false },
      {
        name,
        email,
        city: cityId,
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("city");

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
    await foundUser.softDelete({ deleteBy: 1 });
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
