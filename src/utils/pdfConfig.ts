import { pdfjs } from "react-pdf";

export interface PdfConfigOptions {
  workerSrc?: string;

  cMapUrl?: string;

  cMapPacked?: boolean;
}

export function configurePdfjs(options?: PdfConfigOptions) {
  if (typeof window === "undefined") return;

  const {
    workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`,
    cMapUrl = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked = true,
  } = options || {};

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.cMapUrl = cMapUrl;
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.cMapPacked = cMapPacked;
}

configurePdfjs();

export { pdfjs };
