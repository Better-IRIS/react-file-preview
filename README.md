# React File Preview [![npm version](https://img.shields.io/npm/v/react-file-preview.svg)](https://www.npmjs.com/package/react-file-preview)[![license](https://img.shields.io/npm/l/react-file-preview.svg)](https://github.com/wh131462/react-file-preview/blob/master/LICENSE)[![downloads](https://img.shields.io/npm/dm/react-file-preview.svg)](https://www.npmjs.com/package/react-file-preview)

English | [简体中文](./README.zh-CN.md)

A modern, feature-rich file preview component for React with support for images, videos, audio, PDFs, Office documents (Word, Excel, PowerPoint), Markdown, and code files.



## ✨ Features

- 🎨 **Modern UI** - Apple-inspired minimalist design with glassmorphism effects
- 📁 **Multi-format Support** - Supports 20+ file formats
- 🖼️ **Powerful Image Viewer** - Zoom, rotate, drag, mouse wheel zoom
- 🎬 **Custom Video Player** - Built on Video.js, supports multiple video formats
- 🎵 **Custom Audio Player** - Beautiful audio control interface
- 📄 **PDF Viewer** - Pagination support
- 📊 **Office Documents Support** - Word, Excel, PowerPoint file preview
- 📝 **Markdown Rendering** - GitHub Flavored Markdown support
- 💻 **Code Highlighting** - Supports 40+ programming languages
- 🎭 **Smooth Animations** - Powered by Framer Motion
- 📱 **Responsive Design** - Adapts to all screen sizes
- ⌨️ **Keyboard Navigation** - Arrow keys and ESC support
- 🎯 **Drag & Drop** - File upload via drag and drop

## 📦 Installation

```bash
# Using npm
npm install react-file-preview

# Using yarn
yarn add react-file-preview

# Using pnpm
pnpm add react-file-preview
```

## 🚀 Quick Start

```tsx
import { FilePreviewModal } from 'react-file-preview';
import { useState } from 'react';

function App() {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (file: File) => {
    const previewFile = {
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    };
    setFiles([previewFile]);
    setCurrentIndex(0);
    setIsOpen(true);
  };

  return (
    <>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
      />
      
      <FilePreviewModal
        files={files}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNavigate={setCurrentIndex}
      />
    </>
  );
}
```

## 💡 Usage Examples

### Preview PowerPoint Files

```tsx
import { FilePreviewModal } from 'react-file-preview';
import { useState } from 'react';

function PptPreview() {
  const [isOpen, setIsOpen] = useState(false);

  const pptFile = {
    name: 'presentation.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    url: '/path/to/your/presentation.pptx',
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Preview PPT
      </button>

      <FilePreviewModal
        files={[pptFile]}
        currentIndex={0}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

### Preview Multiple Files

```tsx
const files = [
  { name: 'image.jpg', type: 'image/jpeg', url: '/path/to/image.jpg' },
  { name: 'document.pdf', type: 'application/pdf', url: '/path/to/document.pdf' },
  { name: 'presentation.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', url: '/path/to/presentation.pptx' },
  { name: 'spreadsheet.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', url: '/path/to/spreadsheet.xlsx' },
];

<FilePreviewModal
  files={files}
  currentIndex={0}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onNavigate={setCurrentIndex}
/>
```

## 📖 Supported File Formats

### Images
- **Formats**: JPG, PNG, GIF, WebP, SVG, BMP, ICO
- **Features**: Zoom (0.5x - 5x), rotate, drag, mouse wheel zoom, double-click reset

### Videos
- **Formats**: MP4, WebM, OGG, MOV, AVI, MKV, M4V, 3GP, FLV
- **Features**: Custom player, progress control, volume adjustment, fullscreen

### Audio
- **Formats**: MP3, WAV, OGG, M4A, AAC, FLAC
- **Features**: Custom player, progress bar, volume control, skip forward/backward

### Documents
- **PDF**: Pagination, zoom
- **Word**: DOCX format support
- **Excel**: XLSX format support
- **PowerPoint**: PPTX/PPT format support, slide preview

### Code & Text
- **Markdown**: GitHub Flavored Markdown, code highlighting
- **Code Files**: JS, TS, Python, Java, C++, Go, Rust, and 40+ languages
- **Text Files**: TXT, LOG, CSV, JSON, YAML, XML, etc.

## 🎮 API Reference

### FilePreviewModal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `files` | `PreviewFileInput[]` | ✅ | Array of files (supports File objects, file objects, or URL strings) |
| `currentIndex` | `number` | ✅ | Current file index |
| `isOpen` | `boolean` | ✅ | Whether the modal is open |
| `onClose` | `() => void` | ✅ | Close callback |
| `onNavigate` | `(index: number) => void` | ❌ | Navigation callback |

### File Type Definitions

```typescript
// Supports three types of file input
type PreviewFileInput = File | PreviewFileLink | string;

// 1. Native File object (Browser File API)
const file: File = ...;

// 2. File object
interface PreviewFileLink {
  id?: string;       // Optional unique identifier
  name: string;      // File name
  type: string;      // MIME type
  url: string;       // File URL (supports blob URLs and HTTP URLs)
  size?: number;     // File size in bytes
}

// 3. HTTP URL string
const url: string = 'https://example.com/file.pdf';
```

### Usage Examples

```typescript
// Method 1: Using native File objects
const files = [file1, file2]; // Array of File objects

// Method 2: Using HTTP URL strings
const files = [
  'https://example.com/image.jpg',
  'https://example.com/document.pdf',
];

// Method 3: Using file objects
const files = [
  {
    name: 'presentation.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    url: '/path/to/presentation.pptx',
  },
];

// Method 4: Mixed usage
const files = [
  file1,  // File object
  'https://example.com/image.jpg',  // URL string
  { name: 'doc.pdf', type: 'application/pdf', url: '/doc.pdf' },  // File object
];
```

### Supported MIME Types

#### Office Documents
- **Word**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
- **Excel**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (.xlsx)
- **PowerPoint**: `application/vnd.openxmlformats-officedocument.presentationml.presentation` (.pptx)
- **PowerPoint (Legacy)**: `application/vnd.ms-powerpoint` (.ppt)

#### Other Documents
- **PDF**: `application/pdf`

#### Media Files
- **Images**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`, etc.
- **Videos**: `video/mp4`, `video/webm`, `video/ogg`, etc.
- **Audio**: `audio/mpeg`, `audio/wav`, `audio/ogg`, etc.

#### Text Files
- **Markdown**: File extensions `.md` or `.markdown`
- **Code**: Auto-detected by file extension (`.js`, `.ts`, `.py`, `.java`, etc.)
- **Plain Text**: `text/plain`, `text/csv`, etc.

## 🎨 Custom Styling

The component is built with Tailwind CSS. You can customize styles by overriding CSS variables:

```css
/* Custom theme colors */
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #ec4899;
}
```

## ⌨️ Keyboard Shortcuts

- `ESC` - Close preview
- `←` - Previous file
- `→` - Next file
- `Mouse Wheel` - Zoom image (image preview only)

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/wh131462/react-file-preview.git

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build
pnpm build

# Preview build
pnpm preview
```

## 📄 License

[MIT](./LICENSE) © [EternalHeart](https://github.com/wh131462)

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 🔗 Links

- [GitHub](https://github.com/wh131462/react-file-preview)
- [npm](https://www.npmjs.com/package/react-file-preview)
- [Issue Tracker](https://github.com/wh131462/react-file-preview/issues)
