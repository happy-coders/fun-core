import { Storage } from './storage';
import { writeFile, mkdir, rmdir, unlink } from 'fs/promises';
import { parse } from 'path';

export class FileSystemStorage implements Storage {
  async loadContent(path: string): Promise<string> {
    return undefined;
  }

  async save(path: string, content: string): Promise<void> {
    const parsedPath = parse(path);
    await mkdir(parsedPath.dir, { recursive: true });
    return writeFile(path, content);
  }
}

async function removeFolderWithFiles(filePath: string) {
  const parsedPath = parse(filePath);
  await unlink(filePath);
  await rmdir(parsedPath.dir);
}

describe('FileSystemStorage', () => {
  describe('save', () => {
    const filePath = `${__dirname}/.fun/storage.json`;

    afterEach(async () => {
      await removeFolderWithFiles(filePath);
    });

    it('should create a file and folders if not exists with content', async () => {
      const storage: Storage = new FileSystemStorage();
      const content = 'JSON.stringify([])';
      await storage.save(filePath, content);

      expect(filePath).toHaveBeenCreatedFile();
      expect(filePath).toHaveFileContent(content);
    });

    it('should update file content when already exists', async () => {
      const storage: Storage = new FileSystemStorage();
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
});
