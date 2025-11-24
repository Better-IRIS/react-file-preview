# React File Preview [![npm version](https://img.shields.io/npm/v/react-file-preview.svg)](https://www.npmjs.com/package/react-file-preview)[![license](https://img.shields.io/npm/l/react-file-preview.svg)](https://github.com/wh131462/react-file-preview/blob/master/LICENSE)[![downloads](https://img.shields.io/npm/dm/react-file-preview.svg)](https://www.npmjs.com/package/react-file-preview)

English | [简体中文](./README.zh-CN.md)

A modern, feature-rich file preview component for React with support for images, videos, audio, PDFs, Office documents, Markdown, and code files.



## ✨ Features

- 🎨 **Modern UI** - Apple-inspired minimalist design with glassmorphism effects
- 📁 **Multi-format Support** - Supports 20+ file formats
- 🖼️ **Powerful Image Viewer** - Zoom, rotate, drag, mouse wheel zoom
- 🎬 **Custom Video Player** - Built on Video.js, supports multiple video formats
- 🎵 **Custom Audio Player** - Beautiful audio control interface
- 📄 **PDF Viewer** - Pagination support
- 📝 **Markdown Rendering** - GitHub Flavored Markdown support
- 💻 **Code Highlighting** - Supports 40+ programming languages
- 🎭 **Smooth Animations** - Powered by Framer Motion
- �� **Responsive Design** - Adapts to all screen sizes
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

### Code & Text
- **Markdown**: GitHub Flavored Markdown, code highlighting
- **Code Files**: JS, TS, Python, Java, C++, Go, Rust, and 40+ languages
- **Text Files**: TXT, LOG, CSV, JSON, YAML, XML, etc.

## 🎮 API Reference

### FilePreviewModal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `files` | `PreviewFile[]` | ✅ | Array of files to preview |
| `currentIndex` | `number` | ✅ | Current file index |
| `isOpen` | `boolean` | ✅ | Whether the modal is open |
| `onClose` | `() => void` | ✅ | Close callback |
| `onNavigate` | `(index: number) => void` | ❌ | Navigation callback |

### PreviewFile Type

```typescript
interface PreviewFile {
  name: string;      // File name
  type: string;      // MIME type
  url: string;       // File URL (blob URLs supported)
}
```

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
