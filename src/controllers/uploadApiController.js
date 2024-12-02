import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import CloudinaryService from "../services/CloudinaryService.js";

const allowedExtensions = [".jpg", ".jpeg", ".png"];

const validateFileExtension = (file) => {
  const fileExtension = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error(
      `Invalid file type: ${fileExtension}. Only .jpg, .jpeg, and .png files are allowed.`
    );
  }
  return fileExtension;
};

const moveFileToUploadDir = async (file, uploadDir) => {
  const fileName = uuidv4();
  const newFileName = `${fileName}${path.extname(file.name).toLowerCase()}`;
  const uploadPath = path.join(uploadDir, newFileName);
  await file.mv(uploadPath);

  return {
    name: newFileName,
    mimetype: file.mimetype,
    size: file.size,
    md5: file.md5,
    uploadPath,
  };
};

const uploadFilesToCloudinary = async (uploadedFiles, dateFolderName) => {
  const uploadPromises = uploadedFiles.map(async (file) => {
    const result = await CloudinaryService.upload(file.uploadPath, {
      folder: path.join("images", dateFolderName),
      transformation: [{ quality: "auto", fetch_format: "auto" }], // Optimize images
    });
    const { api_key, ...rest } = result;
    return rest;
  });
  return await Promise.all(uploadPromises);
};

const removeUploadDir = (uploadDir) => {
  fs.rm(uploadDir, { recursive: true, force: true }, (err) => {
    if (err) throw err;
    console.log(`${uploadDir} is deleted!`);
  });
};

const uploadFileApi = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        status: false,
        message: "No files were uploaded",
      });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Get today's date and create a folder name
    const uploadDir = path.join(process.cwd(), "uploads");

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const getFilesPromises = files.map(async (file) => {
      const fileExtension = validateFileExtension(file);
      return moveFileToUploadDir(file, uploadDir);
    });
    const processedFiles = await Promise.all(getFilesPromises);

    const today = new Date();
    const dateFolderName = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    const uploadedFilesPromises = await uploadFilesToCloudinary(
      processedFiles,
      dateFolderName
    );

    res.send({
      status: true,
      message: "Files are uploaded",
      data: uploadedFilesPromises,
    });

    removeUploadDir(uploadDir);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getImageInfoApi = async (req, res) => {
  try {
    const { publicId } = req.query;
    const result = await CloudinaryService.getInfo(publicId);
    res.send(result);
  } catch (err) {
    console.log("error", JSON.stringify(err, null, 2));

    res.status(500).send(err);
  }
};

export { uploadFileApi, getImageInfoApi };
