import { Project, Task } from '@/entities';
import { Either, left, right } from '@/shared/either';
import { ProjectAlreadyExists, TaskNotFound } from './errors';
import { ProjectsRepository } from './ports/projects-repository';
import { TasksRepository } from './ports/tasks-repository';

type CreateProjectError = ProjectAlreadyExists | TaskNotFound;
type CreateProjectResponse = Either<CreateProjectError, Project>;

export class CreateProject {
  constructor(
    private readonly projectsRepository: ProjectsRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async create(
    name: string,
    path: string,
    tasksNames: string[],
  ): Promise<CreateProjectResponse> {
    const existentProject = await this.projectsRepository.findByName(name);
    if (existentProject) {
      return left(new ProjectAlreadyExists(name));
    }

    const tasks = await this.getTasksByNames(tasksNames);
    if (tasks.isLeft()) {
      return left(tasks.value);
    }

    const project = await this.projectsRepository.create(
      new Project(name, path, tasks.value),
    );

    return right(project);
  }

  private async getTasksByNames(
    tasksNames: string[],
  ): Promise<Either<TaskNotFound, Task[]>> {
    const tasksPromises = tasksNames.map(async taskName => {
      const task = await this.tasksRepository.findByName(taskName);
      if (!task) {
        throw new TaskNotFound(taskName);
      }
      return task;
    });

    try {
      return right(await Promise.all(tasksPromises));
    } catch (e) {
      return left(e);
    }
  }
}
