import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface XlsxRendererProps {
  url: string;
}

export const XlsxRenderer: React.FC<XlsxRendererProps> = ({ url }) => {
  const [sheets, setSheets] = useState<{ name: string; data: unknown[] }[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadXlsx = async () => {
      setLoading(true);
      setError(null);
      setSheets([]);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to load file");
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const parsedSheets = workbook.SheetNames.map((name) => {
          const worksheet = workbook.Sheets[name];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          return { name, data };
        });

        setSheets(parsedSheets);
        setActiveSheet(0);
      } catch (err) {
        console.error("Failed to parse Excel file", err);
        setError("Failed to parse Excel file");
      } finally {
        setLoading(false);
      }
    };

    loadXlsx();
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

  const currentSheet = sheets[activeSheet];

  return (
    <div className="rfp-w-full rfp-h-full rfp-flex rfp-flex-col rfp-overflow-hidden">
      {sheets.length > 1 && (
        <div className="rfp-flex rfp-gap-1 md:rfp-gap-2 rfp-p-2 md:rfp-p-4 rfp-bg-black/20 rfp-backdrop-blur-sm rfp-overflow-x-auto rfp-border-b rfp-border-white/10 scrollbar-hide">
          {sheets.map((sheet, index) => (
            <button
              key={index}
              onClick={() => setActiveSheet(index)}
              className={`rfp-px-3 rfp-py-1.5 md:rfp-px-4 md:rfp-py-2 rfp-rounded-lg rfp-text-xs md:rfp-text-sm rfp-font-medium rfp-transition-all rfp-flex-shrink-0 ${
                activeSheet === index
                  ? "rfp-bg-gradient-to-r rfp-from-purple-500 rfp-to-pink-500 rfp-text-white rfp-shadow-lg"
                  : "rfp-bg-white/10 rfp-text-white hover:rfp-bg-white/20"
              }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      <div className="rfp-flex-1 rfp-overflow-auto rfp-p-2 md:rfp-p-8">
        <div className="rfp-inline-block rfp-min-w-full rfp-bg-gradient-to-br rfp-from-gray-800/90 rfp-to-gray-900/90 rfp-backdrop-blur-xl rfp-rounded-xl md:rfp-rounded-2xl rfp-shadow-2xl rfp-overflow-hidden rfp-border rfp-border-white/10">
          <table className="rfp-min-w-full rfp-divide-y rfp-divide-white/10">
            <tbody className="rfp-divide-y rfp-divide-white/10">
              {currentSheet?.data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`rfp-transition-colors ${
                    rowIndex === 0
                      ? "rfp-bg-gradient-to-r rfp-from-purple-500/20 rfp-to-pink-500/20 rfp-font-semibold"
                      : "hover:rfp-bg-white/5"
                  }`}
                >
                  {(row as unknown[]).map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="rfp-px-3 rfp-py-2 md:rfp-px-6 md:rfp-py-4 rfp-whitespace-nowrap rfp-text-xs md:rfp-text-sm rfp-text-gray-200 rfp-border-r rfp-border-white/10"
                    >
                      {String(cell ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
