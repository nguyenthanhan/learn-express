import Project from "../models/Project.js";
import User from "../models/User.js";

export const addMemberToProject = async ({ projectId, userId }) => {
  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      return {
        code: 400,
        message: "User not found",
      };
    }

    const foundedProject = await Project.findOne({ _id: projectId });

    if (!foundedProject) {
      return {
        code: 400,
        message: "Project not found",
      };
    }

    if (foundedProject.members.includes(userId)) {
      return {
        code: 400,
        message: "User already in project",
      };
    }

    let result = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $push: {
          members: foundUser,
        },
      },
      { new: true }
    );
    return result;
  } catch (err) {
    throw err;
  }
};

export const removeMemberFromProject = async ({ projectId, userId }) => {
  try {
    const foundUser = await User.findOne({ _id: userId });

    if (!foundUser) {
      return {
        code: 400,
        message: "User not found",
      };
    }

    const foundedProject = await Project.findOne({ _id: projectId });

    if (!foundedProject) {
      return {
        code: 400,
        message: "Project not found",
      };
    }

    if (!foundedProject.members.includes(userId)) {
      return {
        code: 400,
        message: "User not in project",
      };
    }

    let result = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $pull: {
          members: userId,
        },
      },
      { new: true }
    );
    return result;
  } catch (err) {
    throw err;
  }
};
