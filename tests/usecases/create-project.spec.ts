import { Project } from '@/entities';
import { CreateProject } from '@/use-cases/create-project';
import { ProjectAlreadyExists } from '@/use-cases/errors/project-already-exists';
import { ProjectsRepository } from '@/use-cases/ports/projects-repository';

const makeUseCase = () => {
  const projectsRepository: ProjectsRepository = {
    findByName: jest.fn(),
    create: jest.fn(),
  };
  const useCase = new CreateProject(projectsRepository);

  return {
    projectsRepository,
    useCase,
  };
};

describe('CreateProjectUseCase', () => {
  it('should return an error when already exists a project with the same name', async () => {
    const { projectsRepository, useCase } = makeUseCase();

    const existentProject = new Project('funny-project', '/var/www/html');

    jest
      .spyOn(projectsRepository, 'findByName')
      .mockResolvedValueOnce(existentProject);

    const result = await useCase.create(
      existentProject.name,
      '~/Projects/funny',
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProjectAlreadyExists);

    expect(projectsRepository.findByName).toHaveBeenCalledTimes(1);
    expect(projectsRepository.findByName).toHaveBeenCalledWith(
      existentProject.name,
    );

    expect(projectsRepository.create).not.toHaveBeenCalled();
  });

  it('should create the project when not exists', async () => {
    const { projectsRepository, useCase } = makeUseCase();

    jest
      .spyOn(projectsRepository, 'findByName')
      .mockResolvedValueOnce(undefined);

    const name = 'some-project';
    const source = '~/Desktop';

    const newProject = new Project(name, source);
    jest.spyOn(projectsRepository, 'create').mockResolvedValueOnce(newProject);

    const result = await useCase.create(name, source);

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Project);

    const createdProject = result.value as Project;

    expect(createdProject.name).toBe(name);
    expect(createdProject.path).toBe(source);

    expect(projectsRepository.create).toHaveBeenCalledTimes(1);
    expect(projectsRepository.create).toHaveBeenCalledWith(newProject);
  });
});
