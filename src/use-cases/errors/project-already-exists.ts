export class ProjectAlreadyExists extends Error {
  constructor(name: string) {
    super(`Already exists a project named "${name}"`);
  }
}
