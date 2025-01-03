import dotenv from "dotenv";
import "dotenv/config";

// Load environment variables based on NODE_ENV
const environment = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${environment}` });

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOSTNAME: process.env.HOSTNAME,
  API_VERSION: process.env.API_VERSION,

  // SQL Database
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_ROOT_USER: process.env.MYSQL_ROOT_USER,
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,

  // MongoDB Database
  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_USER: process.env.MONGODB_USER,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  MONGODB_DB: process.env.MONGODB_DB,

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

console.log(
  "Environment",
  JSON.stringify(
    { NODE_ENV: env.NODE_ENV, API_VERSION: env.API_VERSION },
    null,
    2
  )
);

export default env;
