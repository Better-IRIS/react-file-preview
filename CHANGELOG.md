# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-11-24

### Added
- 🎨 Modern Apple-inspired UI with glassmorphism effects
- 📁 Support for 20+ file formats
- 🖼️ Powerful image viewer with zoom (0.5x-5x), rotate, drag, and mouse wheel zoom
- 🎬 Custom video player built on Video.js
- 🎵 Custom audio player with beautiful controls
- 📄 PDF viewer with pagination support
- 📝 Markdown rendering with GitHub Flavored Markdown
- 💻 Code highlighting for 40+ programming languages
- 🎭 Smooth animations powered by Framer Motion
- 📱 Responsive design for all screen sizes
- ⌨️ Keyboard navigation (Arrow keys, ESC)
- 🎯 Drag & drop file upload
- 🔄 Reset button to restore all transformations
- 📚 Comprehensive API documentation
- 🌐 Bilingual README (English & Chinese)

### Features

#### Image Viewer
- Zoom in/out (0.5x - 5x)
- Rotate left/right (90° increments)
- Drag to pan
- Mouse wheel zoom
- Double-click to reset
- Fit to window
- Original size
- Reset all transformations

#### Video Player
- Custom Video.js player
- Support for MP4, WebM, OGG, MOV, AVI, MKV, M4V, 3GP, FLV
- Progress control
- Volume adjustment
- Fullscreen support

#### Audio Player
- Custom audio controls
- Progress bar
- Volume control
- Skip forward/backward (±10s)
- Time display

#### Document Viewer
- PDF pagination and zoom
- DOCX preview
- XLSX preview

#### Code & Text
- Markdown with GFM support
- Syntax highlighting for 40+ languages
- Support for TXT, LOG, CSV, JSON, YAML, XML, etc.

### Technical Details
- Built with React 18.3.1 and TypeScript
- Vite 5.4.11 for build tooling
- Tailwind CSS for styling
- Framer Motion for animations
- pdfjs-dist 4.8.69 for PDF rendering
- react-pdf 9.2.1 for PDF components
- Video.js 8.23.4 for video playback
- react-markdown 10.1.0 for Markdown rendering
- react-syntax-highlighter 16.1.0 for code highlighting

### Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm deploy` - Build and preview
- `pnpm release` - Lint and build for release

### Documentation
- Comprehensive README in English and Chinese
- API reference documentation
- Usage examples
- Supported file formats list
- Keyboard shortcuts guide

### License
MIT License - see LICENSE file for details

