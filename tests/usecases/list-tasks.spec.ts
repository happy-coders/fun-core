import { Task } from '@/entities';
import { ListTasks } from '@/use-cases/list-tasks';
import { TasksRepository } from '@/use-cases/ports/tasks-repository';

type MakeUseCaseOptions = {
  getAllResult: Task[];
};

const makeUseCase = ({ getAllResult }: MakeUseCaseOptions) => {
  const repository: TasksRepository = {
    getAll: jest.fn().mockResolvedValue(getAllResult),
    findByName: jest.fn(),
  };

  const useCase = new ListTasks(repository);

  return { useCase, repository };
};

describe('ListTasksUseCase', () => {
  it('should return an empty list when not exists tasks', async () => {
    const { useCase, repository } = makeUseCase({ getAllResult: [] });
    const tasks = await useCase.list();

    expect(tasks).toStrictEqual([]);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should return the existent tasks', async () => {
    const existentTasks: Task[] = [
      new Task('Open VSCode'),
      new Task('Start Spotify music'),
    ];
    const { useCase, repository } = makeUseCase({
      getAllResult: existentTasks,
    });
    const tasks = await useCase.list();

    expect(tasks).toStrictEqual(existentTasks);

    expect(repository.getAll).toHaveBeenCalledTimes(1);
  });
});
