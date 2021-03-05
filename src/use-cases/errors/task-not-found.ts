export class TaskNotFound extends Error {
  constructor(name: string) {
    super(`Not found task with "${name}"`);
  }
}
