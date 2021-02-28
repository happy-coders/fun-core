import fs from 'fs';
import { parse } from 'path';
import { Storage } from './storage';

const { readFile, mkdir, writeFile } = fs.promises;

export class FileSystemStorage implements Storage {
  async loadContent(path: string): Promise<string> {
    try {
      const content = await readFile(path);

      return content.toString();
    } catch {
      return undefined;
    }
  }

  async save(path: string, content: string): Promise<void> {
    const parsedPath = parse(path);
    await mkdir(parsedPath.dir, { recursive: true });
    return writeFile(path, content);
  }
}
