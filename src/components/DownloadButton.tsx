import { useState, ReactNode } from 'react';
import { Download, Loader2, Check, X } from 'lucide-react';
import { cn } from '../utils/cn';

type DownloadState = 'idle' | 'downloading' | 'success' | 'error';

export interface DownloadButtonProps {
  /** ID do vídeo opcional */
  videoId?: number;
  /** URL do vídeo para download */
  videoUrl: string;
  /** Nome do arquivo para download */
  fileName: string;
  /** Contador de downloads */
  downloadCount?: number;
  /** Função assíncrona opcional que incrementa os downloads no servidor e retorna a nova contagem */
  onDownloadIncrement?: () => Promise<number>;
  /** Callback após download completado */
  onDownloadComplete?: () => void;
  /** Callback para atualizar contagem de downloads */
  onDownloadChange?: (newCount: number) => void;
  /** Callback em caso de erro */
  onError?: (error: Error) => void;
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
  /** Se true, mostra apenas o ícone */
  iconOnly?: boolean;
  /** Se true, utiliza ícones do Lucide (Download, Loader2, Check, X) ao invés de emoji */
  useLucide?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

export const DownloadButton = ({
  videoUrl,
  fileName,
  downloadCount = 0,
  onDownloadIncrement,
  onDownloadComplete,
  onDownloadChange,
  onError,
  size = 'md',
  iconOnly = false,
  useLucide = true,
  className,
}: DownloadButtonProps): JSX.Element => {
  const [state, setState] = useState<DownloadState>('idle');
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(downloadCount);

  const handleDownload = async (): Promise<void> => {
    try {
      setState('downloading');
      setProgress(0);

      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('Falha ao baixar o vídeo');
      }

      const totalSize = response.headers.get('content-length');
      if (!totalSize) {
        throw new Error('Não foi possível obter o tamanho do arquivo');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Não foi possível ler o stream do vídeo');
      }

      let receivedLength = 0;
      const chunks: Uint8Array[] = [];
      const totalBytes = parseInt(totalSize, 10);

      while (true) {
         const { done, value } = await reader.read();
         if (done) break;
         chunks.push(value);
         receivedLength += value.length;
         setProgress(Math.round((receivedLength / totalBytes) * 100));
      }

      setProgress(100);
      const blob = new Blob(chunks as BlobPart[]);
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

      setState('success');
      const optimistic = count + 1;
      setCount(optimistic);
      onDownloadChange?.(optimistic);

      // Reseta para idle após 2 segundos
      setTimeout(() => {
        setState('idle');
        setProgress(0);
      }, 2000);

      // Chama a função assíncrona recebida via props para registrar o incremento
      if (onDownloadIncrement) {
        try {
          const serverCount = await onDownloadIncrement();
          if (serverCount !== optimistic) {
            setCount(serverCount);
            onDownloadChange?.(serverCount);
          }
        } catch (apiErr) {
          onError?.(apiErr as Error);
        }
      }

      onDownloadComplete?.();
    } catch (error) {
      setState('error');
      onError?.(error as Error);
      
      // Reseta para idle após 2 segundos
      setTimeout(() => {
        setState('idle');
        setProgress(0);
      }, 2000);
    }
  };

  const lucideIconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const getIcon = (): ReactNode => {
    if (useLucide) {
      switch (state) {
        case 'downloading':
          return <Loader2 className="animate-spin text-primary-500" size={lucideIconSizes[size]} />;
        case 'success':
          return <Check className="text-green-600 dark:text-green-400" size={lucideIconSizes[size]} />;
        case 'error':
          return <X className="text-red-600 dark:text-red-400" size={lucideIconSizes[size]} />;
        default:
          return <Download className="text-gray-600 dark:text-dark-text-muted group-hover:text-primary-500 transition-colors" size={lucideIconSizes[size]} />;
      }
    }

    switch (state) {
      case 'downloading':
        return '⏳';
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      default:
        return '⬇️';
    }
  };

  const getLabel = (): string => {
    switch (state) {
      case 'downloading':
        return `${progress}%`;
      case 'success':
        return 'Baixado!';
      case 'error':
        return 'Erro';
      default:
        return iconOnly ? '' : 'Download';
    }
  };

  // State configurations
  const stateStyles = {
    idle: "bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-surface-light border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:-translate-y-0.5",
    downloading: "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-800 text-primary-700 dark:text-primary-400",
    success: "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 animate-successPulse",
    error: "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 animate-shake",
  };

  const iconOnlySizeClasses = {
    sm: "w-9 h-9 p-0 text-xs rounded-xl min-h-0 shrink-0 justify-center",
    md: "w-10 h-10 p-0 text-sm rounded-xl min-h-0 shrink-0 justify-center",
    lg: "w-12 h-12 p-0 text-base rounded-xl min-h-0 shrink-0 justify-center",
  };

  // Size configurations
  const sizeClasses = {
    sm: "px-2 py-1 text-sm min-h-[32px] rounded-md",
    md: "px-3 py-2 text-base min-h-[40px] sm:min-h-[44px] rounded-md", // thumb-friendly size
    lg: "px-4 py-3 text-lg min-h-[48px] sm:min-h-[52px] rounded-lg",
  };

  const countSizes = {
    sm: "min-w-[16px] h-4 text-[10px] px-1",
    md: "min-w-[20px] h-5 text-xs px-1.5",
    lg: "min-w-[22px] h-[22px] text-xs px-2"
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center gap-2 font-semibold cursor-pointer transition-all duration-200 select-none border overflow-hidden focus-visible:ring-3 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed active:scale-95",
        stateStyles[state],
        iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        className
      )}
      onClick={handleDownload}
      disabled={state === 'downloading'}
      aria-label={`Baixar vídeo ${fileName}`}
    >
      <span className="flex items-center justify-center leading-none flex-shrink-0">{getIcon()}</span>
      
      {!iconOnly && (
        <span className="flex items-center gap-1.5 z-10">
          <span className="whitespace-nowrap">{getLabel()}</span>
          {count > 0 && (
            <span className={cn(
              "inline-flex items-center justify-center rounded-full bg-primary-500 text-white font-bold",
              countSizes[size]
            )}>
              {count}
            </span>
          )}
        </span>
      )}

      {state === 'downloading' && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary-100 dark:bg-primary-900 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-250 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
};

export default DownloadButton;
