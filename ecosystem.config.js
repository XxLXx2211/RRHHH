module.exports = {
  apps: [
    {
      name: 'nextn-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max_old_space_size=4096',
      watch: false,
      ignore_watch: [
        'node_modules',
        '.next',
        'logs',
        '.git'
      ],
      // Configuración de auto-restart
      max_restarts: 10,
      min_uptime: '10s',
      // Variables de entorno específicas
      env_vars: {
        DATABASE_URL: 'file:./prisma/dev.db'
      }
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/nextn.git',
      path: '/var/www/nextn',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
