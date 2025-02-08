declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string
      PORT?: string
      HOST?: string
      DATABASE_URL?: string
      FRONTEND_URL?: string
      LOG_LEVEL?: string
      CLEANUP_INTERVAL?: string
      CLEANUP_RETENTION_PERIOD?: string
    }
  }
}

export {} 