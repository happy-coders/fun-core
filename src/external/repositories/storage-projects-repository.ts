import { Project } from '@/entities';
import { ProjectsRepository } from '@/use-cases/ports/projects-repository';
import { Storage } from '@/external/storage';

export class StorageProjectsRepository implements ProjectsRepository {
  private static instance: StorageProjectsRepository = null;

  private readonly BASE_FILE = 'projects.json';

  private projectsFilePath: string;
  private projects: Project[] = [];

  private constructor(path: string, private readonly storage: Storage) {
    this.projectsFilePath = this._normalizePath(path) + this.BASE_FILE;
  }

  private _normalizePath(path: string) {
    return path.endsWith('/') ? path : `${path}/`;
  }

  static async getInstance(
    path: string,
    storage: Storage,
  ): Promise<StorageProjectsRepository> {
    if (!this.instance) {
      const repository = new StorageProjectsRepository(path, storage);

      let fileContent = await storage.loadContent(repository.projectsFilePath);
      if (fileContent === undefined) {
        fileContent = this._fileFreshContent();
        await storage.save(repository.projectsFilePath, fileContent);
      }

      repository._setProjectsFromFileContent(fileContent);

      this.instance = repository;
    }

    return this.instance;
  }

  private static _fileFreshContent() {
    return JSON.stringify([]);
  }

  private _setProjectsFromFileContent(content: string) {
    this.projects = JSON.parse(content);
  }

  static dropInstance() {
    this.instance = null;
  }

  async findByName(name: string): Promise<Project | undefined> {
    return this.projects.find(project => project.name === name);
  }

  async create(project: Project): Promise<Project> {
    this.projects.push(project);

    await this.storage.save(
      this.projectsFilePath,
      JSON.stringify(this.projects),
    );

    return project;
  }
}
