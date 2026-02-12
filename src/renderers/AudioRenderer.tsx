import {
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioRendererProps {
  url: string;
  fileName: string;
}

export const AudioRenderer: React.FC<AudioRendererProps> = ({
  url,
  fileName,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isNaN(audio.currentTime)) {
        setCurrentTime(audio.currentTime);
      }
    };

    const updateDuration = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => updateDuration();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);

    if (audio.readyState >= 1) {
      updateDuration();
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
    if (vol > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleError = () => {
    setError("Failed to load audio");
  };

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
    <div className="rfp-flex rfp-flex-col rfp-items-center rfp-justify-center rfp-w-full rfp-h-full rfp-p-4 md:rfp-p-8 rfp-gap-4 md:rfp-gap-8">
      <div className="rfp-w-48 rfp-h-48 md:rfp-w-64 md:rfp-h-64 rfp-rounded-3xl rfp-bg-gradient-to-br rfp-from-purple-500 rfp-via-pink-500 rfp-to-rose-500 rfp-flex rfp-items-center rfp-justify-center rfp-shadow-2xl rfp-backdrop-blur-xl">
        <Music className="rfp-w-24 rfp-h-24 md:rfp-w-32 md:rfp-h-32 rfp-text-white" />
      </div>

      <div className="rfp-text-white rfp-text-center rfp-max-w-sm md:rfp-max-w-md rfp-px-4">
        <p className="rfp-text-xl md:rfp-text-2xl rfp-font-medium rfp-mb-1 rfp-truncate">
          {fileName}
        </p>
        <p className="rfp-text-xs md:rfp-text-sm rfp-text-white/60">
          Audio File
        </p>
      </div>

      <div className="rfp-w-full rfp-max-w-sm md:rfp-max-w-md rfp-bg-white/10 rfp-backdrop-blur-xl rfp-rounded-2xl rfp-p-4 md:rfp-p-6 rfp-border rfp-border-white/20">
        <div className="rfp-mb-4">
          <div className="rfp-relative rfp-h-4 rfp-flex rfp-items-center">
            <div className="rfp-absolute rfp-w-full rfp-h-[6px] rfp-bg-white/20 rfp-rounded-full" />

            <div
              className="rfp-absolute rfp-h-[6px] rfp-bg-gradient-to-r rfp-from-purple-500 rfp-to-pink-500 rfp-rounded-full rfp-transition-all rfp-duration-100 rfp-ease-linear rfp-pointer-events-none"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : currentTime > 100 ? 100 : currentTime}%`,
              }}
            />

            <input
              type="range"
              min="0"
              max={
                duration > 0
                  ? duration
                  : 100 + (currentTime > 100 ? currentTime % 100 : 0)
              }
              value={currentTime}
              onChange={handleSeek}
              className="audio-slider rfp-absolute rfp-w-full"
            />
          </div>
          <div className="rfp-flex rfp-justify-between rfp-text-xs rfp-text-white/60 rfp-mt-3">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="rfp-flex rfp-items-center rfp-justify-center rfp-gap-4 rfp-mb-4">
          <button
            onClick={() => skip(-10)}
            className="rfp-w-10 rfp-h-10 rfp-rounded-full rfp-bg-white/10 hover:rfp-bg-white/20 rfp-flex rfp-items-center rfp-justify-center rfp-text-white rfp-transition-all"
          >
            <SkipBack className="rfp-w-5 rfp-h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="rfp-w-14 rfp-h-14 rfp-rounded-full rfp-bg-gradient-to-br rfp-from-purple-500 rfp-to-pink-500 hover:rfp-scale-105 rfp-flex rfp-items-center rfp-justify-center rfp-text-white rfp-transition-all rfp-shadow-lg"
          >
            {isPlaying ? (
              <Pause className="rfp-w-6 rfp-h-6" />
            ) : (
              <Play className="rfp-w-6 rfp-h-6 rfp-ml-1" />
            )}
          </button>

          <button
            onClick={() => skip(10)}
            className="rfp-w-10 rfp-h-10 rfp-rounded-full rfp-bg-white/10 hover:rfp-bg-white/20 rfp-flex rfp-items-center rfp-justify-center rfp-text-white rfp-transition-all"
          >
            <SkipForward className="rfp-w-5 rfp-h-5" />
          </button>
        </div>

        <div className="rfp-flex rfp-items-center rfp-gap-3">
          <button
            onClick={toggleMute}
            className="rfp-text-white/80 hover:rfp-text-white rfp-transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="rfp-w-5 rfp-h-5" />
            ) : (
              <Volume2 className="rfp-w-5 rfp-h-5" />
            )}
          </button>
          <div className="rfp-flex-1 rfp-relative rfp-h-3 rfp-flex rfp-items-center">
            <div className="rfp-absolute rfp-w-full rfp-h-[4px] rfp-bg-white/20 rfp-rounded-full" />

            <div
              className="rfp-absolute rfp-h-[4px] rfp-bg-purple-500 rfp-rounded-full rfp-transition-all rfp-duration-100 rfp-pointer-events-none"
              style={{
                width: `${(isMuted ? 0 : volume) * 100}%`,
              }}
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider rfp-absolute rfp-w-full"
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={url}
        onError={handleError}
        className="rfp-hidden"
      />
    </div>
  );
};
