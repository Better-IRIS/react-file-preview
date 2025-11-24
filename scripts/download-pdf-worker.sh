#!/bin/bash

# 下载 PDF.js worker 文件以支持完全离线使用

echo "正在下载 PDF.js worker..."

# 创建 public 目录(如果不存在)
mkdir -p public

# 下载 worker 文件
curl -o public/pdf.worker.min.mjs https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs

if [ $? -eq 0 ]; then
    echo "✅ PDF.js worker 下载成功!"
    echo "📝 请修改 src/renderers/PdfRenderer.tsx 中的 worker 路径:"
    echo "   pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';"
else
    echo "❌ 下载失败,请检查网络连接"
    exit 1
fi

