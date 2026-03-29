export interface Book {
  id: string;
  title: string;
  fileName: string;
  viewUrl: string;
  downloadUrl: string;
  driveUrl: string;
  thumbnail: string;
  sizeBytes: number | null;
  createdAt: string | null;
}
