import { FileSystem } from '@/external/file-system';
import { FileSystemProjectsRepository } from '@/external/repositories/file-system-projects-repository';

// const path = '~/Desktop';
// const makeRepository = () => {
//   const fileSystem: FileSystem = {
//     loadContent: jest.fn(),
//     save: jest.fn(),
//   };
//   const repository = new FileSystemProjectsRepository(path, fileSystem);

//   return {
//     repository,
//     fileSystem,
//   };
// };

describe('FileSystemProjectsRepository', () => {
  describe('getInstance', () => {
    it.each([
      ['~/Desktop', '~/Desktop/projects.json'],
      ['~/Desktop/', '~/Desktop/projects.json'],
    ])(
      'should create the projects file when not exists',
      async (path: string, filePath: string) => {
        const fileSystem: FileSystem = {
          loadContent: jest.fn().mockResolvedValueOnce(undefined),
          save: jest.fn(),
        };

        await FileSystemProjectsRepository.getInstance(path, fileSystem);

        expect(fileSystem.loadContent).toHaveBeenCalledTimes(1);
        expect(fileSystem.loadContent).toHaveBeenCalledWith(filePath);

        expect(fileSystem.save).toHaveBeenCalledTimes(1);
        expect(fileSystem.save).toHaveBeenCalledWith(
          filePath,
          JSON.stringify([]),
        );

        FileSystemProjectsRepository.dropInstance();
      },
    );
  });

  describe('findByName', () => {
    it.todo('should return undefined when project not exists');
  });
});
