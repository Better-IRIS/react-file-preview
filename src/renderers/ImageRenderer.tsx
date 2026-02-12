import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageRendererProps {
  url: string;
  zoom: number;
  rotation: number;
  onZoomChange?: (zoom: number) => void;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({
  url,
  zoom,
  rotation,
  onZoomChange,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [internalZoom, setInternalZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoaded(false);
    setError(null);
    setPosition({ x: 0, y: 0 });
    setInternalZoom(1);
  }, [url]);

  useEffect(() => {
    setInternalZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [zoom, rotation]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError("Failed to load image");
    setLoaded(true);
  };

  const handleDoubleClick = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setInternalZoom((prev) => {
        const newZoom = Math.max(0.01, Math.min(10, prev + delta));

        if (onZoomChange) {
          onZoomChange(newZoom);
        }
        return newZoom;
      });
    },
    [onZoomChange],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="rfp-flex rfp-items-center rfp-justify-center rfp-w-full rfp-h-full rfp-overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {!loaded && !error && (
        <div className="rfp-flex rfp-items-center rfp-justify-center">
          <div className="rfp-w-12 rfp-h-12 rfp-border-4 rfp-border-white/20 rfp-border-t-white rfp-rounded-full rfp-animate-spin" />
        </div>
      )}

      {error && (
        <div className="rfp-text-white/70 rfp-text-center">
          <p className="rfp-text-lg">{error}</p>
        </div>
      )}

      <motion.img
        src={url}
        alt="Preview"
        className={`rfp-max-w-none rfp-select-none ${!loaded ? "rfp-hidden" : ""}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${internalZoom}) rotate(${rotation}deg)`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onLoad={handleLoad}
        onError={handleError}
        onDoubleClick={handleDoubleClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        draggable={false}
      />
    </div>
  );
};
