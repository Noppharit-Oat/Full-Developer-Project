// src/config/environment.ts

interface EnvironmentConfig {
    frontend: {
      url: string;
      port: number;
    };
    backend: {
      url: string;
      port: number;
    };
    database: {
      host: string;
      port: number;
      name: string;
      user: string;
      password: string;
    };
  }
  
  const config: EnvironmentConfig = {
    frontend: {
      url: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost',
      port: parseInt(process.env.NEXT_PUBLIC_FRONTEND_PORT || '3000'),
    },
    backend: {
      url: process.env.BACKEND_URL || 'http://localhost',
      port: parseInt(process.env.BACKEND_PORT || '5000'),
    },
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      name: process.env.DB_NAME || 'full_developer_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
    },
  };
  
  export const getFullUrl = (type: 'frontend' | 'backend'): string => {
    const { url, port } = config[type];
    return `${url}:${port}`;
  };
  
  export const getDatabaseUrl = (): string => {
    const { host, port, name, user, password } = config.database;
    return `postgresql://${user}:${password}@${host}:${port}/${name}`;
  };
  
  export default config;