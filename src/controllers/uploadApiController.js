import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
    const uploadedFiles = [];
    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    // Get today's date and create a folder name
    const today = new Date();
    const folderName = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    const uploadDir = path.join(process.cwd(), "uploads", folderName);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const fileExtension = path.extname(file.name);

      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).send({
          status: false,
          message: `Invalid file type: ${fileExtension}. Only .jpg, .jpeg, and .png files are allowed.`,
        });
      }

      const fileName = uuidv4();
      const newFileName = `${fileName}${fileExtension}`;
      const uploadPath = path.join(uploadDir, newFileName);

      await file.mv(uploadPath);

      uploadedFiles.push({
        name: newFileName,
        mimetype: file.mimetype,
        size: file.size,
        md5: file.md5,
      });
    }

    res.send({
      status: true,
      message: "Files are uploaded",
      data: uploadedFiles,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export { uploadFileApi };
