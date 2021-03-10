import { Project } from '@/entities';

export interface ProjectsRepository {
  findByName(name: string): Promise<Project | undefined>;
  create(project: Project): Promise<Project>;
  getAll(): Promise<Project[]>;
}
