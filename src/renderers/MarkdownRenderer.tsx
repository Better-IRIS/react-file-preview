import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  url: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ url }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to load markdown file");
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError("Failed to load markdown file");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
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
      <div className="rfp-max-w-full md:rfp-max-w-4xl rfp-mx-auto rfp-bg-white/5 rfp-backdrop-blur-sm rfp-rounded-2xl rfp-p-4 md:rfp-p-8 rfp-border rfp-border-white/10">
        <div className="rfp-max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rfp-rounded-lg"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className="rfp-bg-white/10 rfp-px-1.5 rfp-py-0.5 rfp-rounded rfp-text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              h1: ({ children }) => (
                <h1 className="rfp-text-4xl rfp-font-bold rfp-mb-4 rfp-text-white rfp-border-b rfp-border-white/20 rfp-pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="rfp-text-3xl rfp-font-bold rfp-mb-3 rfp-text-white rfp-mt-8">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="rfp-text-2xl rfp-font-bold rfp-mb-2 rfp-text-white rfp-mt-6">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="rfp-text-white/90 rfp-mb-4 rfp-leading-relaxed">
                  {children}
                </p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="rfp-text-blue-400 hover:rfp-text-blue-300 rfp-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="rfp-list-disc rfp-list-inside rfp-mb-4 rfp-text-white/90">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="rfp-list-decimal rfp-list-inside rfp-mb-4 rfp-text-white/90">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="rfp-mb-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="rfp-border-l-4 rfp-border-blue-500 rfp-pl-4 rfp-italic rfp-text-white/80 rfp-my-4">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="rfp-overflow-x-auto rfp-my-4">
                  <table className="rfp-min-w-full rfp-border rfp-border-white/20">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="rfp-border rfp-border-white/20 rfp-px-4 rfp-py-2 rfp-bg-white/10 rfp-text-white rfp-font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="rfp-border rfp-border-white/20 rfp-px-4 rfp-py-2 rfp-text-white/90">
                  {children}
                </td>
              ),
              hr: () => <hr className="rfp-border-white/20 rfp-my-6" />,
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="rfp-rounded-lg rfp-max-w-full rfp-h-auto rfp-my-4"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
