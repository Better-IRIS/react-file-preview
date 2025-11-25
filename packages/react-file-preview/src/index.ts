// 导入样式
import './index.css';

// 导出主组件
export { FilePreviewModal } from './FilePreviewModal';

// 导出类型定义
export type {
  PreviewFile,
  PreviewFileLink,
  PreviewFileInput,
  FileType,
  ToolbarAction,
  PreviewState,
  CustomRenderer,
} from './types';

// 导出工具函数
export { normalizeFile, normalizeFiles } from './utils/fileNormalizer';

// 导出 PDF.js 配置函数和类型
export { configurePdfjs, pdfjs } from './utils/pdfConfig';
export type { PdfConfigOptions } from './utils/pdfConfig';

