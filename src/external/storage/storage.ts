export interface Storage {
  loadContent(path: string): Promise<string>;
  save(path: string, content: string): Promise<void>;
}
