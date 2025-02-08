
export interface BaseRepository<T> {
  create(data: Partial<T>): Promise<T>
  update(query: string, data: Partial<T>): Promise<T>
  findOne(query: string): Promise<T | null>
  findAll(query: string): Promise<T[]>
  delete(query: string): Promise<void>
  }
