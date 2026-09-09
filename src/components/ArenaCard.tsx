import { ReactNode } from 'react';
import { Warehouse, MapPin, LayoutGrid, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';
import { Badge } from './Badge';

export interface ArenaData {
  id: number;
  nome: string;
  slug?: string;
  cidade?: string;
  uf?: string;
  logo_url?: string;
  banner_url?: string;
  total_quadras?: number;
  ativo?: boolean;
}

export interface ArenaCardProps {
  arena: ArenaData;
  onClick?: (arena: ArenaData) => void;
  actionText?: string;
  extraBadge?: ReactNode;
  className?: string;
}

export function ArenaCard({
  arena,
  onClick,
  actionText = 'Ver Replays',
  extraBadge,
  className,
}: ArenaCardProps) {
  return (
    <div
      onClick={() => onClick?.(arena)}
      className={cn(
        'group bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between',
        className
      )}
    >
      <div className="space-y-4">
        {/* Topo do Card: Logo/Avatar e Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base shrink-0 overflow-hidden border border-blue-200 dark:border-blue-900/40">
            {arena.logo_url ? (
              <img src={arena.logo_url} alt={arena.nome} className="w-full h-full object-cover" />
            ) : (
              <Warehouse className="w-6 h-6" />
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {extraBadge}
            {arena.ativo !== undefined && (
              <Badge variant={arena.ativo ? 'success' : 'danger'} dot size="sm">
                {arena.ativo ? 'Ativa' : 'Inativa'}
              </Badge>
            )}
          </div>
        </div>

        {/* Informações da Arena */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-dark-text group-hover:text-primary-500 transition-colors line-clamp-1">
            {arena.nome}
          </h3>
          {(arena.cidade || arena.uf) && (
            <p className="text-xs text-gray-500 dark:text-dark-text-muted font-medium flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>
                {arena.cidade}
                {arena.cidade && arena.uf ? ' / ' : ''}
                {arena.uf}
              </span>
            </p>
          )}
        </div>

        {/* Estatística de Quadras */}
        {arena.total_quadras !== undefined && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-dark-text-muted pt-2 border-t border-gray-100 dark:border-dark-border">
            <LayoutGrid className="w-4 h-4 text-emerald-500" />
            <span>
              {arena.total_quadras} {arena.total_quadras === 1 ? 'quadra disponível' : 'quadras disponíveis'}
            </span>
          </div>
        )}
      </div>

      {/* Botão de Ação */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
        <span>{actionText}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

export default ArenaCard;
