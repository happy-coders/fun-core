import { Project } from '@/entities';
import { ProjectsRepository } from '@/use-cases/ports/projects-repository';
import { Storage } from '@/external/storage/storage';

export class StorageProjectsRepository implements ProjectsRepository {
  private static readonly BASE_FILE = 'projects.json';
  private projects: Project[] = [];

  private static instance: StorageProjectsRepository = null;

  private constructor(
    private readonly path: string,
    private readonly storage: Storage,
  ) {}

  static async getInstance(
    path: string,
    storage: Storage,
  ): Promise<StorageProjectsRepository> {
    if (!this.instance) {
      const repository = new StorageProjectsRepository(path, storage);

      const filePath = this._normalizePath(path) + this.BASE_FILE;
      let fileContent = await storage.loadContent(filePath);

      if (fileContent === undefined) {
        fileContent = this._fileFreshContent();
        await storage.save(filePath, fileContent);
      }

      // TODO: Create Serializer abstraction
      repository.projects = JSON.parse(fileContent);

      this.instance = repository;
    }

    return this.instance;
  }

  static dropInstance() {
    this.instance = null;
  }

  async findByName(name: string): Promise<Project | undefined> {
    return this.projects.find(project => project.name === name);
  }

  private static _fileFreshContent() {
    return JSON.stringify([]);
  }

  private static _normalizePath(path: string) {
    if (path.substr(-1) === '/') {
      return path;
    }
    return `${path}/`;
  }
}
