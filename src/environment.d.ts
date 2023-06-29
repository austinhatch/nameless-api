declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT: number;
        DOMAINS:string[];
        DATABASE_URL:string;
        JWT_SECRET:string;
        JWT_EXPIRATION:number;
        APP_NAME:string;
        PRIVATE_KEY:string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}