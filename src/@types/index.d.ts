/// <reference types="jest" />

declare namespace jest {
  interface Matchers<R> {
    toHaveBeenCreatedFile(): R;
    toHaveFileContent(content: string): R;
  }
}
