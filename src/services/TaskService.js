import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

export const getTasks = async ({
  page = 1,
  limit = 20,
  keyword = "",
  sortBy = "name",
  projectId,
} = {}) => {
  try {
    const skip = (page - 1) * limit;
    let searchQuery = {};
    if (keyword) {
      searchQuery["$or"] = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { status: { $regex: keyword, $options: "i" } },
      ];
    }

    if (projectId) {
      searchQuery["project._id"] = projectId;
    }

    searchQuery["status"] = "process";

    let totalCount;
    let results = [];
    const _sortBy = [
      "name",
      "status",
      "startDate",
      "endDate",
      "createdAt",
    ].includes(sortBy)
      ? sortBy
      : "name";

    totalCount = await Task.countDocuments(searchQuery);
    results = await Task.find(searchQuery)
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

export const createTask = async ({
  name,
  description,
  status,
  projectId,
  userId,
  startDate,
  endDate,
}) => {
  try {
    const foundProject = await Project.findOne({ _id: projectId });

    if (!foundProject) {
      return {
        code: 400,
        message: "Project not found",
      };
    }

    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      return {
        code: 400,
        message: "User not found",
      };
    }

    const task = new Task({
      name,
      description,
      status,
      project: foundProject,
      assignee: foundUser,
      startDate,
      endDate,
    });
    const result = await task.save();
    return result;
  } catch (err) {
    throw err;
  }
};

export const updateTask = async ({ id, task }) => {
  try {
    let result = await Task.findOneAndUpdate(
      { _id: id },
      { ...task },
      { new: true, runValidators: true }
    );
    if (!result) {
      return {
        code: 400,
        message: "Task not found",
      };
    }
    result.affectedRows = 1;
    return result;
  } catch (err) {
    throw err;
  }
};
