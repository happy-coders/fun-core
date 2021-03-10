import { ProjectsRepository } from './ports/projects-repository';

export class ListProjects {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async list() {
    return this.projectsRepository.getAll();
  }
}
