import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AudioRenderer } from "./renderers/AudioRenderer";
import { DocxRenderer } from "./renderers/DocxRenderer";
import { ImageRenderer } from "./renderers/ImageRenderer";
import { MarkdownRenderer } from "./renderers/MarkdownRenderer";
import { PdfRenderer } from "./renderers/PdfRenderer";
import { PptxRenderer } from "./renderers/PptxRenderer";
import { TextRenderer } from "./renderers/TextRenderer";
import { UnsupportedRenderer } from "./renderers/UnsupportedRenderer";
import { VideoRenderer } from "./renderers/VideoRenderer";
import { XlsxRenderer } from "./renderers/XlsxRenderer";
import {
  CustomRenderer,
  FileType,
  PreviewFile,
  PreviewFileInput,
} from "./types";
import { normalizeFiles } from "./utils/fileNormalizer";

interface FilePreviewModalProps {
  files: PreviewFileInput[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (index: number) => void;
  customRenderers?: CustomRenderer[];
}

const getFileType = (file: PreviewFile): FileType => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const mimeType = file.type.toLowerCase();

  if (
    mimeType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)
  ) {
    return "image";
  }
  if (mimeType.includes("pdf") || ext === "pdf") {
    return "pdf";
  }
  if (mimeType.includes("wordprocessingml") || ext === "docx") {
    return "docx";
  }
  if (mimeType.includes("spreadsheetml") || ext === "xlsx") {
    return "xlsx";
  }
  if (mimeType.includes("presentationml") || ext === "pptx" || ext === "ppt") {
    return "pptx";
  }
  if (
    mimeType.startsWith("video/") ||
    [
      "mp4",
      "webm",
      "ogg",
      "ogv",
      "mov",
      "avi",
      "mkv",
      "m4v",
      "3gp",
      "flv",
    ].includes(ext)
  ) {
    return "video";
  }
  if (
    mimeType.startsWith("audio/") ||
    ["mp3", "wav", "ogg", "m4a", "flac", "aac"].includes(ext)
  ) {
    return "audio";
  }
  if (ext === "md" || ext === "markdown") {
    return "markdown";
  }

  const textExtensions = [
    "txt",
    "log",
    "csv",
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "py",
    "java",
    "cpp",
    "c",
    "h",
    "cs",
    "php",
    "rb",
    "go",
    "rs",
    "swift",
    "kt",
    "html",
    "css",
    "scss",
    "sass",
    "less",
    "xml",
    "yaml",
    "yml",
    "toml",
    "ini",
    "conf",
    "sh",
    "bash",
    "zsh",
    "sql",
  ];
  if (mimeType.startsWith("text/") || textExtensions.includes(ext)) {
    return "text";
  }
  return "unsupported";
};

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  files,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  customRenderers = [],
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setTotalPages] = useState(1);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const normalizedFiles = useMemo(() => normalizeFiles(files), [files]);

  const currentFile = normalizedFiles[currentIndex];

  const customRenderer = useMemo(() => {
    if (!currentFile) return null;
    return customRenderers.find((renderer) => renderer.test(currentFile));
  }, [currentFile, customRenderers]);

  const fileType = currentFile ? getFileType(currentFile) : "unsupported";

  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setCurrentPage(1);
    setTotalPages(1);
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        onNavigate?.(currentIndex - 1);
      } else if (
        e.key === "ArrowRight" &&
        currentIndex < normalizedFiles.length - 1
      ) {
        onNavigate?.(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, normalizedFiles.length, onClose, onNavigate]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 10));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.01));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prev) => prev + 90);
  }, []);

  const handleRotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90);
  }, []);

  const handleFitToWidth = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const handleOriginalSize = useCallback(() => {
    setZoom(1);
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  const handleDownload = useCallback(() => {
    if (!currentFile) return;
    const link = document.createElement("a");
    link.href = currentFile.url;
    link.download = currentFile.name;
    link.click();
  }, [currentFile]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < normalizedFiles.length - 1) {
      onNavigate?.(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      onNavigate?.(currentIndex - 1);
    }
  }, [
    touchStart,
    touchEnd,
    minSwipeDistance,
    currentIndex,
    normalizedFiles.length,
    onNavigate,
  ]);

  if (!isOpen || !currentFile) return null;

  const showZoomControls = fileType === "image" || fileType === "pdf";
  const showRotateControl = fileType === "image";

  const modalContent = (
    <div className="rfp-root">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rfp-fixed rfp-inset-0 rfp-z-[9999] rfp-flex rfp-items-center rfp-justify-center rfp-bg-black/80 rfp-backdrop-blur-md rfp-overflow-hidden"
            onClick={onClose}
            onWheel={(e) => e.stopPropagation()}
          >
            <div
              className="rfp-relative rfp-w-full rfp-h-full rfp-flex rfp-flex-col rfp-overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}
                className="rfp-absolute rfp-top-0 rfp-left-0 rfp-right-0 rfp-z-10 rfp-p-4"
              >
                <div className="rfp-max-w-7xl rfp-mx-auto rfp-flex rfp-flex-col md:rfp-flex-row md:rfp-items-center md:rfp-justify-between rfp-bg-black/40 rfp-backdrop-blur-xl rfp-rounded-2xl rfp-px-3 md:rfp-px-6 rfp-py-3 md:rfp-py-4 rfp-shadow-2xl rfp-border rfp-border-white/10 rfp-gap-2 md:rfp-gap-0">
                  <div className="rfp-flex rfp-items-center rfp-justify-between md:rfp-flex-1 md:rfp-min-w-0 md:rfp-mr-4">
                    <div className="rfp-flex-1 rfp-min-w-0">
                      <h2 className="rfp-text-white rfp-font-medium rfp-text-sm md:rfp-text-lg rfp-truncate">
                        {currentFile.name}
                      </h2>
                      <p className="rfp-text-white/60 rfp-text-xs md:rfp-text-sm">
                        {currentIndex + 1} / {normalizedFiles.length}
                      </p>
                    </div>

                    <div className="md:rfp-hidden rfp-ml-2">
                      <ToolbarButton
                        icon={<X className="rfp-w-5 rfp-h-5" />}
                        label="Close"
                        onClick={onClose}
                      />
                    </div>
                  </div>

                  <div className="rfp-flex rfp-items-center rfp-gap-1 md:rfp-gap-2 rfp-overflow-x-auto scrollbar-hide rfp-flex-shrink-0">
                    {showZoomControls && (
                      <>
                        <ToolbarButton
                          icon={<ZoomOut className="rfp-w-5 rfp-h-5" />}
                          label="Zoom out"
                          onClick={handleZoomOut}
                          disabled={zoom <= 0.01}
                        />
                        <span className="rfp-text-white/70 rfp-text-sm rfp-min-w-[4rem] rfp-text-center rfp-font-medium">
                          {Math.round(zoom * 100)}%
                        </span>
                        <ToolbarButton
                          icon={<ZoomIn className="rfp-w-5 rfp-h-5" />}
                          label="Zoom in"
                          onClick={handleZoomIn}
                          disabled={zoom >= 10}
                        />
                        <div className="rfp-w-px rfp-h-6 rfp-bg-white/20 rfp-mx-2" />
                        <ToolbarButton
                          icon={<Minimize2 className="rfp-w-5 rfp-h-5" />}
                          label="Fit window"
                          onClick={handleFitToWidth}
                        />
                        <ToolbarButton
                          icon={<Maximize2 className="rfp-w-5 rfp-h-5" />}
                          label="Original size"
                          onClick={handleOriginalSize}
                        />
                        <div className="rfp-w-px rfp-h-6 rfp-bg-white/20 rfp-mx-2" />
                      </>
                    )}

                    {showRotateControl && (
                      <>
                        <ToolbarButton
                          icon={<RotateCcw className="rfp-w-5 rfp-h-5" />}
                          label="Rotate left"
                          onClick={handleRotateLeft}
                        />
                        <ToolbarButton
                          icon={<RotateCw className="rfp-w-5 rfp-h-5" />}
                          label="Rotate right"
                          onClick={handleRotate}
                        />
                        <div className="rfp-w-px rfp-h-6 rfp-bg-white/20 rfp-mx-2" />
                      </>
                    )}

                    {(showZoomControls || showRotateControl) && (
                      <>
                        <ToolbarButton
                          icon={<RefreshCw className="rfp-w-5 rfp-h-5" />}
                          label="Reset"
                          onClick={handleReset}
                        />
                        <div className="rfp-w-px rfp-h-6 rfp-bg-white/20 rfp-mx-2" />
                      </>
                    )}

                    <ToolbarButton
                      icon={<Download className="rfp-w-5 rfp-h-5" />}
                      label="Download"
                      onClick={handleDownload}
                    />

                    <div className="rfp-hidden md:rfp-flex rfp-items-center">
                      <div className="rfp-w-px rfp-h-6 rfp-bg-white/20 rfp-mx-2" />
                      <ToolbarButton
                        icon={<X className="rfp-w-5 rfp-h-5" />}
                        label="Close"
                        onClick={onClose}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div
                className="rfp-flex-1 rfp-flex rfp-items-center rfp-justify-center rfp-pt-32 md:rfp-pt-24 rfp-pb-4 md:rfp-pb-8 rfp-overflow-auto"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {customRenderer ? (
                  customRenderer.render(currentFile)
                ) : (
                  <>
                    {fileType === "image" && (
                      <ImageRenderer
                        url={currentFile.url}
                        zoom={zoom}
                        rotation={rotation}
                        onZoomChange={handleZoomChange}
                      />
                    )}
                    {fileType === "pdf" && (
                      <PdfRenderer
                        url={currentFile.url}
                        zoom={zoom}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        onTotalPagesChange={setTotalPages}
                      />
                    )}
                    {fileType === "docx" && (
                      <DocxRenderer url={currentFile.url} />
                    )}
                    {fileType === "xlsx" && (
                      <XlsxRenderer url={currentFile.url} />
                    )}
                    {fileType === "pptx" && (
                      <PptxRenderer url={currentFile.url} />
                    )}
                    {fileType === "video" && (
                      <VideoRenderer url={currentFile.url} />
                    )}
                    {fileType === "audio" && (
                      <AudioRenderer
                        url={currentFile.url}
                        fileName={currentFile.name}
                      />
                    )}
                    {fileType === "markdown" && (
                      <MarkdownRenderer url={currentFile.url} />
                    )}
                    {fileType === "text" && (
                      <TextRenderer
                        url={currentFile.url}
                        fileName={currentFile.name}
                      />
                    )}
                    {fileType === "unsupported" && (
                      <UnsupportedRenderer
                        fileName={currentFile.name}
                        fileType={currentFile.type}
                        onDownload={handleDownload}
                      />
                    )}
                  </>
                )}
              </div>

              {normalizedFiles.length > 1 && (
                <>
                  {currentIndex > 0 && (
                    <motion.button
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -100, opacity: 0 }}
                      onClick={() => onNavigate?.(currentIndex - 1)}
                      className="rfp-absolute rfp-left-2 md:rfp-left-4 rfp-top-1/2 -rfp-translate-y-1/2 rfp-w-10 rfp-h-10 md:rfp-w-12 md:rfp-h-12 rfp-rounded-full rfp-bg-black/40 rfp-backdrop-blur-xl rfp-border rfp-border-white/10 rfp-flex rfp-items-center rfp-justify-center rfp-text-white hover:rfp-bg-black/60 rfp-transition-all rfp-shadow-2xl"
                    >
                      <ChevronLeft className="rfp-w-5 rfp-h-5 md:rfp-w-6 md:rfp-h-6" />
                    </motion.button>
                  )}

                  {currentIndex < normalizedFiles.length - 1 && (
                    <motion.button
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 100, opacity: 0 }}
                      onClick={() => onNavigate?.(currentIndex + 1)}
                      className="rfp-absolute rfp-right-2 md:rfp-right-4 rfp-top-1/2 -rfp-translate-y-1/2 rfp-w-10 rfp-h-10 md:rfp-w-12 md:rfp-h-12 rfp-rounded-full rfp-bg-black/40 rfp-backdrop-blur-xl rfp-border rfp-border-white/10 rfp-flex rfp-items-center rfp-justify-center rfp-text-white hover:rfp-bg-black/60 rfp-transition-all rfp-shadow-2xl"
                    >
                      <ChevronRight className="rfp-w-5 rfp-h-5 md:rfp-w-6 md:rfp-h-6" />
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(modalContent, document.body);
};

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`rfp-p-2 rfp-rounded-lg rfp-transition-all ${
        disabled
          ? "rfp-text-white/30 rfp-cursor-not-allowed"
          : "rfp-text-white hover:rfp-bg-white/10 active:rfp-bg-white/20"
      }`}
    >
      {icon}
    </button>
  );
};
