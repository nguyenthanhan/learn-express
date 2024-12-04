import {
  getAllUsers,
  getUserById,
  createUser,
  editUser,
  deleteUser,
  restoreUser,
  getDeletedUsers,
} from "../services/UserService.js";

const getUsersApi = async (req, res) => {
  try {
    const payloads = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      keyword: req.query.keyword || "",
    };
    const results = await getAllUsers(payloads);

    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserByIdApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ results: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createUserApi = async (req, res) => {
  const { name, email, city, role } = req.body || {};

  if (!name || !email || !city || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await createUser({ name, email, city, role });

    if (!result?.insertId) {
      res.status(400).json({ error: "Failed to create user" });
    }

    res.status(201).json({
      message: "User created successfully",
      id: result.insertId,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editUserApi = async (req, res) => {
  const { id } = req.params;
  const { name, email, city, role } = req.body || {};

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  if (!name || !email || !city || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await editUser({ id, name, email, city, role });

    if (!result?.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
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
    const result = await deleteUser(id);

    if (!result?.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDeletedUsersApi = async (req, res) => {
  try {
    const deletedUsers = await getDeletedUsers();

    res.status(200).json({ results: deletedUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const restoreUserApi = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const result = await restoreUser(id);

    if (result === null) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!result?.affectedRows) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
