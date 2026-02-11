import { useState, useEffect, useRef, useCallback } from 'react';
import { Presentation } from 'lucide-react';
import { init } from 'pptx-preview';

interface PptxRendererProps {
  url: string;
}

export const PptxRenderer: React.FC<PptxRendererProps> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewerRef = useRef<ReturnType<typeof init> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const arrayBufferRef = useRef<ArrayBuffer | null>(null);
  const resizeTimeoutRef = useRef<number | null>(null);
  const lastDimensionsRef = useRef({ width: 0, height: 0 });

  // 计算容器尺寸
  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 960, height: 540 };

    const containerWidth = containerRef.current.clientWidth;
    // 16:9 比例
    const height = Math.floor(containerWidth * 9 / 16);

    console.log('计算尺寸:', { width: containerWidth, height });
    return { width: containerWidth, height };
  }, []);

  // 重新初始化预览器
  const reinitializePreviewer = useCallback(async () => {
    if (!containerRef.current || !arrayBufferRef.current) return;

    console.log('重新初始化预览器...');

    try {
      // 销毁旧的预览器
      if (previewerRef.current) {
        try {
          previewerRef.current.destroy();
        } catch (e) {
          console.error('销毁预览器失败:', e);
        }
      }

      // 清空容器
      containerRef.current.innerHTML = '';

      // 获取当前容器尺寸
      const currentDimensions = calculateDimensions();
      console.log('重新初始化使用尺寸:', currentDimensions);

      // 初始化新的预览器
      const previewer = init(containerRef.current, {
        width: currentDimensions.width,
        height: currentDimensions.height,
      });

      previewerRef.current = previewer;

      // 重新预览
      await previewer.preview(arrayBufferRef.current);
      console.log('重新初始化成功');
    } catch (e) {
      console.error('重新初始化失败:', e);
    }
  }, [calculateDimensions]);

  // 监听容器尺寸变化
  useEffect(() => {
    if (!containerRef.current) return;

    let isInitialRender = true;

    const updateDimensions = () => {
      // 跳过初始渲染时的尺寸检查
      if (isInitialRender) {
        isInitialRender = false;
        const initialDimensions = calculateDimensions();
        lastDimensionsRef.current = initialDimensions;
        return;
      }

      const newDimensions = calculateDimensions();

      // 检查尺寸是否真正变化（至少变化10px才触发）
      const lastDimensions = lastDimensionsRef.current;
      const widthDiff = Math.abs(lastDimensions.width - newDimensions.width);
      const heightDiff = Math.abs(lastDimensions.height - newDimensions.height);

      if (widthDiff < 10 && heightDiff < 10) {
        console.log('尺寸变化太小，忽略');
        return; // 尺寸变化太小，不做任何操作
      }

      console.log('检测到尺寸变化:', {
        old: lastDimensions,
        new: newDimensions,
        diff: { width: widthDiff, height: heightDiff }
      });

      // 更新最后的尺寸
      lastDimensionsRef.current = newDimensions;

      // 清除之前的定时器
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // 防抖：800ms 后重新初始化预览器
      resizeTimeoutRef.current = window.setTimeout(() => {
        if (previewerRef.current && arrayBufferRef.current) {
          console.log('尺寸变化，准备重新初始化');
          reinitializePreviewer();
        }
      }, 800);
    };

    // 创建 ResizeObserver
    resizeObserverRef.current = new ResizeObserver(() => {
      updateDimensions();
    });

    // 开始观察容器
    resizeObserverRef.current.observe(containerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculateDimensions, reinitializePreviewer]);

  useEffect(() => {
    let isMounted = true;

    const loadPptx = async () => {
      if (!containerRef.current) {
        console.log('Container ref not ready');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('开始加载 PPTX:', url);

        // 获取文件
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('文件加载失败');
        }

        const arrayBuffer = await response.arrayBuffer();
        arrayBufferRef.current = arrayBuffer; // 保存到 ref
        console.log('文件加载成功，大小:', arrayBuffer.byteLength);

        if (!isMounted) return;

        // 清空容器
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // 获取当前容器尺寸
        const currentDimensions = calculateDimensions();
        console.log('使用尺寸:', currentDimensions);

        // 初始化 pptx 预览器
        console.log('初始化预览器...');
        const previewer = init(containerRef.current, {
          width: currentDimensions.width,
          height: currentDimensions.height,
        });

        previewerRef.current = previewer;

        // 预览 PPTX
        console.log('开始预览...');
        previewer.preview(arrayBuffer)
          .then(() => {
            console.log('预览成功');
            if (isMounted) {
              setLoading(false);
            }
          })
          .catch((previewErr) => {
            console.error('预览失败:', previewErr);
            if (isMounted) {
              setError('PPT 文件预览失败');
              setLoading(false);
            }
          });
      } catch (err) {
        console.error('PPTX 解析错误:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'PPT 文件解析失败');
          setLoading(false);
        }
      }
    };

    // 延迟执行以确保 DOM 已准备好
    const timer = setTimeout(() => {
      loadPptx();
    }, 100);

    // 清理函数
    return () => {
      isMounted = false;
      clearTimeout(timer);
      arrayBufferRef.current = null;
      if (previewerRef.current) {
        try {
          previewerRef.current.destroy();
        } catch (e) {
          console.error('销毁预览器失败:', e);
        }
      }
      previewerRef.current = null;
    };
  }, [url, calculateDimensions]);

  return (
    <div className="rfp-relative rfp-flex rfp-flex-col rfp-items-center rfp-w-full rfp-h-full rfp-pt-2 rfp-px-2 md:rfp-px-4">
      {/* 加载状态 - 绝对定位覆盖 */}
      {loading && (
        <div className="rfp-absolute rfp-inset-0 rfp-flex rfp-items-center rfp-justify-center rfp-bg-black/50 rfp-backdrop-blur-sm rfp-z-10 rfp-rounded-xl md:rfp-rounded-2xl">
          <div className="rfp-text-center">
            <div className="rfp-w-10 rfp-h-10 md:rfp-w-12 md:rfp-h-12 rfp-mx-auto rfp-mb-3 rfp-border-4 rfp-border-white/20 rfp-border-t-white rfp-rounded-full rfp-animate-spin" />
            <p className="rfp-text-xs md:rfp-text-sm rfp-text-white/70 rfp-font-medium">加载 PPT 中...</p>
          </div>
        </div>
      )}

      {/* 错误状态 - 绝对定位覆盖 */}
      {error && (
        <div className="rfp-absolute rfp-inset-0 rfp-flex rfp-items-center rfp-justify-center rfp-bg-black/50 rfp-backdrop-blur-sm rfp-z-10 rfp-rounded-xl md:rfp-rounded-2xl">
          <div className="rfp-text-center rfp-max-w-sm md:rfp-max-w-md rfp-px-4">
            <div className="rfp-w-24 rfp-h-24 md:rfp-w-32 md:rfp-h-32 rfp-mx-auto rfp-mb-4 md:rfp-mb-6 rfp-rounded-2xl md:rfp-rounded-3xl rfp-bg-gradient-to-br rfp-from-orange-500 rfp-via-red-500 rfp-to-pink-500 rfp-flex rfp-items-center rfp-justify-center rfp-shadow-2xl">
              <Presentation className="rfp-w-12 rfp-h-12 md:rfp-w-16 md:rfp-h-16 rfp-text-white" />
            </div>
            <p className="rfp-text-lg md:rfp-text-xl rfp-text-white/90 rfp-mb-2 md:rfp-mb-3 rfp-font-medium">PPT 预览</p>
            <p className="rfp-text-xs md:rfp-text-sm rfp-text-white/60 rfp-mb-4 md:rfp-mb-6">
              {error || '浏览器暂不支持直接预览 PPT 文件'}
            </p>
            <a
              href={url}
              download
              className="rfp-inline-flex rfp-items-center rfp-gap-2 rfp-px-4 rfp-py-2 md:rfp-px-6 md:rfp-py-3 rfp-bg-gradient-to-r rfp-from-purple-500 rfp-to-pink-500 rfp-text-white rfp-text-sm md:rfp-text-base rfp-rounded-lg md:rfp-rounded-xl hover:rfp-scale-105 rfp-transition-all rfp-shadow-lg"
            >
              <svg className="rfp-w-4 rfp-h-4 md:rfp-w-5 md:rfp-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载文件
            </a>
            <p className="rfp-text-xs rfp-text-white/40 rfp-mt-3 md:rfp-mt-4">
              提示：可以使用 Microsoft PowerPoint 或 WPS 打开
            </p>
          </div>
        </div>
      )}

      {/* PPT 容器 - 始终渲染 */}
      <div
        ref={containerRef}
        className="pptx-wrapper rfp-w-full rfp-max-w-full md:rfp-max-w-6xl"
      />
    </div>
  );
};
