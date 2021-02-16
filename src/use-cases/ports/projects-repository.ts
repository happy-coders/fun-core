import { Project } from '@/entities';

export interface ProjectsRepository {
  findByName(name: string): Promise<Project | undefined>;
}
