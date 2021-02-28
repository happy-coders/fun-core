import fs from 'fs';
import { parse } from 'path';
import { FileSystemStorage } from '@/external/storage';

const { unlink, rmdir } = fs.promises;

async function removeFolderWithFiles(filePath: string) {
  const parsedPath = parse(filePath);
  await unlink(filePath);
  await rmdir(parsedPath.dir);
}

const makeStorage = () => new FileSystemStorage();

describe('FileSystemStorage', () => {
  describe('save', () => {
    const filePath = `${__dirname}/.fun/storage.json`;

    afterEach(async () => {
      await removeFolderWithFiles(filePath);
    });

    it('should create a file and folders if not exists with content', async () => {
      const storage = makeStorage();
      const content = 'JSON.stringify([])';
      await storage.save(filePath, content);

      expect(filePath).toHaveBeenCreatedFile();
      expect(filePath).toHaveFileContent(content);
    });

    it('should update file content when already exists', async () => {
      const storage = makeStorage();
      await storage.save(
        filePath,
        JSON.stringify({
          foo: 'bar',
        }),
      );

      const newContent = 'JSON';

      await storage.save(filePath, newContent);

      expect(filePath).toHaveBeenCreatedFile();
      expect(filePath).toHaveFileContent(newContent);
    });
  });

  describe('loadContent', () => {
    it('should return undefined when file not exists', async () => {
      const storage = makeStorage();
      const content = await storage.loadContent(
        `${__dirname}/not-existent-file.json`,
      );

      expect(content).toBeUndefined();
    });

    it('should return the file content when file exists', async () => {
      const storage = makeStorage();
      const filePath = `${__dirname}/existent-file.txt`;
      const fileContent = `Hello World`;
      await storage.save(filePath, fileContent);

      const foundContent = await storage.loadContent(filePath);

      expect(foundContent).toBe(fileContent);

      await unlink(filePath);
    });
  });
});
