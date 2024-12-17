import { createProject, getProjects } from "../services/ProjectService.js";
import { createResponseSuccess, createResponseError } from "../utils/index.js";
import { validateProjectSchema } from "../models/Project.js";

export const getProjectsApi = async (req, res) => {
  try {
    const payloads = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      keyword: req.query.keyword || "",
      sortBy: req.query.sortBy || "name",
    };
    const results = await getProjects(payloads);
    const { data, ...remain } = results;
    res.status(200).json(createResponseSuccess(data, remain));
  } catch (err) {
    console.log(err);
    res.status(500).json(createResponseError());
  }
};

export const createProjectApi = async (req, res) => {
  const {
    type,
    name,
    description,
    startDate,
    endDate,
    status,
    customer,
    leader,
  } = req.body || {};

  const { error } = validateProjectSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error?.details?.length > 0) {
    return res
      .status(400)
      .json(
        createResponseError(error.details.map((d) => d.message).join(", "), 400)
      );
  }

  if (
    !type ||
    !name ||
    !description ||
    !startDate ||
    !endDate ||
    !status ||
    !customer?.name ||
    !customer?.email ||
    !leader?.name ||
    !leader?.email
  ) {
    return res
      .status(400)
      .json(createResponseError("All fields are required", 400));
  }

  try {
    const result = await createProject({
      type,
      name,
      description,
      startDate,
      endDate,
      status,
      customer,
      leader,
    });

    res
      .status(201)
      .json(
        createResponseSuccess(result, undefined, "Project created successfully")
      );
  } catch (err) {
    console.error(err);
    res.status(500).json(createResponseError());
  }
};
