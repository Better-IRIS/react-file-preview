import { PreviewFile, PreviewFileInput } from "../types";

function getFileNameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const fileName = pathname.split("/").pop() || "file";
    return decodeURIComponent(fileName);
  } catch {
    const fileName = url.split("/").pop() || "file";
    return decodeURIComponent(fileName);
  }
}

function inferMimeType(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    ico: "image/x-icon",

    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
    ogv: "video/ogg",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    m4v: "video/x-m4v",
    "3gp": "video/3gpp",
    flv: "video/x-flv",

    mp3: "audio/mpeg",
    wav: "audio/wav",
    m4a: "audio/mp4",
    aac: "audio/aac",
    flac: "audio/flac",

    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ppt: "application/vnd.ms-powerpoint",

    txt: "text/plain",
    md: "text/markdown",
    markdown: "text/markdown",
    json: "application/json",
    xml: "application/xml",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    ts: "text/typescript",
    jsx: "text/javascript",
    tsx: "text/typescript",
    py: "text/x-python",
    java: "text/x-java",
    cpp: "text/x-c++src",
    c: "text/x-csrc",
    cs: "text/x-csharp",
    php: "text/x-php",
    rb: "text/x-ruby",
    go: "text/x-go",
    rs: "text/x-rust",
    yaml: "text/yaml",
    yml: "text/yaml",
  };

  return mimeTypes[ext] || "application/octet-stream";
}

export function normalizeFile(
  input: PreviewFileInput,
  index: number = 0,
): PreviewFile {
  if (input instanceof File) {
    return {
      id: `file-${Date.now()}-${index}`,
      name: input.name,
      url: URL.createObjectURL(input),
      type: input.type || inferMimeType(input.name),
      size: input.size,
    };
  }

  if (typeof input === "string") {
    const fileName = getFileNameFromUrl(input);
    return {
      id: `url-${Date.now()}-${index}`,
      name: fileName,
      url: input,
      type: inferMimeType(fileName),
    };
  }

  return {
    id: input.id || `link-${Date.now()}-${index}`,
    name: input.name,
    url: input.url,
    type: input.type || inferMimeType(input.name),
    size: input.size,
  };
}

export function normalizeFiles(inputs: PreviewFileInput[]): PreviewFile[] {
  return inputs.map((input, index) => normalizeFile(input, index));
}
