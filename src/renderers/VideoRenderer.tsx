import { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

type VideoJsPlayer = ReturnType<typeof videojs>;

interface VideoRendererProps {
  url: string;
}

// 根据 URL 获取视频 MIME 类型
const getVideoType = (url: string): string => {
  const ext = url.split('.').pop()?.toLowerCase().split('?')[0] || '';
  const typeMap: Record<string, string> = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    ogv: 'video/ogg',
    mov: 'video/mp4', // MOV 通常可以用 mp4 解码器
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    m4v: 'video/mp4',
    '3gp': 'video/3gpp',
    flv: 'video/x-flv',
  };
  return typeMap[ext] || 'video/mp4';
};

export const VideoRenderer: React.FC<VideoRendererProps> = ({ url }) => {
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    // 确保 Video.js 播放器只初始化一次
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-apple');
      videoRef.current.appendChild(videoElement);

      const videoType = getVideoType(url);

      const player = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        preload: 'auto',
        sources: [{
          src: url,
          type: videoType
        }]
      });

      player.on('error', () => {
        setError('视频加载失败');
      });

      playerRef.current = player;
    }
  }, [url]);

  // 清理函数
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-white/70 text-center">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full p-8">
      <div className="w-full max-w-5xl">
        <div ref={videoRef} />
      </div>
    </div>
  );
};

