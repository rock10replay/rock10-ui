import { X, QrCode, ExternalLink, MessageSquare, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CopyButton } from './CopyButton';
import { Button } from './Button';

export interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  documentNumber?: string | null;
  competence?: string | null;
  payerName: string;
  amount: number;
  dueDate?: string | null;
  pixPayload?: string | null;
  pixQrCode?: string | null;
  invoiceUrl?: string | null;
  whatsappPhone?: string | null;
  arenaName?: string | null;
}

export function PixPaymentModal({
  isOpen,
  onClose,
  title = 'Cobrança Pix Instantânea',
  documentNumber,
  competence,
  payerName,
  amount,
  dueDate,
  pixPayload,
  pixQrCode,
  invoiceUrl,
  whatsappPhone,
  arenaName,
}: PixPaymentModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    if (dateStr.includes('T')) {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    }
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const handleShareWhatsapp = () => {
    const rawPhone = (whatsappPhone || '').replace(/\D/g, '');
    const phoneFormatted = rawPhone.length <= 11 ? `55${rawPhone}` : rawPhone;

    let text = `Olá, *${payerName}*! 👋\n\n`;
    if (arenaName) {
      text += `Segue a cobrança da sua mensalidade na *${arenaName}*:\n`;
    } else {
      text += `Segue a cobrança da sua fatura:\n`;
    }

    if (competence) text += `📌 *Competência:* ${competence}\n`;
    if (dueDate) text += `📅 *Vencimento:* ${formatDate(dueDate)}\n`;
    text += `💰 *Valor:* ${formatCurrency(amount)}\n\n`;

    if (pixPayload) {
      text += `🔑 *Chave Pix (Copia e Cola):*\n\`\`\`${pixPayload}\`\`\`\n\n`;
    }

    if (invoiceUrl) {
      text += `🔗 *Link da Fatura / Boleto / Cartão:*\n${invoiceUrl}\n\n`;
    }

    text += `Qualquer dúvida, estamos à disposição!`;

    const url = rawPhone
      ? `https://wa.me/${phoneFormatted}?text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const isImageQrCode = pixQrCode && (pixQrCode.startsWith('data:') || pixQrCode.startsWith('http') || pixQrCode.length > 200);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-gray-150 dark:border-dark-border shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-dark-border flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-teal-600/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-dark-text">
                {title}
              </h3>
              {(documentNumber || competence) && (
                <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                  {[documentNumber && `Doc #${documentNumber}`, competence && `Comp. ${competence}`]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Card Resumo */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface-light/50 border border-gray-100 dark:border-dark-border flex items-center justify-between">
            <div className="text-left min-w-0 flex-1 pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Pagador / Titular
              </span>
              <p className="text-sm font-bold text-gray-900 dark:text-dark-text truncate">
                {payerName}
              </p>
              {dueDate && (
                <span className="text-xs text-gray-500 dark:text-dark-text-muted block mt-0.5">
                  Vencimento: {formatDate(dueDate)}
                </span>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Total a Pagar
              </span>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrency(amount)}
              </p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-200 shadow-xs max-w-[240px] mx-auto">
            {isImageQrCode ? (
              <img
                src={pixQrCode.startsWith('data:') || pixQrCode.startsWith('http') ? pixQrCode : `data:image/png;base64,${pixQrCode}`}
                alt="QR Code Pix"
                className="w-48 h-48 object-contain rounded-lg"
              />
            ) : pixPayload ? (
              <QRCodeSVG value={pixPayload} size={192} level="M" />
            ) : (
              <div className="p-6 text-center text-amber-600 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 opacity-80" />
                <p className="text-xs font-semibold">QR Code visual indisponível.</p>
              </div>
            )}
            <span className="text-[11px] font-medium text-gray-500 mt-2 text-center">
              Escaneie com o app do seu banco
            </span>
          </div>

          {/* Chave Pix Copia e Cola */}
          {pixPayload ? (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                Chave Pix Copia e Cola
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixPayload}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-gray-50 dark:bg-dark-surface-light border border-gray-200 dark:border-dark-border rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none select-all"
                />
                <CopyButton text={pixPayload} label="Copiar" />
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-surface-light text-xs text-gray-500 text-center">
              Payload Pix não disponível para cópia.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface-light/30 flex items-center justify-between gap-3">
          {invoiceUrl ? (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir Fatura Web
            </a>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={handleShareWhatsapp}
              icon={<MessageSquare className="w-3.5 h-3.5" />}
            >
              WhatsApp
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PixPaymentModal;
