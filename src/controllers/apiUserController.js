import {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
  restoreUser,
  getDeletedUsers,
} from "../services/UserService.js";
import { createResponseSuccess, createResponseError } from "../utils/index.js";

const getUsersApi = async (req, res) => {
  try {
    const payloads = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      keyword: req.query.keyword || "",
      sortBy: req.query.sortBy || "name",
    };
    const results = await getAllUsers(payloads);
    const { data, ...remain } = results;
    res.status(200).json(createResponseSuccess(data, remain));
  } catch (err) {
    console.log(err);
    res.status(500).json(createResponseError());
  }
};

const getUserByIdApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(responseFormatter(createResponseError("ID is required", 400)));
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json(createResponseError("User not found", 404));
    }

    res.status(200).json(createResponseSuccess(user));
  } catch (err) {
    console.log(err);
    res.status(500).json(createResponseError());
  }
};

const createUserApi = async (req, res) => {
  const { name, email, city, role } = req.body || {};

  if (!name || !email || !city || !role) {
    return res
      .status(400)
      .json(createResponseError("All fields are required", 400));
  }

  try {
    const result = await createUser({ name, email, city, role });

    if (!result?.insertId) {
      res.status(400).json(createResponseError("Failed to create user", 400));
    }

    res
      .status(201)
      .json(
        createResponseSuccess(result, undefined, "User created successfully")
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};

const editUserApi = async (req, res) => {
  const { id } = req.params;
  const { name, email, city, role } = req.body || {};

  if (!id) {
    return res.status(400).json(createResponseError("ID is required", 400));
  }

  if (!name || !email || !city || !role) {
    return res
      .status(400)
      .json(createResponseError("All fields are required", 400));
  }

  try {
    const result = await editUser({ id, name, email, city, role });

    if (!result?.affectedRows) {
      return res.status(404).json(createResponseError("User not found", 404));
    }

    res
      .status(200)
      .json(
        createResponseSuccess(null, undefined, "User updated successfully")
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};

const deleteUserApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(createResponseError("ID is required", 400));
  }

  try {
    const result = await deleteUser(id);

    if (!result?.affectedRows) {
      return res.status(404).json(createResponseError("User not found", 404));
    }

    res
      .status(200)
      .json(
        createResponseSuccess(null, undefined, "User deleted successfully")
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};

const getDeletedUsersApi = async (req, res) => {
  try {
    const payloads = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      keyword: req.query.keyword || "",
      sortBy: req.query.sortBy || "name",
    };

    const results = await getDeletedUsers(payloads);
    const { data, ...remain } = results;
    res.status(200).json(createResponseSuccess(data, remain));
  } catch (err) {
    console.log(err);
    res.status(500).json(createResponseError());
  }
};

const restoreUserApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(createResponseError("ID is required", 400));
  }

  try {
    const result = await restoreUser(id);

    if (result === null) {
      return res.status(400).json(createResponseError("User not found", 400));
    }

    if (!result?.affectedRows) {
      return res
        .status(404)
        .json(createResponseError("Fail to restore user", 404));
    }

    res
      .status(200)
      .json(
        createResponseSuccess(null, undefined, "User restored successfully")
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};

export {
  getUsersApi,
  createUserApi,
  deleteUserApi,
  getUserByIdApi,
  editUserApi,
  restoreUserApi,
  getDeletedUsersApi,
};
