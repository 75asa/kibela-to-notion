export interface IFileRepository {
  uploadFile(input: any): Promise<void>;
}