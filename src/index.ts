import "./index.css";

import packageJson from "../package.json";

export const VERSION = packageJson.version;

export { FilePreviewModal } from "./FilePreviewModal";

export type {
  CustomRenderer,
  FileType,
  PreviewFile,
  PreviewFileInput,
  PreviewFileLink,
  PreviewState,
  ToolbarAction,
} from "./types";

export { normalizeFile, normalizeFiles } from "./utils/fileNormalizer";

export { configurePdfjs, pdfjs } from "./utils/pdfConfig";
export type { PdfConfigOptions } from "./utils/pdfConfig";
