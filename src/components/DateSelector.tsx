import { useState } from 'react';
import { Calendar, X, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

type DatePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';

export interface DateSelectorProps {
  /** Callback quando a data é selecionada */
  onDateChange: (startDate: string | null, endDate: string | null) => void;
  /** Data inicial selecionada (formato YYYY-MM-DD) */
  initialStartDate?: string;
  /** Data final selecionada (formato YYYY-MM-DD) */
  initialEndDate?: string;
  /** Se true, permite seleção de range de datas */
  allowRange?: boolean;
  /** Placeholder para o input de data */
  placeholder?: string;
}

export const DateSelector = ({
  onDateChange,
  initialStartDate,
  initialEndDate,
  allowRange = true,
  placeholder = 'Selecionar data',
}: DateSelectorProps): JSX.Element => {
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');
  const [selectedPreset, setSelectedPreset] = useState<DatePreset | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const getToday = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  const getYesterday = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const getDaysAgo = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const handlePresetClick = (preset: DatePreset): void => {
    setSelectedPreset(preset);

    switch (preset) {
      case 'today':
        setStartDate(getToday());
        setEndDate(getToday());
        onDateChange(getToday(), getToday());
        break;
      case 'yesterday':
        setStartDate(getYesterday());
        setEndDate(getYesterday());
        onDateChange(getYesterday(), getYesterday());
        break;
      case 'last7days':
        setStartDate(getDaysAgo(7));
        setEndDate(getToday());
        onDateChange(getDaysAgo(7), getToday());
        break;
      case 'last30days':
        setStartDate(getDaysAgo(30));
        setEndDate(getToday());
        onDateChange(getDaysAgo(30), getToday());
        break;
      case 'custom':
        setSelectedPreset('custom');
        break;
    }

    if (preset !== 'custom') {
      setIsOpen(false);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newDate = e.target.value;
    setStartDate(newDate);
    setSelectedPreset('custom');
    onDateChange(newDate, allowRange ? endDate : null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newDate = e.target.value;
    setEndDate(newDate);
    setSelectedPreset('custom');
    onDateChange(startDate, newDate);
  };

  const handleClear = (): void => {
    setStartDate('');
    setEndDate('');
    setSelectedPreset(null);
    onDateChange(null, null);
  };

  const getDisplayText = (): string => {
    if (!startDate) return placeholder;

    if (selectedPreset && selectedPreset !== 'custom') {
      const presetLabels = {
        today: 'Hoje',
        yesterday: 'Ontem',
        last7days: 'Últimos 7 dias',
        last30days: 'Últimos 30 dias',
        custom: 'Personalizado',
      };
      return presetLabels[selectedPreset];
    }

    if (allowRange && endDate && startDate !== endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    return formatDate(startDate);
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <button
        type="button"
        className={cn(
          "w-full sm:w-auto min-w-[200px] h-11 sm:h-12 px-4 flex items-center gap-2.5 bg-white dark:bg-dark-surface border-2 border-gray-300 dark:border-dark-border rounded-xl font-sans font-medium text-base text-gray-700 dark:text-dark-text cursor-pointer transition-all duration-200 outline-none select-none hover:border-gray-400 dark:hover:border-dark-border/80 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-primary-300",
          isOpen && "border-primary-500 ring-3 ring-primary-100 dark:ring-primary-900/30"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar data"
        aria-expanded={isOpen}
      >
        <Calendar className="w-5 h-5 text-gray-400 dark:text-dark-text-muted flex-shrink-0" />
        <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">{getDisplayText()}</span>
        
        {(startDate || endDate) ? (
          <button
            type="button"
            className="flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-dark-surface-light border-none rounded-full text-[10px] text-gray-600 dark:text-dark-text-muted transition-all duration-150 flex-shrink-0 hover:bg-gray-300 dark:hover:bg-dark-surface hover:scale-105 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            aria-label="Limpar seleção"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-dark-text-muted flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay to close on mobile background click */}
          <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setIsOpen(false)} />
          
          <div className={cn(
            "absolute top-[calc(100%+8px)] left-0 sm:left-auto z-50 min-w-[280px] bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-2xl shadow-xl animate-slideUp sm:animate-slideDown",
            "w-[calc(100vw-32px)] max-w-[340px] left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0" // mobile centering
          )}>
            <div className="flex flex-col gap-1 p-3">
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left font-sans text-sm font-medium text-gray-700 dark:text-dark-text rounded-xl border-none bg-transparent cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-dark-surface-light min-h-[40px]",
                  selectedPreset === 'today' && "bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-semibold"
                )}
                onClick={() => handlePresetClick('today')}
              >
                Hoje
              </button>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left font-sans text-sm font-medium text-gray-700 dark:text-dark-text rounded-xl border-none bg-transparent cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-dark-surface-light min-h-[40px]",
                  selectedPreset === 'yesterday' && "bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-semibold"
                )}
                onClick={() => handlePresetClick('yesterday')}
              >
                Ontem
              </button>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left font-sans text-sm font-medium text-gray-700 dark:text-dark-text rounded-xl border-none bg-transparent cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-dark-surface-light min-h-[40px]",
                  selectedPreset === 'last7days' && "bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-semibold"
                )}
                onClick={() => handlePresetClick('last7days')}
              >
                Últimos 7 dias
              </button>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left font-sans text-sm font-medium text-gray-700 dark:text-dark-text rounded-xl border-none bg-transparent cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-dark-surface-light min-h-[40px]",
                  selectedPreset === 'last30days' && "bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-semibold"
                )}
                onClick={() => handlePresetClick('last30days')}
              >
                Últimos 30 dias
              </button>
            </div>

            <div className="h-[1px] mx-3 my-1 bg-gray-200 dark:bg-dark-border" />

            <div className="flex flex-col gap-3.5 p-4 bg-gray-50/50 dark:bg-dark-bg/20 rounded-b-2xl">
              <label className="flex flex-col gap-1.5 font-sans text-xs font-semibold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">
                Data inicial
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-lg font-sans text-sm text-gray-900 dark:text-dark-text cursor-pointer outline-none transition-colors hover:border-gray-400 focus:border-primary-500"
                  value={startDate}
                  onChange={handleStartDateChange}
                  max={getToday()}
                />
              </label>

              {allowRange && (
                <label className="flex flex-col gap-1.5 font-sans text-xs font-semibold text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">
                  Data final
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border rounded-lg font-sans text-sm text-gray-900 dark:text-dark-text cursor-pointer outline-none transition-colors hover:border-gray-400 focus:border-primary-500"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={startDate}
                    max={getToday()}
                  />
                </label>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateSelector;
