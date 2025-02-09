import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('8000'),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.string().default('info'),
  ITUNES_API_URL: z.string(),
})

type EnvConfig = z.infer<typeof envSchema>

class Config {
  private config: EnvConfig

  constructor() {
    try {
      this.config = envSchema.parse(process.env)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingVars = error.errors.map(err => err.path.join('.')).join(', ')
        throw new Error(`Missing or invalid environment variables: ${missingVars}`)
      }
      throw error
    }
  }

  get env() {
    return this.config
  }
}

export const config = new Config() 