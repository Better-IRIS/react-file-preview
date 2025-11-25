import { pdfjs } from 'react-pdf';

/**
 * PDF.js Worker 配置选项
 */
export interface PdfConfigOptions {
  /**
   * PDF.js worker 文件路径
   * 默认使用 CDN: `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`
   */
  workerSrc?: string;
  
  /**
   * CMap 文件目录路径
   * 默认使用 CDN: `https://unpkg.com/pdfjs-dist@${version}/cmaps/`
   */
  cMapUrl?: string;
  
  /**
   * 是否使用压缩的 CMap 文件
   * 默认: true
   */
  cMapPacked?: boolean;
}

/**
 * 配置 PDF.js
 *
 * @example
 * ```ts
 * // 使用本地静态文件（推荐用于生产环境）
 * configurePdfjs({
 *   workerSrc: '/pdfjs/pdf.worker.min.mjs',
 *   cMapUrl: '/pdfjs/cmaps/',
 *   cMapPacked: true
 * });
 * ```
 *
 * @example
 * ```ts
 * // 使用 CDN（默认配置）
 * configurePdfjs(); // 自动使用 unpkg CDN
 * ```
 */
export function configurePdfjs(options?: PdfConfigOptions) {
  if (typeof window === 'undefined') return;

  const {
    workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`,
    cMapUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked = true
  } = options || {};

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  // @ts-ignore - cMapUrl 和 cMapPacked 在 react-pdf 的类型定义中不存在，但在运行时可用
  pdfjs.GlobalWorkerOptions.cMapUrl = cMapUrl;
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.cMapPacked = cMapPacked;
}

// 默认使用 CDN 配置
configurePdfjs();

export { pdfjs };

