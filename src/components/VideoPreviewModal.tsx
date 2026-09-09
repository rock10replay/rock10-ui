import React from 'react';
import {
  X,
  ExternalLink,
  Download,
  Calendar,
  Building2,
  Warehouse,
  LayoutGrid,
  Eye,
  Heart,
  Share2,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { Button } from './Button';
import { CopyButton } from './CopyButton';

export interface VideoPreviewItem {
  id?: string | number;
  nome: string;
  url: string;
  poster?: string | null;
  is_vertical?: boolean;
  dthr?: string;
  grupo_nome?: string;
  grupo_slug?: string;
  arena_nome?: string;
  quadra_nome?: string;
  visualizacoes?: number;
  curtidas?: number;
  downloads?: number;
  compartilhamentos?: number;
  [key: string]: any;
}

export interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: VideoPreviewItem | null;
  /** Custom title override */
  title?: string;
  /** Custom additional action elements */
  extraActions?: React.ReactNode;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  onClose,
  video,
  title,
  extraActions,
}) => {
  if (!isOpen || !video) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const hasMetrics =
    video.visualizacoes !== undefined ||
    video.curtidas !== undefined ||
    video.downloads !== undefined ||
    video.compartilhamentos !== undefined;

  const hasLocation =
    video.grupo_nome || video.arena_nome || video.quadra_nome || video.dthr;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-dark-surface border border-gray-150 dark:border-dark-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center font-bold">
              {video.is_vertical ? (
                <Smartphone className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-dark-text line-clamp-1">
                {title || video.nome}
              </h3>
              <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                {video.id !== undefined && `ID #${video.id} • `}
                {video.is_vertical
                  ? 'Gravação Vertical (9:16)'
                  : 'Gravação Horizontal (16:9)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body com Player e Informações */}
        <div className="flex-1 overflow-y-auto p-6">
          {video.is_vertical ? (
            /* LAYOUT PARA VÍDEO VERTICAL (9:16) - Split View em 2 colunas */
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch">
              {/* Player Vertical */}
              <div className="relative w-full max-w-[280px] sm:max-w-[310px] aspect-[9/16] max-h-[520px] bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border-2 border-purple-500/40 shrink-0 mx-auto">
                <video
                  src={video.url}
                  poster={video.poster || undefined}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain rounded-2xl"
                >
                  Seu navegador não suporta a tag de vídeo HTML5.
                </video>
              </div>

              {/* Informações e Metadados ao Lado */}
              <div className="flex-1 flex flex-col justify-between space-y-4 w-full">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                      Formato Stories / Reels (9:16)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-purple-600 dark:text-purple-300 font-semibold">
                    Vertical Otimizado
                  </span>
                </div>

                {hasLocation && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface-light/40 border border-gray-100 dark:border-dark-border/40 space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Origem da Gravação
                    </h4>
                    <div className="space-y-1.5 text-xs text-gray-700 dark:text-dark-text">
                      {video.grupo_nome && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                          <span className="font-semibold">{video.grupo_nome}</span>
                          {video.grupo_slug && (
                            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                              (/{video.grupo_slug})
                            </span>
                          )}
                        </div>
                      )}
                      {video.arena_nome && (
                        <div className="flex items-center gap-2">
                          <Warehouse className="w-4 h-4 text-blue-500 shrink-0" />
                          <span>{video.arena_nome}</span>
                        </div>
                      )}
                      {video.quadra_nome && (
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{video.quadra_nome}</span>
                        </div>
                      )}
                      {video.dthr && (
                        <div className="flex items-center gap-2 pt-1 border-t border-gray-200/50 dark:border-dark-border/30">
                          <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-medium text-gray-600 dark:text-dark-text-muted">
                            Gravado em: {formatDate(video.dthr)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {hasMetrics && (
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface-light/40 border border-gray-100 dark:border-dark-border/40 space-y-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Métricas de Engajamento
                    </h4>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {video.visualizacoes !== undefined && (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                          <Eye className="w-4 h-4 text-indigo-500" />
                          <div>
                            <span className="text-[10px] text-gray-400 block">Views</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                              {video.visualizacoes}
                            </span>
                          </div>
                        </div>
                      )}
                      {video.curtidas !== undefined && (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <div>
                            <span className="text-[10px] text-gray-400 block">Curtidas</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                              {video.curtidas}
                            </span>
                          </div>
                        </div>
                      )}
                      {video.downloads !== undefined && (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                          <Download className="w-4 h-4 text-blue-500" />
                          <div>
                            <span className="text-[10px] text-gray-400 block">Downloads</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                              {video.downloads}
                            </span>
                          </div>
                        </div>
                      )}
                      {video.compartilhamentos !== undefined && (
                        <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-emerald-500" />
                          <div>
                            <span className="text-[10px] text-gray-400 block">Shares</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                              {video.compartilhamentos}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* LAYOUT PARA VÍDEO HORIZONTAL (16:9) */
            <div className="space-y-6">
              <div className="relative w-full bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center aspect-video max-h-[460px]">
                <video
                  src={video.url}
                  poster={video.poster || undefined}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain rounded-2xl aspect-video"
                >
                  Seu navegador não suporta a tag de vídeo HTML5.
                </video>
              </div>

              {(hasLocation || hasMetrics) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hasLocation && (
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface-light/40 border border-gray-100 dark:border-dark-border/40 space-y-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Origem da Gravação
                      </h4>
                      <div className="space-y-1.5 text-xs text-gray-700 dark:text-dark-text">
                        {video.grupo_nome && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                            <span className="font-semibold">{video.grupo_nome}</span>
                            {video.grupo_slug && (
                              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                                (/{video.grupo_slug})
                              </span>
                            )}
                          </div>
                        )}
                        {video.arena_nome && (
                          <div className="flex items-center gap-2">
                            <Warehouse className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>{video.arena_nome}</span>
                          </div>
                        )}
                        {video.quadra_nome && (
                          <div className="flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{video.quadra_nome}</span>
                          </div>
                        )}
                        {video.dthr && (
                          <div className="flex items-center gap-2 pt-1 border-t border-gray-200/50 dark:border-dark-border/30">
                            <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="font-medium text-gray-600 dark:text-dark-text-muted">
                              Gravado em: {formatDate(video.dthr)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {hasMetrics && (
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface-light/40 border border-gray-100 dark:border-dark-border/40 space-y-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Métricas de Engajamento
                      </h4>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {video.visualizacoes !== undefined && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                            <Eye className="w-4 h-4 text-indigo-500" />
                            <div>
                              <span className="text-[10px] text-gray-400 block">Views</span>
                              <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                                {video.visualizacoes}
                              </span>
                            </div>
                          </div>
                        )}
                        {video.curtidas !== undefined && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <div>
                              <span className="text-[10px] text-gray-400 block">Curtidas</span>
                              <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                                {video.curtidas}
                              </span>
                            </div>
                          </div>
                        )}
                        {video.downloads !== undefined && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                            <Download className="w-4 h-4 text-blue-500" />
                            <div>
                              <span className="text-[10px] text-gray-400 block">Downloads</span>
                              <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                                {video.downloads}
                              </span>
                            </div>
                          </div>
                        )}
                        {video.compartilhamentos !== undefined && (
                          <div className="p-2.5 rounded-xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-emerald-500" />
                            <div>
                              <span className="text-[10px] text-gray-400 block">Shares</span>
                              <span className="text-sm font-bold text-gray-800 dark:text-dark-text">
                                {video.compartilhamentos}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gray-50 dark:bg-dark-surface-light/30 border-t border-gray-100 dark:border-dark-border">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-dark-text hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir URL direta
            </a>
            <a
              href={video.url}
              download={video.nome}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar MP4
            </a>
            <CopyButton
              text={video.url}
              label="Copiar Link"
              copiedLabel="Copiado!"
              variant="outline"
              size="sm"
            />
            {extraActions}
          </div>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
