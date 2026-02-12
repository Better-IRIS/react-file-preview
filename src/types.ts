export interface PreviewFileLink {
  id?: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface PreviewFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export type PreviewFileInput = File | PreviewFileLink | string;

export type FileType =
  | "image"
  | "pdf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "video"
  | "audio"
  | "markdown"
  | "text"
  | "unsupported";

export interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface PreviewState {
  zoom: number;
  rotation: number;
  currentPage: number;
  totalPages: number;
}

export interface CustomRenderer {
  test: (file: PreviewFile) => boolean;
  render: (file: PreviewFile) => React.ReactNode;
}
