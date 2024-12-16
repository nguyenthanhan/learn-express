import { getTasks, createTask, updateTask } from "../services/TaskService.js";
import { createResponseSuccess, createResponseError } from "../utils/index.js";

export const getTasksApi = async (req, res) => {
  try {
    const payloads = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      keyword: req.query.keyword || "",
      sortBy: req.query.sortBy || "name",
      projectId: req.query.projectId,
    };
    const results = await getTasks(payloads);
    const { data, ...remain } = results;
    res.status(200).json(createResponseSuccess(data, remain));
  } catch (err) {
    console.log(err);
    res.status(500).json(createResponseError());
  }
};

export const createTaskApi = async (req, res) => {
  const { name, description, status, projectId, userId, startDate, endDate } =
    req.body || {};

  if (
    !name ||
    !description ||
    !status ||
    !projectId ||
    !userId ||
    !startDate ||
    !endDate
  ) {
    return res
      .status(400)
      .json(createResponseError("All fields are required", 400));
  }

  try {
    const result = await createTask({
      name,
      description,
      status,
      projectId,
      userId,
      startDate,
      endDate,
    });

    res
      .status(201)
      .json(
        createResponseSuccess(result, undefined, "Task created successfully")
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};

export const updateTaskApi = async (req, res) => {
  const { id } = req.params;
  const task = req.body || {};

  if (!id || Object.keys(task).length === 0) {
    return res
      .status(400)
      .json(createResponseError("Id and task fields are required", 400));
  }

  try {
    const result = await updateTask({ id, task });

    if (result?.code) {
      return res.status(400).json(createResponseError(result?.message, 400));
    }

    res
      .status(200)
      .json(
        createResponseSuccess(
          result,
          undefined,
          "Task status updated successfully"
        )
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};
