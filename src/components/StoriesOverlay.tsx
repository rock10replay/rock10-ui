import React, { ReactNode } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  HardDrive, 
  Cloud, 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  QrCode as QrCodeIcon,
  Maximize2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Logo } from './Logo';
import { cn } from '../utils/cn';

export interface StoriesOverlayProps {
  arenaName?: string;
  arenaSlug?: string;
  arenaLogo?: string | null;
  courtName?: string | null;
  videoDate?: string | Date | null;
  qrCodeUrl?: string;
  currentIndex?: number;
  totalVideos?: number;
  progressPercent?: number; // 0 a 100
  isPlaying?: boolean;
  isMuted?: boolean;
  isCached?: boolean;
  cacheStatus?: string;
  screenOrientation?: 'horizontal' | 'vertical';
  videoOrientation?: 'horizontal' | 'vertical';
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onRefresh?: () => void;
  onSwitchArena?: () => void;
  onToggleFullscreen?: () => void;
  extraHeaderActions?: ReactNode;
  className?: string;
}

export const StoriesOverlay: React.FC<StoriesOverlayProps> = ({
  arenaName = 'Arena Esportiva',
  arenaSlug,
  arenaLogo,
  courtName,
  videoDate,
  qrCodeUrl,
  currentIndex = 0,
  totalVideos = 1,
  progressPercent = 0,
  isPlaying = true,
  isMuted = true,
  isCached = false,
  cacheStatus,
  screenOrientation: _screenOrientation = 'horizontal',
  videoOrientation: _videoOrientation = 'horizontal',
  onTogglePlay,
  onToggleMute,
  onNext,
  onPrevious,
  onRefresh,
  onSwitchArena,
  onToggleFullscreen,
  extraHeaderActions,
  className,
}) => {
  const finalQrUrl = qrCodeUrl || (arenaSlug ? `https://rock10.com.br/${arenaSlug}` : 'https://rock10.com.br');

  const formattedDate = React.useMemo(() => {
    if (!videoDate) return '';
    try {
      const d = typeof videoDate === 'string' ? new Date(videoDate) : videoDate;
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' • ' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
      return '';
    }
  }, [videoDate]);

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 sm:p-6 z-20 transition-all duration-300',
        className
      )}
    >
      {/* =========================================
          TOPO: Barras de Progresso & Cabeçalho
          ========================================= */}
      <div className="w-full flex flex-col gap-3">
        {/* Barras de progresso estilo Stories */}
        <div className="w-full flex items-center gap-1.5 px-0.5">
          {Array.from({ length: Math.min(totalVideos, 30) }).map((_, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={idx}
                className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-xs"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-150"
                  style={{
                    width: isCompleted ? '100%' : isCurrent ? `${progressPercent}%` : '0%',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Barra superior de marcas e informações */}
        <div className="w-full flex items-center justify-between gap-2 pointer-events-auto">
          {/* Lado Esquerdo: Identidade Dupla (Rock10 + Arena) */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/60 hover:bg-black/75 backdrop-blur-md border border-white/10 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-xl transition-colors min-w-0 max-w-[68%] sm:max-w-none">
            {/* Logo Rock10 */}
            <div className="flex items-center shrink-0">
              <Logo size="sm" themeMode="dark" className="h-5 sm:h-7 w-auto drop-shadow-sm" />
            </div>

            <div className="h-4 sm:h-5 w-[1px] bg-white/20 shrink-0" />

            {/* Logo e Nome da Arena */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {arenaLogo ? (
                <img
                  src={arenaLogo}
                  alt={arenaName}
                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg object-contain bg-white/10 p-0.5 border border-white/20 shrink-0"
                />
              ) : (
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-[10px] sm:text-xs shrink-0">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div className="flex flex-col min-w-0 pr-0.5">
                <span className="text-white text-[11px] sm:text-sm font-black tracking-tight truncate">
                  {arenaName}
                </span>
                {courtName && (
                  <span className="text-emerald-400 font-mono text-[9px] sm:text-xs font-semibold leading-tight truncate">
                    {courtName}
                  </span>
                )}
              </div>
            </div>

            {/* Badge de Origem do Vídeo: Storage Local vs Nuvem */}
            <div
              className={cn(
                'hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors shrink-0',
                isCached
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-blue-950/70 border-blue-500/40 text-blue-300'
              )}
              title={cacheStatus || (isCached ? 'Reproduzindo do storage local da TV' : 'Transmitindo da nuvem')}
            >
              {isCached ? (
                <>
                  <HardDrive className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>STORAGE</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-blue-400" />
                  <span>NUVEM</span>
                </>
              )}
            </div>
          </div>

          {/* Lado Direito: Controles rápidos e Relógio */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 p-1 sm:p-1.5 rounded-2xl shadow-xl shrink-0">
            {formattedDate && (
              <span className="hidden xl:inline-block text-white/80 font-mono text-xs px-2 font-medium">
                {formattedDate}
              </span>
            )}

            {onSwitchArena && (
              <button
                type="button"
                onClick={onSwitchArena}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1"
                title="Trocar de Arena"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Arenas</span>
              </button>
            )}

            {onTogglePlay && (
              <button
                type="button"
                onClick={onTogglePlay}
                className="p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />}
              </button>
            )}

            {onToggleMute && (
              <button
                type="button"
                onClick={onToggleMute}
                className="p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
                title={isMuted ? 'Ativar Som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
              </button>
            )}

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                className="p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
                title="Sincronizar novos vídeos"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 active:scale-95 transition-all"
                title="Tela Cheia"
              >
                <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {extraHeaderActions}
          </div>
        </div>
      </div>

      {/* =========================================
          MEIO: Setas de Navegação (Sensíveis ao toque, discretas)
          ========================================= */}
      <div className="w-full flex items-center justify-between px-0.5 pointer-events-none">
        {onPrevious ? (
          <button
            type="button"
            onClick={onPrevious}
            className="pointer-events-auto p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-black/30 hover:bg-black/70 text-white/60 hover:text-white border border-white/10 backdrop-blur-xs active:scale-90 transition-all shadow-md"
            title="Vídeo anterior"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        ) : <div />}

        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            className="pointer-events-auto p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-black/30 hover:bg-black/70 text-white/60 hover:text-white border border-white/10 backdrop-blur-xs active:scale-90 transition-all shadow-md"
            title="Próximo vídeo"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        ) : <div />}
      </div>

      {/* =========================================
          RODAPÉ RESPONSIVO: Adaptável entre Desktop e Mobile
          ========================================= */}
      <div className="w-full pointer-events-auto">
        {/* Layout Mobile / Tela Vertical: Card consolidado de largura total sem overflow */}
        <div className="sm:hidden w-full bg-black/80 backdrop-blur-md border border-emerald-500/30 p-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 text-white font-mono text-[10px]">
                <span className="font-bold text-emerald-400">{currentIndex + 1}</span>
                <span className="text-white/40">/</span>
                <span>{totalVideos}</span>
                <span className="text-white/50 text-[9px] ml-0.5">REPLAYS</span>
              </div>

              {formattedDate && (
                <span className="text-white/70 font-mono text-[9px] truncate">
                  {formattedDate}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-emerald-400 font-black text-[10px] tracking-wider uppercase mt-0.5">
              <QrCodeIcon className="w-3 h-3 shrink-0" />
              <span>Baixe seu Replay</span>
            </div>

            <p className="text-white/50 font-mono text-[9px] truncate">
              rock10.com.br/{arenaSlug || 'arena'}
            </p>
          </div>

          {/* QR Code compacto que cabe 100% no mobile sem vazar */}
          <div className="bg-white p-1 rounded-xl shadow-inner shrink-0 flex items-center justify-center border border-gray-100">
            <QRCodeSVG
              value={finalQrUrl}
              size={58}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Layout Desktop / Widescreen: Lado a lado com espaço generoso */}
        <div className="hidden sm:flex items-end justify-between gap-4 w-full">
          {/* Lado Esquerdo: Contador de Vídeos */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-xl shadow-lg text-white/90 text-xs font-mono">
              <span className="font-bold text-emerald-400 text-sm">{currentIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span>{totalVideos}</span>
              <span className="text-white/50 text-[10px] ml-1">REPLAYS</span>
            </div>

            {formattedDate && (
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-xl text-white/80 text-[11px] font-mono">
                {formattedDate}
              </div>
            )}
          </div>

          {/* Lado Direito: Card QR Code Esportivo com Alto Contraste */}
          <div className="group bg-black/75 hover:bg-black/90 backdrop-blur-lg border border-emerald-500/30 hover:border-emerald-500/60 p-3 sm:p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 max-w-[280px]">
            <div className="bg-white p-2 rounded-xl shadow-inner shrink-0 flex items-center justify-center border border-gray-100">
              <QRCodeSVG
                value={finalQrUrl}
                size={76}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="flex flex-col justify-center min-w-0 pr-1">
              <div className="flex items-center gap-1 text-emerald-400 font-black text-xs tracking-wider uppercase mb-0.5">
                <QrCodeIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Baixe seu Replay</span>
              </div>
              <p className="text-white/90 text-xs font-bold leading-tight">
                Aponte a câmera
              </p>
              <p className="text-white/50 font-mono text-[10px] truncate mt-0.5">
                rock10.com.br/{arenaSlug || 'arena'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesOverlay;
