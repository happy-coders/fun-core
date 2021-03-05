import { Task } from '@/entities';

export class Project {
  constructor(
    public readonly name: string,
    public readonly path: string,
    public readonly tasks: Task[],
  ) {}
}
