import { Project } from '@/entities';
import { Storage } from '@/external/storage/storage';
import { StorageProjectsRepository } from '@/external/repositories/storage-projects-repository';

const fakePath = '/var/www/html';

type MakeRepositoryParams = {
  loadContentResult?: string;
  path?: string;
};

const makeRepository = async (params?: MakeRepositoryParams) => {
  const { loadContentResult, path = fakePath } = params ?? {};
  const storage: Storage = {
    loadContent: jest.fn().mockResolvedValueOnce(loadContentResult),
    save: jest.fn(),
  };
  const repository = await StorageProjectsRepository.getInstance(path, storage);

  return {
    repository,
    storage,
  };
};

describe('StorageProjectsRepository', () => {
  describe('getInstance', () => {
    afterEach(() => {
      StorageProjectsRepository.dropInstance();
    });

    it.each([
      ['~/Desktop', '~/Desktop/projects.json'],
      ['~/Desktop/', '~/Desktop/projects.json'],
    ])(
      'should create the projects file with fresh content when not exists',
      async (path: string, filePath: string) => {
        const { storage } = await makeRepository({
          path,
        });

        expect(storage.loadContent).toHaveBeenCalledTimes(1);
        expect(storage.loadContent).toHaveBeenCalledWith(filePath);

        expect(storage.save).toHaveBeenCalledTimes(1);
        expect(storage.save).toHaveBeenCalledWith(filePath, JSON.stringify([]));

        expect(storage.loadContent).toHaveBeenCalledBefore(storage.save as any);
      },
    );

    it.each([
      ['~/Desktop', '~/Desktop/projects.json'],
      ['~/Desktop/', '~/Desktop/projects.json'],
    ])(
      'should not try create the projects file when already exists',
      async (path: string, filePath: string) => {
        const { storage } = await makeRepository({
          loadContentResult: '[]',
          path,
        });

        expect(storage.loadContent).toHaveBeenCalledTimes(1);
        expect(storage.loadContent).toHaveBeenCalledWith(filePath);

        expect(storage.save).not.toHaveBeenCalled();
      },
    );
  });

  describe('findByName', () => {
    afterEach(() => {
      StorageProjectsRepository.dropInstance();
    });

    it('should return undefined when projects list is empty', async () => {
      const { repository } = await makeRepository({
        loadContentResult: '[]',
      });

      const result = await repository.findByName('some-project');

      expect(result).toBeUndefined();
    });

    it('should return undefined when project not exists and exists other projects', async () => {
      const projects = [
        {
          name: 'Fun',
          path: fakePath,
          tasks: [],
        },
      ];

      const { repository } = await makeRepository({
        loadContentResult: JSON.stringify(projects),
      });
      const name = 'some-project';

      const result = await repository.findByName(name);

      expect(result).toBeUndefined();
    });

    it('should return the project when exists', async () => {
      const project = new Project('Fun', fakePath);
      const projects = [project];

      const { repository } = await makeRepository({
        loadContentResult: JSON.stringify(projects),
      });

      const result = await repository.findByName(project.name);

      expect(result).toEqual(project);
    });
  });
});
