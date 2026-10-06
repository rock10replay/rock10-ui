import { useState, useRef, ChangeEvent, ReactNode } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export type ImageUploadSize = 'sm' | 'md' | 'lg';

export interface ImageUploadInputProps {
  /** URL ou caminho da imagem atual */
  value: string;
  /** Callback acionado ao alterar o valor textual ou após o upload */
  onChange: (value: string) => void;
  /** Função assíncrona para envio do arquivo via API/Storage */
  onUpload?: (file: File) => Promise<string | { url?: string; filename?: string }>;
  /** Callback acionado caso ocorra erro no upload */
  onError?: (errorMessage: string) => void;
  /** Rótulo superior do campo */
  label?: string;
  /** Texto de placeholder do input de URL */
  placeholder?: string;
  /** Texto de ajuda explicativo */
  helperText?: string;
  /** Mensagem de erro de validação */
  error?: string;
  /** Formatos de arquivo aceitos */
  accept?: string;
  /** Texto padrão do botão de upload */
  uploadButtonText?: string;
  /** Texto exibido enquanto o upload está em andamento */
  uploadingText?: string;
  /** Ícone ou elemento fallback exibido na caixa de preview quando vazio */
  fallbackIcon?: ReactNode;
  /** Ajuste da imagem no thumbnail de preview */
  previewFit?: 'cover' | 'contain';
  /** Desabilitar interações */
  disabled?: boolean;
  /** Permitir limpar a imagem atual */
  clearable?: boolean;
  /** Tamanho do componente */
  inputSize?: ImageUploadSize;
  /** Ocupar largura total */
  fullWidth?: boolean;
  /** Classes CSS adicionais para o container */
  containerClassName?: string;
  /** Classes CSS para o input de texto */
  className?: string;
}

const heightClasses: Record<ImageUploadSize, string> = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
};

const thumbSizes: Record<ImageUploadSize, string> = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-12 h-12 rounded-xl',
};

export function ImageUploadInput({
  value,
  onChange,
  onUpload,
  onError,
  label,
  placeholder = 'https://... ou faça upload ao lado',
  helperText,
  error: customError,
  accept = '.jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml',
  uploadButtonText = 'Upload',
  uploadingText = 'Enviando...',
  fallbackIcon,
  previewFit = 'cover',
  disabled = false,
  clearable = true,
  inputSize = 'md',
  fullWidth = true,
  containerClassName,
  className,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayError = customError || internalError;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // Reset input to allow re-selection
    if (!file) return;

    if (!onUpload) {
      setInternalError('Nenhum manipulador de upload configurado.');
      onError?.('Nenhum manipulador de upload configurado.');
      return;
    }

    try {
      setIsUploading(true);
      setInternalError(null);
      const result = await onUpload(file);
      
      let finalUrl = '';
      if (typeof result === 'string') {
        finalUrl = result;
      } else if (result && typeof result === 'object') {
        finalUrl = result.url || result.filename || '';
      }

      if (finalUrl) {
        onChange(finalUrl);
      }
    } catch (err: any) {
      console.error('Erro no upload de imagem:', err);
      const msg = err?.message || 'Falha ao enviar a imagem. Tente novamente.';
      setInternalError(msg);
      onError?.(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    if (disabled || isUploading) return;
    onChange('');
    setInternalError(null);
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        (label || displayError || helperText) && 'gap-1.5',
        fullWidth && 'w-full',
        containerClassName
      )}
    >
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-dark-text-muted">
          {label}
        </label>
      )}

      <div className="flex gap-2.5 items-center w-full">
        {/* Input de URL Textual */}
        <div className="flex-1 relative flex items-center">
          <span className="absolute left-3.5 text-gray-400 dark:text-dark-text-muted pointer-events-none">
            <ImageIcon className="w-4 h-4" />
          </span>

          <input
            type="url"
            value={value}
            disabled={disabled || isUploading}
            onChange={(e) => {
              setInternalError(null);
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className={cn(
              'w-full pl-10 pr-9 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface font-medium text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed',
              heightClasses[inputSize],
              displayError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-300',
              className
            )}
          />

          {clearable && value && !disabled && !isUploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              title="Limpar imagem"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Botão de Upload com Input Oculto */}
        {onUpload && (
          <label
            className={cn(
              'px-3.5 flex items-center justify-center gap-1.5 font-bold text-xs rounded-xl border transition-all cursor-pointer whitespace-nowrap shadow-sm select-none',
              heightClasses[inputSize],
              'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
              (isUploading || disabled) && 'opacity-60 pointer-events-none cursor-not-allowed'
            )}
            title="Enviar arquivo de imagem"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isUploading ? uploadingText : uploadButtonText}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled || isUploading}
            />
          </label>
        )}

        {/* Preview Thumbnail Box */}
        <div
          className={cn(
            'border border-gray-200 dark:border-dark-border flex items-center justify-center overflow-hidden shrink-0 shadow-xs transition-colors',
            thumbSizes[inputSize],
            value
              ? 'bg-purple-50/50 dark:bg-dark-surface-light'
              : 'bg-gray-50 dark:bg-dark-bg text-gray-400 dark:text-dark-text-muted'
          )}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              className={cn(
                'w-full h-full',
                previewFit === 'contain' ? 'object-contain p-0.5' : 'object-cover'
              )}
              onError={(e) => {
                // Se a imagem falhar ao carregar, esconde e mostra fallback
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            fallbackIcon || <ImageIcon className="w-4 h-4" />
          )}
        </div>
      </div>

      {displayError && <span className="text-xs font-semibold text-red-500">{displayError}</span>}
      {!displayError && helperText && (
        <span className="text-xs text-gray-500 dark:text-dark-text-muted">{helperText}</span>
      )}
    </div>
  );
}

export default ImageUploadInput;
