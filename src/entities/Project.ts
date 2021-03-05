import { Task } from '@/entities';

export class Project {
  private tasks: Task[] = [];

  constructor(public readonly name: string, public readonly path: string) {}
}
