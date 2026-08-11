module.exports = {
  apps: [
    {
      name: "conectovolt-api",
      script: "dist/src/main.js",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
        DB_PROVIDER: "mysql",
      },
      max_memory_restart: "512M",
      exp_backoff_restart_delay: 100,
    },
    {
      name: "conectovolt-frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3002",
      cwd: "./frontend",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "/api/v1",
      },
      max_memory_restart: "256M",
      exp_backoff_restart_delay: 100,
    },
  ],
};
