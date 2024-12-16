import {
  addMemberToProject,
  removeMemberFromProject,
} from "../services/ProjectMemberService.js";
import { createResponseSuccess, createResponseError } from "../utils/index.js";

export const addMemberToProjectApi = async (req, res) => {
  const { projectId, userId } = req.body || {};

  if (!projectId || !userId) {
    return res
      .status(400)
      .json(createResponseError("All fields are required", 400));
  }

  try {
    const result = await addMemberToProject({ projectId, userId });
    console.log("result", JSON.stringify(result, null, 2));

    if (result?.code) {
      return res.status(400).json(createResponseError(result?.message, 400));
    }

    res
      .status(200)
      .json(
        createResponseSuccess(
          null,
          undefined,
          "Member added to project successfully"
        )
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};

export const removeMemberFromProjectApi = async (req, res) => {
  const { projectId, userId } = req.body || {};

  if (!projectId || !userId) {
    return res
      .status(400)
      .json(createResponseError("All fields are required", 400));
  }

  try {
    const result = await removeMemberFromProject({ projectId, userId });

    if (result?.code) {
      return res.status(400).json(createResponseError(result?.message, 400));
    }

    res
      .status(200)
      .json(
        createResponseSuccess(
          null,
          undefined,
          "Member removed from project successfully"
        )
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};
