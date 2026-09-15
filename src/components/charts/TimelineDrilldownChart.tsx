import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Video,
  Eye,
  Download,
  Heart,
  Share2,
  Calendar,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export interface TimelineItem {
  key?: number;
  label: string;
  month?: number;
  day?: number;
  hour?: number;
  videos: number;
  visualizacoes: number;
  downloads: number;
  curtidas: number;
  compartilhamentos: number;
  prev_videos?: number;
  prev_visualizacoes?: number;
  prev_downloads?: number;
  prev_curtidas?: number;
  prev_compartilhamentos?: number;
  [key: string]: any;
}

export interface TimelineFetchParams {
  year: number;
  compare_year?: number;
  month?: number;
  day?: number;
}

export interface TimelineDrilldownChartProps {
  title?: string;
  titleSuffix?: string;
  onFetchData: (params: TimelineFetchParams) => Promise<TimelineItem[]>;
  initialYear?: number;
  className?: string;
}

type DrillLayer = 'months' | 'days' | 'hours';

const METRICS_CONFIG = [
  {
    key: 'videos',
    prevKey: 'prev_videos',
    name: 'Vídeos',
    color: '#8b5cf6', // Violet
    prevColor: '#c4b5fd',
    icon: Video,
  },
  {
    key: 'visualizacoes',
    prevKey: 'prev_visualizacoes',
    name: 'Visualizações',
    color: '#3b82f6', // Blue
    prevColor: '#93c5fd',
    icon: Eye,
  },
  {
    key: 'downloads',
    prevKey: 'prev_downloads',
    name: 'Downloads',
    color: '#f97316', // Orange
    prevColor: '#fdba74',
    icon: Download,
  },
  {
    key: 'curtidas',
    prevKey: 'prev_curtidas',
    name: 'Curtidas',
    color: '#ef4444', // Red
    prevColor: '#fca5a5',
    icon: Heart,
  },
  {
    key: 'compartilhamentos',
    prevKey: 'prev_compartilhamentos',
    name: 'Compartilhamentos',
    color: '#10b981', // Emerald
    prevColor: '#6ee7b7',
    icon: Share2,
  },
] as const;

export function TimelineDrilldownChart({
  title = 'Evolução Temporal & Métricas de Engajamento',
  titleSuffix,
  onFetchData,
  initialYear,
  className,
}: TimelineDrilldownChartProps) {
  const currentYear = initialYear ?? new Date().getFullYear();

  const [layer, setLayer] = useState<DrillLayer>('months');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [compareYear, setCompareYear] = useState<number>(currentYear - 1);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedMonthLabel, setSelectedMonthLabel] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDayLabel, setSelectedDayLabel] = useState<string>('');

  const [data, setData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showComparison, setShowComparison] = useState<boolean>(true);

  // Visibilidade de cada métrica
  const [visibleMetrics, setVisibleMetrics] = useState<Record<string, boolean>>({
    videos: true,
    visualizacoes: true,
    downloads: true,
    curtidas: true,
    compartilhamentos: true,
  });

  const toggleMetric = (key: string) => {
    setVisibleMetrics((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (prev[key] && activeCount === 1) return prev; // Não permite desativar todas
      return { ...prev, [key]: !prev[key] };
    });
  };

  // Reset layers if data fetcher function changes (e.g. filter by arena/group changed)
  const prevFetchDataRef = useRef(onFetchData);
  useEffect(() => {
    if (prevFetchDataRef.current !== onFetchData) {
      prevFetchDataRef.current = onFetchData;
      setLayer('months');
      setSelectedMonth(null);
      setSelectedMonthLabel('');
      setSelectedDay(null);
      setSelectedDayLabel('');
    }
  }, [onFetchData]);

  const loadTimeline = useCallback(async () => {
    try {
      setLoading(true);
      const items = await onFetchData({
        year: selectedYear,
        compare_year: showComparison ? compareYear : undefined,
        month: selectedMonth ?? undefined,
        day: selectedDay ?? undefined,
      });
      setData(items || []);
    } catch (err) {
      console.error('Erro ao carregar dados do gráfico drilldown:', err);
    } finally {
      setLoading(false);
    }
  }, [onFetchData, selectedYear, showComparison, compareYear, selectedMonth, selectedDay]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // Handlers de Drill-Down
  const handlePointClick = (entry: any) => {
    if (!entry) return;
    let payload: TimelineItem | undefined = undefined;

    if (entry.activePayload && entry.activePayload.length > 0) {
      payload = entry.activePayload[0].payload as TimelineItem;
    } else if (entry.activeTooltipIndex !== undefined && data[entry.activeTooltipIndex]) {
      payload = data[entry.activeTooltipIndex];
    } else if (entry.activeLabel !== undefined) {
      payload = data.find((d) => String(d.label) === String(entry.activeLabel));
    } else if (entry.payload) {
      payload = entry.payload as TimelineItem;
    }

    if (!payload) return;

    if (layer === 'months') {
      setSelectedMonth(payload.key ?? payload.month ?? null);
      setSelectedMonthLabel(payload.label);
      setLayer('days');
    } else if (layer === 'days') {
      setSelectedDay(payload.key ?? payload.day ?? null);
      setSelectedDayLabel(payload.label);
      setLayer('hours');
    }
  };

  const handleBackToMonths = () => {
    setSelectedMonth(null);
    setSelectedMonthLabel('');
    setSelectedDay(null);
    setSelectedDayLabel('');
    setLayer('months');
  };

  const handleBackToDays = () => {
    setSelectedDay(null);
    setSelectedDayLabel('');
    setLayer('days');
  };

  // Totais do período exibido
  const summaryTotals = useMemo(() => {
    return data.reduce(
      (acc, item) => ({
        videos: acc.videos + (item.videos || 0),
        visualizacoes: acc.visualizacoes + (item.visualizacoes || 0),
        downloads: acc.downloads + (item.downloads || 0),
        curtidas: acc.curtidas + (item.curtidas || 0),
        compartilhamentos: acc.compartilhamentos + (item.compartilhamentos || 0),
        prev_videos: acc.prev_videos + (item.prev_videos || 0),
        prev_visualizacoes: acc.prev_visualizacoes + (item.prev_visualizacoes || 0),
        prev_downloads: acc.prev_downloads + (item.prev_downloads || 0),
        prev_curtidas: acc.prev_curtidas + (item.prev_curtidas || 0),
        prev_compartilhamentos: acc.prev_compartilhamentos + (item.prev_compartilhamentos || 0),
      }),
      {
        videos: 0,
        visualizacoes: 0,
        downloads: 0,
        curtidas: 0,
        compartilhamentos: 0,
        prev_videos: 0,
        prev_visualizacoes: 0,
        prev_downloads: 0,
        prev_curtidas: 0,
        prev_compartilhamentos: 0,
      }
    );
  }, [data]);

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md p-3.5 rounded-xl border border-gray-200 dark:border-dark-border shadow-xl min-w-[200px] pointer-events-none select-none">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-dark-border/60">
            <span className="text-xs font-black uppercase text-gray-700 dark:text-dark-text tracking-wide">
              {layer === 'months' && `Mês: ${label}`}
              {layer === 'days' && `Dia: ${label}`}
              {layer === 'hours' && `Horário: ${label}`}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">
              {selectedYear}
            </span>
          </div>

          <div className="space-y-1.5">
            {payload.map((item: any, idx: number) => {
              const isPrev = item.dataKey.startsWith('prev_');
              return (
                <div key={idx} className="flex items-center justify-between gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5" style={{ color: item.color }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-dark-text-muted">
                      {item.name} {isPrev ? `(${compareYear})` : ''}
                    </span>
                  </span>
                  <span className="font-bold text-gray-900 dark:text-dark-text">
                    {Number(item.value).toLocaleString('pt-BR')}
                  </span>
                </div>
              );
            })}
          </div>

          {layer !== 'hours' && (
            <div className="mt-2.5 pt-2 border-t border-dashed border-gray-200 dark:border-dark-border/40 text-[10px] text-primary-600 dark:text-primary-400 font-medium text-center">
              💡 Clique para detalhar {layer === 'months' ? 'os dias do mês' : 'as horas do dia'}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-200 dark:border-dark-border shadow-sm space-y-5', className)}>
      {/* Header com Navegação e Controles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text">
              {title} {titleSuffix ? `— ${titleSuffix}` : ''}
            </h2>
          </div>

          {/* Breadcrumbs de Drill-Down */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-gray-500 dark:text-dark-text-muted mt-2">
            <button
              type="button"
              onClick={handleBackToMonths}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                layer === 'months'
                  ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold'
                  : 'hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-600 dark:text-dark-text'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Ano {selectedYear} (Meses)
            </button>

            {selectedMonth !== null && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <button
                  type="button"
                  onClick={handleBackToDays}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    layer === 'days'
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold'
                      : 'hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-600 dark:text-dark-text'
                  }`}
                >
                  Mês {selectedMonthLabel} (Dias)
                </button>
              </>
            )}

            {selectedDay !== null && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold">
                  Dia {selectedDayLabel} (24 Horas)
                </span>
              </>
            )}

            {layer !== 'months' && (
              <button
                type="button"
                onClick={layer === 'hours' ? handleBackToDays : handleBackToMonths}
                className="ml-2 flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-800 dark:hover:text-dark-text bg-gray-100 dark:bg-dark-surface-light px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                title="Voltar ao nível anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Voltar
              </button>
            )}
          </div>
        </div>

        {/* Filtros e Seletores de Ano */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Seletor de Ano */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-500 dark:text-dark-text-muted">Ano:</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                const yr = Number(e.target.value);
                setSelectedYear(yr);
                setCompareYear(yr - 1);
                handleBackToMonths();
              }}
              className="h-9 px-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-xs font-bold text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
            >
              {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Switch de Comparação de Ano (Disponível na Camada 1 - Meses) */}
          {layer === 'months' && (
            <button
              type="button"
              onClick={() => setShowComparison(!showComparison)}
              className={`h-9 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                showComparison
                  ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-300 dark:border-primary-800/40 text-primary-600 dark:text-primary-400'
                  : 'bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text hover:bg-gray-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Comparar {compareYear}
            </button>
          )}

          {layer !== 'months' && (
            <button
              type="button"
              onClick={handleBackToMonths}
              className="h-9 px-3 rounded-xl text-xs font-bold border border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface-light transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ver Ano Completo
            </button>
          )}
        </div>
      </div>

      {/* Badges / Legenda Interativa de Métricas */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-dark-border/40">
        <span className="text-xs font-bold text-gray-400 dark:text-dark-text-muted uppercase tracking-wider mr-1">
          Métricas:
        </span>
        {METRICS_CONFIG.map((metric) => {
          const isActive = visibleMetrics[metric.key];
          const Icon = metric.icon;
          const totalVal = summaryTotals[metric.key as keyof typeof summaryTotals] || 0;

          return (
            <button
              type="button"
              key={metric.key}
              onClick={() => toggleMetric(metric.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-dark-surface shadow-xs text-gray-900 dark:text-dark-text'
                  : 'opacity-40 bg-gray-50 dark:bg-dark-bg text-gray-400 border-dashed border-gray-300'
              }`}
              style={{
                borderColor: isActive ? metric.color : undefined,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: isActive ? metric.color : '#9ca3af' }}
              />
              <Icon className="w-3.5 h-3.5" style={{ color: isActive ? metric.color : '#9ca3af' }} />
              <span>{metric.name}</span>
              <span className="text-[11px] font-black text-gray-500 dark:text-dark-text-muted bg-gray-100 dark:bg-dark-surface-light px-1.5 py-0.5 rounded-md">
                {totalVal.toLocaleString('pt-BR')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Área do Gráfico */}
      <div className="relative w-full h-80 pt-2">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-dark-surface/70 backdrop-blur-xs z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="text-xs font-bold text-gray-500 dark:text-dark-text-muted mt-2">
              Processando camadas de métricas...
            </span>
          </div>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onClick={handlePointClick}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            style={{ cursor: layer !== 'hours' ? 'pointer' : 'default' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} wrapperStyle={{ pointerEvents: 'none' }} />

            {/* Linhas Ativas do Ano Atual / Período */}
            {METRICS_CONFIG.map((metric) => {
              if (!visibleMetrics[metric.key]) return null;

              return (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.name}
                  stroke={metric.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: metric.color, strokeWidth: 1 }}
                  activeDot={{ r: 6, fill: metric.color, stroke: '#fff', strokeWidth: 2, cursor: 'pointer' }}
                />
              );
            })}

            {/* Linhas Comparativas do Ano Anterior (Apenas na camada de Meses com comparação ativa) */}
            {layer === 'months' && showComparison && METRICS_CONFIG.map((metric) => {
              if (!visibleMetrics[metric.key]) return null;

              return (
                <Line
                  key={metric.prevKey}
                  type="monotone"
                  dataKey={metric.prevKey}
                  name={`${metric.name} (${compareYear})`}
                  stroke={metric.prevColor}
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={{ r: 2, fill: metric.prevColor }}
                  activeDot={{ r: 5, fill: metric.prevColor }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Dica de Drilldown no Rodapé */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border/40 text-xs text-gray-500 dark:text-dark-text-muted">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" />
          <span>
            {layer === 'months' && '💡 Dica: Clique em qualquer mês para abrir a visão diária.'}
            {layer === 'days' && '💡 Dica: Clique em qualquer dia para analisar a distribuição por hora.'}
            {layer === 'hours' && 'Visão detalhada por hora (00h às 23h).'}
          </span>
        </div>
        <span className="font-semibold text-gray-400 dark:text-dark-text-muted">
          Camada ativa: <strong className="text-gray-700 dark:text-dark-text uppercase">{layer === 'months' ? '1. Meses' : layer === 'days' ? '2. Dias' : '3. Horas'}</strong>
        </span>
      </div>
    </div>
  );
}

export default TimelineDrilldownChart;
