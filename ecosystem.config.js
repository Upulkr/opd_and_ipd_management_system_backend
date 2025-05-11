module.exports = {
  apps: [
    {
      name: "hms",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
