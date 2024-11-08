import "dotenv/config";

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOSTNAME: process.env.HOSTNAME,
  API_VERSION: process.env.API_VERSION,

  // Database
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_ROOT_USER: process.env.MYSQL_ROOT_USER,
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
};

console.log("Environment", JSON.stringify(env, null, 2));

export default env;
