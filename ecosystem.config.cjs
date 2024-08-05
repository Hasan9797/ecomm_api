module.exports = {
  apps: [
    {
      name: "ecommApi",
      script: "./src/server.js",
      env: {
        NODE_ENV: "production",
        DB_HOST: "localhost",
        DB_USER: "postgres",
        DB_PASSWORD: "pg97",
        DB_NAME: "ecomm_api",
      },
    },
  ],
};
