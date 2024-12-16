import Project from "../models/Project.js";

export const getProjects = async ({
  page = 1,
  limit = 20,
  keyword = "",
  sortBy = "name",
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

    totalCount = await Project.countDocuments(searchQuery);
    results = await Project.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .populate("tasks")
      .populate("members")
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

export const getProjectById = async (id) => {
  try {
    let result = await Project.findOne({ _id: id });
    return result;
  } catch (err) {
    throw err;
  }
};

export const createProject = async ({ type, ...project }) => {
  try {
    let result;
    if (type === "EMPTY-PROJECT") {
      //
    }
    result = await Project.create(project);
    result.insertId = result.id;
    return result;
  } catch (err) {
    throw err;
  }
};

export const editProject = async ({ id, ...project }) => {
  try {
    let result = await Project.findOneAndUpdate(
      { _id: id },
      {
        ...project,
      },
      { new: true }
    );
    return result;
  } catch (err) {
    throw err;
  }
};
