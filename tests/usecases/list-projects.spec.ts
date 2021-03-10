import { Project } from '@/entities';
import { ListProjects } from '@/use-cases/list-projects';
import { ProjectsRepository } from '@/use-cases/ports/projects-repository';

type MakeUseCaseOptions = {
  getAllResult: Project[];
};

const makeUseCase = ({ getAllResult }: MakeUseCaseOptions) => {
  const repository: ProjectsRepository = {
    getAll: jest.fn().mockResolvedValueOnce(getAllResult),
    create: jest.fn(),
    findByName: jest.fn(),
  };

  const useCase = new ListProjects(repository);

  return { useCase, repository };
};

describe('ListProjectsUseCase', () => {
  it('should return an empty list when not exists projects', async () => {
    const { useCase, repository } = makeUseCase({ getAllResult: [] });

    const result = await useCase.list();

    expect(result).toEqual([]);
    expect(repository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should return the existent Projects', async () => {
    const existentProjects: Project[] = [
      new Project('a', 'b', []),
      new Project('c', 'd', []),
    ];

    const { useCase, repository } = makeUseCase({
      getAllResult: existentProjects,
    });

    const result = await useCase.list();

    expect(result).toEqual(existentProjects);
    expect(repository.getAll).toHaveBeenCalledTimes(1);
  });
});
