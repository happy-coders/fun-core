import { Task } from '@/entities';
import { TasksRepository } from './ports/tasks-repository';

export class ListTasks {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async list(): Promise<Task[]> {
    return this.tasksRepository.getAll();
  }
}
