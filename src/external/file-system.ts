export interface FileSystem {
  loadContent(path: string): Promise<string>;
  save(path: string, content: string): Promise<void>;
}
