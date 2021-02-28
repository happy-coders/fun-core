import { Project } from '@/entities';
import { Either, left, right } from '@/shared/either';
import { ProjectAlreadyExists } from './errors/project-already-exists';
import { ProjectsRepository } from './ports/projects-repository';

type CreateProjectError = ProjectAlreadyExists;
type CreateProjectResponse = Either<CreateProjectError, Project>;

export class CreateProject {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async create(name: string, path: string): Promise<CreateProjectResponse> {
    const existentProject = await this.projectsRepository.findByName(name);
    if (existentProject) {
      return left(new ProjectAlreadyExists(name));
    }

    const project = await this.projectsRepository.save(new Project(name, path));

    return right(project);
  }
}
