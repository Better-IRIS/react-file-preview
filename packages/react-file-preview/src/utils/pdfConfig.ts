import { pdfjs } from 'react-pdf';

/**
 * PDF.js Worker 配置
 *
 * 配置策略:
 * 1. 优先使用库内置的静态文件（打包在 lib/pdfjs 目录）
 * 2. 如果静态文件加载失败，兜底使用 CDN
 */

// 配置 PDF.js worker 和 cmaps
if (typeof window !== 'undefined') {
    try {
        // 尝试使用相对于当前模块的静态文件
        // @ts-ignore
        const workerSrc = new URL(/* @vite-ignore */ './pdfjs/pdf.worker.min.mjs', import.meta.url).toString();
        // @ts-ignore
        const cMapUrl = new URL(/* @vite-ignore */ './pdfjs/cmaps/', import.meta.url).toString();

        pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        // @ts-ignore - cMapUrl 和 cMapPacked 在 react-pdf 的类型定义中不存在，但在运行时可用
        pdfjs.GlobalWorkerOptions.cMapUrl = cMapUrl;
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.cMapPacked = true;
    } catch (error) {
        // 如果静态文件加载失败，使用 CDN 兜底
        console.warn('Failed to load local PDF.js worker, falling back to CDN:', error);
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.cMapUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`;
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.cMapPacked = true;
    }
}

export { pdfjs };

