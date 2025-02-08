import { FastifyInstance as BaseFastifyInstance, FastifyRequest as BaseFastifyRequest, FastifyReply as BaseFastifyReply } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance extends BaseFastifyInstance {
    // Add any custom properties to the instance
  }

  export interface FastifyRequest extends BaseFastifyRequest {
    // Add any custom properties to the request object
  }

  export interface FastifyReply extends BaseFastifyReply {
    elapsedTime?: number
  }
} 