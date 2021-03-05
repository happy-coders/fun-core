import { Project, Task } from '@/entities';
import { CreateProject } from '@/use-cases/create-project';
import { TaskNotFound } from '@/use-cases/errors';
import { ProjectAlreadyExists } from '@/use-cases/errors/project-already-exists';
import { ProjectsRepository } from '@/use-cases/ports/projects-repository';
import { TasksRepository } from '@/use-cases/ports/tasks-repository';

const makeUseCase = () => {
  const tasksRepository: TasksRepository = {
    getAll: jest.fn(),
    findByName: jest.fn(),
  };
  const projectsRepository: ProjectsRepository = {
    findByName: jest.fn(),
    create: jest.fn(),
  };
  const useCase = new CreateProject(projectsRepository, tasksRepository);

  return {
    projectsRepository,
    useCase,
    tasksRepository,
  };
};

describe('CreateProjectUseCase', () => {
  it('should return an error when already exists a project with the same name', async () => {
    const { projectsRepository, useCase } = makeUseCase();

    const existentProject = new Project('funny-project', '/var/www/html', []);

    jest
      .spyOn(projectsRepository, 'findByName')
      .mockResolvedValueOnce(existentProject);

    const result = await useCase.create(
      existentProject.name,
      '~/Projects/funny',
      [],
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProjectAlreadyExists);

    expect(projectsRepository.findByName).toHaveBeenCalledTimes(1);
    expect(projectsRepository.findByName).toHaveBeenCalledWith(
      existentProject.name,
    );

    expect(projectsRepository.create).not.toHaveBeenCalled();
  });

  it('should return an error when some task not exists', async () => {
    const { projectsRepository, useCase, tasksRepository } = makeUseCase();

    const tasksNames = ['Open VSCode', 'Open Spotify'];

    jest
      .spyOn(tasksRepository, 'findByName')
      .mockResolvedValueOnce(new Task(tasksNames[0]))
      .mockResolvedValueOnce(undefined);

    jest
      .spyOn(projectsRepository, 'findByName')
      .mockResolvedValueOnce(undefined);

    const name = 'some-project';
    const path = '~/Desktop';

    const result = await useCase.create(name, path, tasksNames);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(TaskNotFound);

    expect(tasksRepository.findByName).toHaveBeenCalledTimes(2);
    expect(tasksRepository.findByName).toHaveBeenNthCalledWith(
      1,
      tasksNames[0],
    );
    expect(tasksRepository.findByName).toHaveBeenNthCalledWith(
      2,
      tasksNames[1],
    );
  });

  it('should create the project when not exists', async () => {
    const { projectsRepository, useCase, tasksRepository } = makeUseCase();

    const tasksNames = ['Open VSCode', 'Open Spotify'];
    const tasks = tasksNames.map(taskName => new Task(taskName));

    jest
      .spyOn(tasksRepository, 'findByName')
      .mockResolvedValueOnce(new Task(tasksNames[0]))
      .mockResolvedValueOnce(new Task(tasksNames[1]));

    jest
      .spyOn(projectsRepository, 'findByName')
      .mockResolvedValueOnce(undefined);

    const name = 'some-project';
    const path = '~/Desktop';

    const newProject = new Project(name, path, tasks);
    jest.spyOn(projectsRepository, 'create').mockResolvedValueOnce(newProject);

    const result = await useCase.create(name, path, tasksNames);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Project);

    const createdProject = result.value as Project;

    expect(createdProject.name).toBe(name);
    expect(createdProject.path).toBe(path);
    expect(createdProject.tasks).toEqual(tasks);

    expect(projectsRepository.create).toHaveBeenCalledTimes(1);
    expect(projectsRepository.create).toHaveBeenCalledWith(newProject);

    expect(tasksRepository.findByName).toHaveBeenCalledTimes(2);
    expect(tasksRepository.findByName).toHaveBeenNthCalledWith(
      1,
      tasksNames[0],
    );
    expect(tasksRepository.findByName).toHaveBeenNthCalledWith(
      2,
      tasksNames[1],
    );
  });
});
