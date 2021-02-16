import { Project } from '@/entities';
import { ProjectsRepository } from '@/use-cases/ports/projects-repository';
import { FileSystem } from '@/external/file-system';

export class FileSystemProjectsRepository implements ProjectsRepository {
  private static readonly BASE_FILE = 'projects.json';

  private static instance: FileSystemProjectsRepository = null;

  private constructor(
    private readonly path: string,
    private readonly fileSystem: FileSystem,
  ) {}

  static async getInstance(
    path: string,
    fileSystem: FileSystem,
  ): Promise<FileSystemProjectsRepository> {
    if (!this.instance) {
      const repository = new FileSystemProjectsRepository(path, fileSystem);

      const filePath = this._normalizePath(path) + this.BASE_FILE;
      const fileContent = await fileSystem.loadContent(filePath);

      if (fileContent === undefined) {
        fileSystem.save(filePath, this._fileFreshContent());
      }
      this.instance = repository;
    }

    return this.instance;
  }

  static dropInstance() {
    this.instance = null;
  }

  findByName(name: string): Promise<Project | undefined> {
    return undefined;
  }

  private static _fileFreshContent() {
    return JSON.stringify([]);
  }

  private static _normalizePath(path) {
    if (path.substr(-1) === '/') {
      return path;
    }
    return `${path}/`;
  }
}
