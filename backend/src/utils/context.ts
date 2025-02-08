import { randomUUID } from 'crypto'

export class RequestContext {
  private static currentId: string = 'no-interaction-id'

  static setInteractionId(): string {
    this.currentId = randomUUID()
    return this.currentId
  }

  static getInteractionId(): string {
    return this.currentId
  }
}