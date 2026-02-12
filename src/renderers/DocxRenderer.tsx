import mammoth from "mammoth";
import { useEffect, useState } from "react";

interface DocxRendererProps {
  url: string;
}

export const DocxRenderer: React.FC<DocxRendererProps> = ({ url }) => {
  const [html, setHtml] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDocx = async () => {
      setLoading(true);
      setError(null);
      setHtml("");

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("z");
        }

        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtml(result.value);
      } catch (err) {
        console.error("Docx parsing error:", err);
        setError("Failed to parse word document");
      } finally {
        setLoading(false);
      }
    };

    loadDocx();
  }, [url]);

  if (loading) {
    return (
      <div className="rfp-flex rfp-items-center rfp-justify-center rfp-w-full rfp-h-full">
        <div className="rfp-w-12 rfp-h-12 rfp-border-4 rfp-border-white/20 rfp-border-t-white rfp-rounded-full rfp-animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rfp-flex rfp-items-center rfp-justify-center rfp-w-full rfp-h-full">
        <div className="rfp-text-white/70 rfp-text-center">
          <p className="rfp-text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rfp-w-full rfp-h-full rfp-overflow-auto rfp-p-4 md:rfp-p-8">
      <div
        className="rfp-max-w-full md:rfp-max-w-4xl rfp-mx-auto rfp-bg-white rfp-rounded-lg rfp-shadow-2xl rfp-p-6 md:rfp-p-12"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: "1.6",
          color: "#333",
        }}
      />
    </div>
  );
};
