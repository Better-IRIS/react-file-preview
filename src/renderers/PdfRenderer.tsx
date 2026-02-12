import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import "../utils/pdfConfig";

interface PdfRendererProps {
  url: string;
  zoom: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onTotalPagesChange: (total: number) => void;
}

export const PdfRenderer: React.FC<PdfRendererProps> = ({
  url,
  zoom,
  currentPage,
  onPageChange,
  onTotalPagesChange,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    setError(null);
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onTotalPagesChange(numPages);
    onPageChange(1);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("Failed to load PDF file", error);
    setError("Failed to load PDF file");
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollCenter = scrollTop + containerHeight / 2;

    let currentVisiblePage = 1;
    let minDistance = Infinity;

    pageRefs.current.forEach((pageElement, pageNumber) => {
      const rect = pageElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const pageCenter =
        rect.top - containerRect.top + rect.height / 2 + scrollTop;
      const distance = Math.abs(pageCenter - scrollCenter);

      if (distance < minDistance) {
        minDistance = distance;
        currentVisiblePage = pageNumber;
      }
    });

    if (currentVisiblePage !== currentPage) {
      onPageChange(currentVisiblePage);
    }
  }, [currentPage, onPageChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const setPageRef = useCallback(
    (pageNumber: number, element: HTMLDivElement | null) => {
      if (element) {
        pageRefs.current.set(pageNumber, element);
      } else {
        pageRefs.current.delete(pageNumber);
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="rfp-flex rfp-flex-col rfp-items-center rfp-w-full rfp-h-full rfp-overflow-auto rfp-py-4 md:rfp-py-8 rfp-px-2 md:rfp-px-4"
    >
      {error && (
        <div className="rfp-text-white/70 rfp-text-center">
          <p className="rfp-text-lg">{error}</p>
        </div>
      )}

      {!error && (
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="rfp-flex rfp-items-center rfp-justify-center rfp-min-h-screen">
              <div className="rfp-w-12 rfp-h-12 rfp-border-4 rfp-border-white/20 rfp-border-t-white rfp-rounded-full rfp-animate-spin" />
            </div>
          }
        >
          <div className="rfp-flex rfp-flex-col rfp-gap-4">
            {Array.from(new Array(numPages), (_, index) => {
              const pageNumber = index + 1;
              return (
                <div
                  key={`page_${pageNumber}`}
                  ref={(el) => setPageRef(pageNumber, el)}
                  className="rfp-relative"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={zoom}
                    loading={
                      <div className="rfp-flex rfp-items-center rfp-justify-center rfp-p-8 rfp-bg-white/5 rfp-rounded-lg rfp-min-h-[600px]">
                        <div className="rfp-w-8 rfp-h-8 rfp-border-4 rfp-border-white/20 rfp-border-t-white rfp-rounded-full rfp-animate-spin" />
                      </div>
                    }
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="rfp-shadow-2xl"
                  />
                  <div className="rfp-absolute rfp-top-2 rfp-right-2 rfp-bg-black/60 rfp-backdrop-blur-sm rfp-text-white rfp-text-xs rfp-px-3 rfp-py-1 rfp-rounded-full">
                    {pageNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </Document>
      )}

      {numPages > 0 && (
        <div className="rfp-sticky rfp-bottom-2 md:rfp-bottom-4 rfp-mt-4 md:rfp-mt-8 rfp-bg-black/60 rfp-backdrop-blur-xl rfp-text-white rfp-px-4 rfp-py-2 md:rfp-px-6 md:rfp-py-3 rfp-rounded-full rfp-text-xs md:rfp-text-sm rfp-font-medium rfp-shadow-2xl rfp-border rfp-border-white/10">
          {currentPage} / {numPages}
        </div>
      )}
    </div>
  );
};
