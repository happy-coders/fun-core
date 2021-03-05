import { Task } from '@/entities';

export interface TasksRepository {
  getAll(): Promise<Task[]>;
  findByName(name: string): Promise<Task | undefined>;
}
