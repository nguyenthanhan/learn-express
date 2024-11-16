import "dotenv/config";

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
};

console.log("Environment", JSON.stringify(env, null, 2));

export default env;
