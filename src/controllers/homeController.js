import {
  createUser,
  editUser,
  deleteUser,
  getAllUsers,
  getUserById,
} from "../services/CRUDService.js";

const getHomepage = async (req, res) => {
  try {
    const allUsers = await getAllUsers();
    res.render("home.ejs", { users: allUsers });
  } catch (error) {
    console.log(error);
    res.send("An error occurred");
  }
};

const getCreateUserPage = (req, res) => {
  res.render("createUser.ejs");
};

const createUserAction = async (req, res) => {
  const { name, email, city } = req.body ?? {};

  if (!name || !email || !city) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await createUser({ name, email, city });

    if (!result?.insertId) {
      return res.status(500).json({ error: "An error occurred" });
    }

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
};

const getEditUserPage = async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  res.render("editUser.ejs", { user: user });
};

const editUserAction = async (req, res) => {
  const { id } = req.params;
  const { name, email, city } = req.body;

  if (!name || !email || !city) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await editUser({ id, name, email, city });

    if (!result?.affectedRows) {
      return res.status(500).json({ error: "An error occurred" });
    }

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
};

const deleteUserAction = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    const result = await deleteUser(id);

    if (!result?.affectedRows) {
      return res.status(500).json({ error: "An error occurred" });
    }

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
};

const getAbout = (req, res) => {
  res.send("About Page");
};

export {
  getHomepage,
  getAbout,
  getCreateUserPage,
  getEditUserPage,
  createUserAction,
  editUserAction,
  deleteUserAction,
};
