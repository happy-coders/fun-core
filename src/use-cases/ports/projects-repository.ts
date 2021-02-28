import { Project } from '@/entities';

export interface ProjectsRepository {
  findByName(name: string): Promise<Project | undefined>;
  save(project: Project): Promise<Project>;
}
