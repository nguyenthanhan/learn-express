import {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
  restoreUser,
  getDeletedUsers,
} from "../services/UserService.js";
import { returnResponse, returnError } from "../utils/index.js";

const getUsersApi = async (req, res) => {
  try {
    const payloads = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      keyword: req.query.keyword || "",
    };
    const results = await getAllUsers(payloads);
    const { data, ...remain } = results;
    res.status(200).json(returnResponse(data, remain));
  } catch (err) {
    console.log(err);
    res.status(500).json(returnError());
  }
};

const getUserByIdApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(responseFormatter(returnError("ID is required", 400)));
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json(returnError("User not found", 404));
    }

    res.status(200).json(
      returnResponse({
        success: true,
        data: user,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(returnError());
  }
};

const createUserApi = async (req, res) => {
  const { name, email, city, role } = req.body || {};

  if (!name || !email || !city || !role) {
    return res.status(400).json(returnError("All fields are required", 400));
  }

  try {
    const result = await createUser({ name, email, city, role });

    if (!result?.insertId) {
      res.status(400).json(returnError("Failed to create user", 400));
    }

    res
      .status(201)
      .json(returnResponse(result, undefined, "User created successfully"));
  } catch (err) {
    console.error(err);
    res.status(500).json(returnError());
  }
};

const editUserApi = async (req, res) => {
  const { id } = req.params;
  const { name, email, city, role } = req.body || {};

  if (!id) {
    return res.status(400).json(returnError("ID is required", 400));
  }

  if (!name || !email || !city || !role) {
    return res.status(400).json(returnError("All fields are required", 400));
  }

  try {
    const result = await editUser({ id, name, email, city, role });

    if (!result?.affectedRows) {
      return res.status(404).json(returnError("User not found", 404));
    }

    res
      .status(200)
      .json(returnResponse(null, undefined, "User updated successfully"));
  } catch (err) {
    console.error(err);
    res.status(500).json(returnError());
  }
};

const deleteUserApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(returnError("ID is required", 400));
  }

  try {
    const result = await deleteUser(id);

    if (!result?.affectedRows) {
      return res.status(404).json(returnError("User not found", 404));
    }

    res
      .status(200)
      .json(returnResponse(null, undefined, "User deleted successfully"));
  } catch (err) {
    console.error(err);
    res.status(500).json(returnError());
  }
};

const getDeletedUsersApi = async (req, res) => {
  try {
    const payloads = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      keyword: req.query.keyword || "",
    };

    const results = await getDeletedUsers(payloads);
    const { data, ...remain } = results;
    res.status(200).json(returnResponse(data, remain));
  } catch (err) {
    console.log(err);
    res.status(500).json(returnError());
  }
};

const restoreUserApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(returnError("ID is required", 400));
  }

  try {
    const result = await restoreUser(id);

    if (result === null) {
      return res.status(400).json(returnError("User not found", 400));
    }

    if (!result?.affectedRows) {
      return res.status(404).json(returnError("Fail to restore user", 404));
    }

    res
      .status(200)
      .json(returnResponse(null, undefined, "User restored successfully"));
  } catch (err) {
    console.error(err);
    res.status(500).json(returnError());
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
