import { X, Printer, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptNumber: string | number;
  issuerName: string;
  issuerSubtitle?: string | null;
  payerName: string;
  payerDocument?: string | null;
  amountPaid: number;
  totalAmount?: number | null;
  paymentDate?: string | null;
  paymentMethod?: string | null;
  description?: string | null;
  documentNumber?: string | null;
  competence?: string | null;
  operatorName?: string | null;
  onPrint?: () => void;
}

export function ReceiptModal({
  isOpen,
  onClose,
  receiptNumber,
  issuerName,
  issuerSubtitle,
  payerName,
  payerDocument,
  amountPaid,
  totalAmount,
  paymentDate,
  paymentMethod = 'PIX',
  description,
  documentNumber,
  competence,
  operatorName,
  onPrint,
}: ReceiptModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return new Date().toLocaleDateString('pt-BR');
    if (dateStr.includes('T')) {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    }
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  const isPartial = totalAmount != null && amountPaid < totalAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none">
        {/* Header (Oculto na Impressão) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface-light print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-dark-text">
              Visualização do Recibo de Pagamento
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Imprimir Recibo
            </Button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-light transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Documento Imprimível */}
        <div className="p-8 space-y-6 text-gray-900 bg-white" id="printable-receipt">
          {/* Cabeçalho */}
          <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight text-gray-900">
                {issuerName}
              </h1>
              {issuerSubtitle && (
                <p className="text-xs text-gray-500 font-medium mt-0.5">{issuerSubtitle}</p>
              )}
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 font-black font-mono text-sm rounded-lg border border-emerald-300">
                RECIBO #{receiptNumber}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">
                Data Emissão: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Título do Recibo */}
          <div className="text-center py-2 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900">
              {isPartial ? 'RECIBO DE PAGAMENTO PARCIAL' : 'RECIBO DE PAGAMENTO INTEGRAL'}
            </h2>
            {(documentNumber || competence) && (
              <p className="text-xs text-gray-500 mt-0.5">
                {[documentNumber && `Documento Nº ${documentNumber}`, competence && `Competência ${competence}`]
                  .filter(Boolean)
                  .join(' • ')}
              </p>
            )}
          </div>

          {/* Declaração de Pagamento */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs leading-relaxed text-gray-800">
            Recebemos de <strong className="text-gray-900">{payerName}</strong>
            {payerDocument ? ` (CPF/CNPJ: ${payerDocument})` : ''} a importância de{' '}
            <strong className="text-emerald-700 text-sm font-black">
              {formatCurrency(amountPaid)}
            </strong>
            {description ? ` referente a: ${description}` : ''}.
          </div>

          {/* Dados do Recebimento */}
          <div className="grid grid-cols-3 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-400 font-bold uppercase block text-[10px]">Data do Pagamento:</span>
              <span className="font-bold text-gray-900 mt-0.5 block">
                {formatDate(paymentDate)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase block text-[10px]">Forma de Pagamento:</span>
              <span className="font-bold text-emerald-600 mt-0.5 block">{paymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold uppercase block text-[10px]">Operador / Caixa:</span>
              <span className="font-bold text-gray-900 mt-0.5 block">{operatorName || 'Sistema'}</span>
            </div>
          </div>

          {/* Rodapé do comprovante */}
          <div className="pt-4 border-t border-gray-200 text-center">
            <span className="text-[11px] text-gray-400 font-medium">
              Comprovante emitido eletronicamente pela Plataforma Rock10
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
