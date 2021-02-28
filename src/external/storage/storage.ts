export interface Storage {
  loadContent(path: string): Promise<string | undefined>;
  save(path: string, content: string): Promise<void>;
}
