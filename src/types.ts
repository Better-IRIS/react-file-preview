export interface PreviewFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
}

export type FileType =
  | 'image'
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'video'
  | 'audio'
  | 'markdown'
  | 'text'
  | 'unsupported';

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

