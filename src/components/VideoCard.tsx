import { useState, useRef, useEffect, ReactNode } from 'react';
import { Play, MapPin, Calendar, Clock, Download, Heart, Eye, Share2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { DownloadButton } from './DownloadButton';
import { LikeButton } from './LikeButton';
import { IconButton } from './IconButton';

export interface VideoData {
  id: number;
  nome: string;
  dthr: string;
  poster: string;
  url: string;
  downloads: number;
  curtidas: number;
  visualizacoes?: number;
  compartilhamentos?: number;
  quadra_id?: number;
  quadra_nome?: string;
  arena_nome?: string;
  is_vertical?: boolean | number;
}

export interface VideoCardProps {
  video: VideoData;
  showShare?: boolean;
  onPlay?: (video: VideoData) => void;
  onShare?: (video: VideoData) => void;
  onLikeChange?: (videoId: number, liked: boolean) => void;
  onDownloadComplete?: (videoId: number) => void;
  onDownloadIncrement?: (videoId: number) => Promise<number>;
  extraActions?: ReactNode;
  className?: string;
}

export function VideoCard({
  video,
  showShare = true,
  onPlay,
  onShare,
  onLikeChange,
  onDownloadComplete,
  onDownloadIncrement,
  extraActions,
  className,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [likeCount, setLikeCount] = useState<number>(video.curtidas);
  const [downloadCount, setDownloadCount] = useState<number>(video.downloads);
  const [viewCount, setViewCount] = useState<number>(video.visualizacoes || 0);
  const [shareCount, setShareCount] = useState<number>(video.compartilhamentos || 0);

  const isVertical =
    video.is_vertical === undefined || (video.is_vertical !== false && video.is_vertical !== 0);

  useEffect(() => {
    setLikeCount(video.curtidas);
    setDownloadCount(video.downloads);
    setViewCount(video.visualizacoes || 0);
    setShareCount(video.compartilhamentos || 0);
  }, [video.curtidas, video.downloads, video.visualizacoes, video.compartilhamentos]);

  const formattedTime =
    video.dthr && video.dthr.length >= 16 ? video.dthr.substring(11, 16) : '';

  const formattedDate =
    video.dthr && video.dthr.length >= 10
      ? new Date(video.dthr).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        })
      : '';

  const sanitize = (str: string): string =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/-{2,}/g, '-')
      .trim();

  const downloadFileName = [
    'Rock10',
    video.arena_nome ? sanitize(video.arena_nome) : null,
    video.quadra_nome ? sanitize(video.quadra_nome) : null,
    sanitize(video.nome.replace(/\.mp4$/i, '')),
  ]
    .filter(Boolean)
    .join('-') + '.mp4';

  const handlePlay = (): void => {
    setShouldLoadVideo(true);
    setIsPlaying(true);
    setViewCount((prev) => prev + 1);

    if (onPlay) {
      onPlay(video);
    }
  };

  const handleTogglePlay = (): void => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        handlePlay();
      }
    }
  };

  const handleDefaultShare = async (): Promise<void> => {
    if (onShare) {
      onShare(video);
      return;
    }

    const videoPageUrl = `${window.location.origin}/video/${video.id}`;
    const shareData = {
      title: video.nome,
      text: `Confira este lance gravado no Rock10 Replay:`,
      url: videoPageUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareCount((prev) => prev + 1);
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setShareCount((prev) => prev + 1);
      alert('Link copiado para a área de transferência!');
    } catch {
      window.open(shareData.url, '_blank');
    }
  };

  return (
    <article
      className={cn(
        'group relative flex flex-col bg-white dark:bg-dark-surface rounded-2xl shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-dark-border',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden bg-black z-10 cursor-pointer select-none',
          isVertical ? 'aspect-[9/16]' : 'aspect-[16/9]',
          isPlaying && 'rounded-b-none'
        )}
        onClick={handleTogglePlay}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain transition-transform duration-300 bg-black group-hover:scale-[1.02]"
          src={shouldLoadVideo ? video.url : undefined}
          poster={video.poster}
          controls={isPlaying}
          autoPlay={isPlaying}
          playsInline
          muted={false}
          preload={shouldLoadVideo ? 'metadata' : 'none'}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {!isPlaying && (
          <>
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition-opacity duration-300 z-20 pointer-events-none group-hover:bg-black/30">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/95 dark:bg-dark-surface/95 text-primary-500 rounded-full shadow-2xl backdrop-blur-sm transition-transform duration-200 hover:scale-110 active:scale-95">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>

            {/* Bottom Details Overlay */}
            <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-dark-surface dark:via-dark-surface/85 dark:to-transparent pt-8 pb-3 px-3.5 flex flex-col gap-1 z-20 pointer-events-none">
              {(video.arena_nome || video.quadra_nome) && (
                <div className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1.5 leading-none">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {video.arena_nome || ''} {video.arena_nome && video.quadra_nome ? '•' : ''}{' '}
                    {video.quadra_nome || ''}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center w-full mt-1.5">
                <span className="text-xs font-bold text-gray-800 dark:text-dark-text flex items-center gap-1.5 leading-none">
                  <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-dark-text-muted" /> {formattedDate}
                  <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-dark-text-muted ml-0.5" /> {formattedTime}
                </span>
                <div className="flex gap-2 sm:gap-2.5 items-center text-xs font-bold text-gray-800 dark:text-dark-text leading-none">
                  <span className="flex items-center gap-1" title="Visualizações">
                    <Eye className="w-3.5 h-3.5 text-gray-500 dark:text-dark-text-muted" /> {viewCount}
                  </span>
                  <span className="flex items-center gap-1" title="Compartilhamentos">
                    <Share2 className="w-3.5 h-3.5 text-gray-500 dark:text-dark-text-muted" /> {shareCount}
                  </span>
                  <span className="flex items-center gap-1" title="Downloads">
                    <Download className="w-3.5 h-3.5 text-gray-500 dark:text-dark-text-muted" /> {downloadCount}
                  </span>
                  <span className="flex items-center gap-1" title="Curtidas">
                    <Heart className="w-3.5 h-3.5 text-gray-500 dark:text-dark-text-muted" /> {likeCount}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col gap-3 relative z-20 bg-white dark:bg-dark-surface flex-1">
        <div
          className="flex gap-2.5 items-center justify-start pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <DownloadButton
            videoUrl={video.url}
            fileName={downloadFileName}
            downloadCount={downloadCount}
            size="sm"
            iconOnly
            onDownloadIncrement={
              onDownloadIncrement ? () => onDownloadIncrement(video.id) : undefined
            }
            onDownloadChange={(newCount) => setDownloadCount(newCount)}
            onDownloadComplete={() => onDownloadComplete?.(video.id)}
          />

          <LikeButton
            videoId={video.id}
            initialLikes={likeCount}
            size="sm"
            iconOnly
            onLikeChange={(newCount) => {
              setLikeCount(newCount);
              onLikeChange?.(video.id, true);
            }}
          />

          {showShare && (
            <IconButton
              icon={<Share2 className="w-4 h-4 text-gray-600 dark:text-dark-text" />}
              ariaLabel="Compartilhar vídeo"
              variant="ghost"
              size="sm"
              rounded
              onClick={handleDefaultShare}
            />
          )}

          {extraActions && <div className="ml-auto flex items-center gap-2">{extraActions}</div>}
        </div>
      </div>
    </article>
  );
}

export default VideoCard;
