import { Presentation } from "lucide-react";
import { init } from "pptx-preview";
import { useCallback, useEffect, useRef, useState } from "react";

interface PptxRendererProps {
  url: string;
}

export const PptxRenderer: React.FC<PptxRendererProps> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewerRef = useRef<ReturnType<typeof init> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const arrayBufferRef = useRef<ArrayBuffer | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastDimensionsRef = useRef({ width: 0, height: 0 });

  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 960, height: 540 };

    const containerWidth = containerRef.current.clientWidth;

    const height = Math.floor((containerWidth * 9) / 16);

    return { width: containerWidth, height };
  }, []);

  const reinitializePreviewer = useCallback(async () => {
    if (!containerRef.current || !arrayBufferRef.current) return;

    try {
      if (previewerRef.current) {
        try {
          previewerRef.current.destroy();
        } catch (e) {
          console.error("Failed to unmount previewer:", e);
        }
      }

      containerRef.current.innerHTML = "";

      const currentDimensions = calculateDimensions();

      const previewer = init(containerRef.current, {
        width: currentDimensions.width,
        height: currentDimensions.height,
      });

      previewerRef.current = previewer;

      await previewer.preview(arrayBufferRef.current);
    } catch (e) {
      console.error("Reinitialization failed:", e);
    }
  }, [calculateDimensions]);

  useEffect(() => {
    if (!containerRef.current) return;

    let isInitialRender = true;

    const updateDimensions = () => {
      if (isInitialRender) {
        isInitialRender = false;
        const initialDimensions = calculateDimensions();
        lastDimensionsRef.current = initialDimensions;
        return;
      }

      const newDimensions = calculateDimensions();

      const lastDimensions = lastDimensionsRef.current;
      const widthDiff = Math.abs(lastDimensions.width - newDimensions.width);
      const heightDiff = Math.abs(lastDimensions.height - newDimensions.height);

      if (widthDiff < 10 && heightDiff < 10) {
        return;
      }

      lastDimensionsRef.current = newDimensions;

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        if (previewerRef.current && arrayBufferRef.current) {
          reinitializePreviewer();
        }
      }, 800);
    };

    resizeObserverRef.current = new ResizeObserver(() => {
      updateDimensions();
    });

    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculateDimensions, reinitializePreviewer]);

  useEffect(() => {
    let isMounted = true;

    const loadPptx = async () => {
      if (!containerRef.current) {
        console.log("Container ref not ready");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to load file");
        }

        const arrayBuffer = await response.arrayBuffer();
        arrayBufferRef.current = arrayBuffer;

        if (!isMounted) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        const currentDimensions = calculateDimensions();

        const previewer = init(containerRef.current, {
          width: currentDimensions.width,
          height: currentDimensions.height,
        });

        previewerRef.current = previewer;

        previewer
          .preview(arrayBuffer)
          .then(() => {
            if (isMounted) {
              setLoading(false);
            }
          })
          .catch((previewErr) => {
            console.error("PowerPoint preview failed:", previewErr);
            if (isMounted) {
              setError("PowerPoint preview failed");
              setLoading(false);
            }
          });
      } catch (err) {
        console.error("Failed to parse PowerPoint file", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to parse PowerPoint file",
          );
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      loadPptx();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      arrayBufferRef.current = null;
      if (previewerRef.current) {
        try {
          previewerRef.current.destroy();
        } catch (e) {
          console.error("Failed to unmount previewer:", e);
        }
      }
      previewerRef.current = null;
    };
  }, [url, calculateDimensions]);

  return (
    <div className="rfp-relative rfp-flex rfp-flex-col rfp-items-center rfp-w-full rfp-h-full rfp-pt-2 rfp-px-2 md:rfp-px-4">
      {loading && (
        <div className="rfp-absolute rfp-inset-0 rfp-flex rfp-items-center rfp-justify-center rfp-bg-black/50 rfp-backdrop-blur-sm rfp-z-10 rfp-rounded-xl md:rfp-rounded-2xl">
          <div className="rfp-text-center">
            <div className="rfp-w-10 rfp-h-10 md:rfp-w-12 md:rfp-h-12 rfp-mx-auto rfp-mb-3 rfp-border-4 rfp-border-white/20 rfp-border-t-white rfp-rounded-full rfp-animate-spin" />
            <p className="rfp-text-xs md:rfp-text-sm rfp-text-white/70 rfp-font-medium">
              Loading PowerPoint Preview...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rfp-absolute rfp-inset-0 rfp-flex rfp-items-center rfp-justify-center rfp-bg-black/50 rfp-backdrop-blur-sm rfp-z-10 rfp-rounded-xl md:rfp-rounded-2xl">
          <div className="rfp-text-center rfp-max-w-sm md:rfp-max-w-md rfp-px-4">
            <div className="rfp-w-24 rfp-h-24 md:rfp-w-32 md:rfp-h-32 rfp-mx-auto rfp-mb-4 md:rfp-mb-6 rfp-rounded-2xl md:rfp-rounded-3xl rfp-bg-gradient-to-br rfp-from-orange-500 rfp-via-red-500 rfp-to-pink-500 rfp-flex rfp-items-center rfp-justify-center rfp-shadow-2xl">
              <Presentation className="rfp-w-12 rfp-h-12 md:rfp-w-16 md:rfp-h-16 rfp-text-white" />
            </div>
            <p className="rfp-text-lg md:rfp-text-xl rfp-text-white/90 rfp-mb-2 md:rfp-mb-3 rfp-font-medium">
              PowerPoint Preview
            </p>
            <p className="rfp-text-xs md:rfp-text-sm rfp-text-white/60 rfp-mb-4 md:rfp-mb-6">
              {error ||
                "The browser does not support direct preview of PowerPoint files."}
            </p>
            <a
              href={url}
              download
              className="rfp-inline-flex rfp-items-center rfp-gap-2 rfp-px-4 rfp-py-2 md:rfp-px-6 md:rfp-py-3 rfp-bg-gradient-to-r rfp-from-purple-500 rfp-to-pink-500 rfp-text-white rfp-text-sm md:rfp-text-base rfp-rounded-lg md:rfp-rounded-xl hover:rfp-scale-105 rfp-transition-all rfp-shadow-lg"
            >
              <svg
                className="rfp-w-4 rfp-h-4 md:rfp-w-5 md:rfp-h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download File
            </a>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="pptx-wrapper rfp-w-full rfp-max-w-full md:rfp-max-w-6xl"
      />
    </div>
  );
};
