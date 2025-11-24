import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

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
          throw new Error('文件加载失败');
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const parsedSheets = workbook.SheetNames.map((name) => {
          const worksheet = workbook.Sheets[name];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          return { name, data };
        });

        setSheets(parsedSheets);
        setActiveSheet(0);
      } catch (err) {
        console.error('Excel 解析错误:', err);
        setError('Excel 文件解析失败');
      } finally {
        setLoading(false);
      }
    };

    loadXlsx();
  }, [url]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white/70 text-center">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const currentSheet = sheets[activeSheet];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Sheet Tabs */}
      {sheets.length > 1 && (
        <div className="flex gap-2 p-4 bg-black/20 backdrop-blur-sm overflow-x-auto">
          {sheets.map((sheet, index) => (
            <button
              key={index}
              onClick={() => setActiveSheet(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSheet === index
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto p-8">
        <div className="inline-block min-w-full bg-white rounded-lg shadow-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSheet?.data.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50 font-semibold' : ''}>
                  {(row as unknown[]).map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200"
                    >
                      {String(cell ?? '')}
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

