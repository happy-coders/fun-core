import { Task } from '@/entities';

export interface TasksRepository {
  getAll(): Promise<Task[]>;
}
