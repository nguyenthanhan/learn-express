import "dotenv/config";

const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  HOSTNAME: process.env.HOSTNAME,
  API_VERSION: process.env.API_VERSION,
};

console.log("Environment", JSON.stringify(env, null, 2));

export default env;
