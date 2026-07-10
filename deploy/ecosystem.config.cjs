module.exports = {
  apps: [
    {
      name: 'buildroonix-api',
      cwd: './backend',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: { NODE_ENV: 'production' },
      max_memory_restart: '500M',
      time: true,
    },
    {
      name: 'buildroonix-web',
      cwd: '.',
      script: 'node_modules/next/dist/bin/next',
      args: 'start --port 3000',
      instances: 2,
      exec_mode: 'cluster',
      env_production: { NODE_ENV: 'production' },
      max_memory_restart: '500M',
      time: true,
    },
  ],
};
