import { useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  ExternalLink,
  Share2,
  Download,
  Sparkles,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CopyButton } from './CopyButton';
import { Button } from './Button';
import { cn } from '../utils/cn';

export interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  badgeText?: string;
  subtitle?: string;
  entityName: string;
  url: string;
  qrCodeFileName?: string;
  whatsAppMessage?: string;
  className?: string;
}

export function ShareLinkModal({
  isOpen,
  onClose,
  title = 'Auto-Cadastro do Aluno',
  badgeText = 'Público',
  subtitle = 'Divulgue na recepção, redes sociais e WhatsApp',
  entityName,
  url,
  qrCodeFileName,
  whatsAppMessage,
  className,
}: ShareLinkModalProps) {
  const qrContainerRef = useRef<HTMLDivElement>(null);

  // Fecha modal com Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShareWhatsApp = () => {
    const defaultMsg = `Olá! Faça seu cadastro rápido na *${entityName}* através do link oficial:\n👉 ${url}`;
    const text = encodeURIComponent(whatsAppMessage || defaultMsg);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDownloadSvg = () => {
    const svg = qrContainerRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    const filename = qrCodeFileName || `qrcode-${entityName.toLowerCase().replace(/\s+/g, '-')}.svg`;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={cn(
          'bg-white dark:bg-dark-surface rounded-3xl shadow-2xl border border-gray-150 dark:border-dark-border w-full max-w-lg overflow-hidden flex flex-col',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface-light/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-dark-text flex items-center gap-1.5">
                {title}
                {badgeText && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    {badgeText}
                  </span>
                )}
              </h2>
              {subtitle && (
                <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-surface-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Card com QR Code */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-gray-50 to-purple-50/40 dark:from-dark-surface-light dark:to-dark-surface border border-gray-150 dark:border-dark-border flex flex-col items-center text-center space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                <Sparkles className="w-3.5 h-3.5" /> Escaneie para se cadastrar
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-dark-text">
                {entityName}
              </h3>
            </div>

            {/* QR Code Container */}
            <div
              ref={qrContainerRef}
              className="p-4 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center"
            >
              <QRCodeSVG
                value={url}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-dark-text-muted max-w-xs leading-relaxed">
              Aponte a câmera do celular para abrir a página de cadastro rápido e seguro.
            </p>
          </div>

          {/* Link Copiável */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-dark-text-muted">
              Link Direto
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50/70 dark:bg-dark-surface-light text-xs font-mono text-gray-700 dark:text-dark-text truncate select-all">
                {url}
              </div>
              <CopyButton text={url} variant="outline" label="Copiar" />
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-600 dark:text-dark-text transition-colors"
                title="Testar Link em nova aba"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Ações de Compartilhamento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" /> Compartilhar no WhatsApp
            </button>

            <Button
              type="button"
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownloadSvg}
              className="py-3 px-4 rounded-2xl font-bold text-xs"
            >
              Baixar QR Code (SVG)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareLinkModal;
