# React File Preview [![npm version](https://img.shields.io/npm/v/react-file-preview.svg)](https://www.npmjs.com/package/react-file-preview)[![license](https://img.shields.io/npm/l/react-file-preview.svg)](https://github.com/wh131462/react-file-preview/blob/master/LICENSE)[![downloads](https://img.shields.io/npm/dm/react-file-preview.svg)](https://www.npmjs.com/package/react-file-preview)

[English](./README.md) | 简体中文

一个现代化、功能丰富的 React 文件预览组件,支持图片、视频、音频、PDF、Office 文档(Word、Excel、PowerPoint)、Markdown 和代码文件预览。

## ✨ 特性

- 🎨 **现代化 UI** - Apple 风格的简约设计,毛玻璃效果
- 📁 **多格式支持** - 支持 20+ 种文件格式
- 🖼️ **强大的图片查看器** - 缩放、旋转、拖拽、滚轮缩放
- 🎬 **自定义视频播放器** - 基于 Video.js,支持多种视频格式
- 🎵 **自定义音频播放器** - 精美的音频控制界面
- 📄 **PDF 查看器** - 支持分页浏览
- 📊 **Office 文档支持** - Word、Excel、PowerPoint 文件预览
- 📝 **Markdown 渲染** - 支持 GitHub Flavored Markdown
- 💻 **代码高亮** - 支持 40+ 种编程语言
- 🎭 **流畅动画** - 基于 Framer Motion
- 📱 **响应式设计** - 适配各种屏幕尺寸
- ⌨️ **键盘导航** - 支持方向键和 ESC 键
- 🎯 **拖拽上传** - 支持拖拽文件上传

## 📦 安装

```bash
# 使用 npm
npm install react-file-preview

# 使用 yarn
yarn add react-file-preview

# 使用 pnpm
pnpm add react-file-preview
```

## 🚀 快速开始

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

## 💡 使用示例

### 预览 PowerPoint 文件

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
        预览 PPT
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

### 预览多个文件

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

## 📖 支持的文件格式

### 图片
- **格式**: JPG, PNG, GIF, WebP, SVG, BMP, ICO
- **功能**: 缩放 (0.5x - 5x)、旋转、拖拽、滚轮缩放、双击重置

### 视频
- **格式**: MP4, WebM, OGG, MOV, AVI, MKV, M4V, 3GP, FLV
- **功能**: 自定义播放器、进度控制、音量调节、全屏播放

### 音频
- **格式**: MP3, WAV, OGG, M4A, AAC, FLAC
- **功能**: 自定义播放器、进度条、音量控制、快进/快退

### 文档
- **PDF**: 分页浏览、缩放
- **Word**: DOCX 格式支持
- **Excel**: XLSX 格式支持
- **PowerPoint**: PPTX/PPT 格式支持、幻灯片预览

### 代码 & 文本
- **Markdown**: GitHub Flavored Markdown,代码高亮
- **代码文件**: JS, TS, Python, Java, C++, Go, Rust 等 40+ 种语言
- **文本文件**: TXT, LOG, CSV, JSON, YAML, XML 等

## 🎮 API 参考

### FilePreviewModal Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `files` | `PreviewFileInput[]` | ✅ | 文件列表（支持 File 对象、文件对象或 URL 字符串） |
| `currentIndex` | `number` | ✅ | 当前文件索引 |
| `isOpen` | `boolean` | ✅ | 是否打开预览 |
| `onClose` | `() => void` | ✅ | 关闭回调 |
| `onNavigate` | `(index: number) => void` | ❌ | 导航回调 |

### 文件类型定义

```typescript
// 支持三种文件输入类型
type PreviewFileInput = File | PreviewFileLink | string;

// 1. 原生 File 对象（浏览器 File API）
const file: File = ...;

// 2. 文件对象
interface PreviewFileLink {
  id?: string;       // 可选的唯一标识符
  name: string;      // 文件名
  type: string;      // MIME 类型
  url: string;       // 文件 URL (支持 blob URL 和 HTTP URL)
  size?: number;     // 文件大小（字节）
}

// 3. HTTP URL 字符串
const url: string = 'https://example.com/file.pdf';
```

### 使用示例

```typescript
// 方式 1: 使用原生 File 对象
const files = [file1, file2]; // File 对象数组

// 方式 2: 使用 HTTP URL 字符串
const files = [
  'https://example.com/image.jpg',
  'https://example.com/document.pdf',
];

// 方式 3: 使用文件对象
const files = [
  {
    name: 'presentation.pptx',
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    url: '/path/to/presentation.pptx',
  },
];

// 方式 4: 混合使用
const files = [
  file1,  // File 对象
  'https://example.com/image.jpg',  // URL 字符串
  { name: 'doc.pdf', type: 'application/pdf', url: '/doc.pdf' },  // 文件对象
];
```

### 支持的 MIME 类型

#### Office 文档
- **Word**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (.docx)
- **Excel**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (.xlsx)
- **PowerPoint**: `application/vnd.openxmlformats-officedocument.presentationml.presentation` (.pptx)
- **PowerPoint (旧版)**: `application/vnd.ms-powerpoint` (.ppt)

#### 其他文档
- **PDF**: `application/pdf`

#### 媒体文件
- **图片**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`, 等
- **视频**: `video/mp4`, `video/webm`, `video/ogg`, 等
- **音频**: `audio/mpeg`, `audio/wav`, `audio/ogg`, 等

#### 文本文件
- **Markdown**: 文件扩展名 `.md` 或 `.markdown`
- **代码**: 根据文件扩展名自动识别 (`.js`, `.ts`, `.py`, `.java`, 等)
- **纯文本**: `text/plain`, `text/csv`, 等

## 🎨 自定义样式

组件使用 Tailwind CSS 构建,您可以通过覆盖 CSS 变量来自定义样式:

```css
/* 自定义主题色 */
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #ec4899;
}
```

## ⌨️ 键盘快捷键

- `ESC` - 关闭预览
- `←` - 上一个文件
- `→` - 下一个文件
- `滚轮` - 缩放图片 (仅图片预览)

## 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/wh131462/react-file-preview.git

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 📄 许可证

[MIT](./LICENSE) © [EternalHeart](https://github.com/wh131462)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 🔗 相关链接

- [GitHub](https://github.com/wh131462/react-file-preview)
- [npm](https://www.npmjs.com/package/react-file-preview)
- [问题反馈](https://github.com/wh131462/react-file-preview/issues)

