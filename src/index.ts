// Export utils
export { cn } from './utils/cn';
export { cleanCpf, formatCpf, isValidCpf } from './utils/cpfValidator';
export { getImageDimensions, lerDimensoesImagem, type ImageDimensions } from './utils/image';

// Export atomic components
export { Button, type ButtonProps } from './components/Button';
export { CopyButton, type CopyButtonProps } from './components/CopyButton';
export { Input, type InputProps } from './components/Input';
export { Select, type SelectProps, type SelectOption } from './components/Select';
export { Textarea, type TextareaProps } from './components/Textarea';
export { Checkbox, type CheckboxProps } from './components/Checkbox';
export { Switch, type SwitchProps } from './components/Switch';
export { Badge, type BadgeProps } from './components/Badge';
export { Skeleton, type SkeletonProps } from './components/Skeleton';
export { IconButton, type IconButtonProps, type IconButtonVariant, type IconButtonSize } from './components/IconButton';

// Export molecular & structural components
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardDescriptionProps,
  type CardContentProps,
  type CardFooterProps,
} from './components/Card';
export {
  AppShell,
  AppHeader,
  AppSidebar,
  type AppShellProps,
  type AppHeaderProps,
  type AppSidebarProps,
} from './components/AppShell';
export { StatCard, type StatCardProps } from './components/StatCard';
export { Alert, type AlertProps } from './components/Alert';
export {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  type TableContainerProps,
  type TableProps,
} from './components/Table';
export { FilterBar, type FilterBarProps } from './components/FilterBar';
export { PageHeader, type PageHeaderProps } from './components/PageHeader';
export { Loading, type LoadingProps } from './components/Loading';
export { Modal, type ModalProps } from './components/Modal';
export { ConfirmDialog, type ConfirmDialogProps } from './components/ConfirmDialog';
export { EmptyState, type EmptyStateProps } from './components/EmptyState';
export { SearchBar, type SearchBarProps } from './components/SearchBar';
export { DatePicker, type DatePickerProps } from './components/DatePicker';
export { DateSelector, type DateSelectorProps } from './components/DateSelector';
export { DateSeparator, type DateSeparatorProps } from './components/DateSeparator';
export { Tabs, type TabsProps, type TabItem } from './components/Tabs';
export { SegmentedControl, type SegmentedControlProps, type SegmentedControlOption } from './components/SegmentedControl';
export { HeroBanner, type HeroBannerProps, type HeroAction } from './components/HeroBanner';
export { BannerCTA, type BannerCTAProps } from './components/BannerCTA';
export { StepCards, type StepCardsProps, type StepItem } from './components/StepCards';
export { CourtSelector, type CourtSelectorProps, type CourtItem } from './components/CourtSelector';
export { Pagination, type PaginationProps } from './components/Pagination';

// Export domain components
export { VideoPreviewModal, type VideoPreviewModalProps, type VideoPreviewItem } from './components/VideoPreviewModal';
export { HighlightVideoCard, type HighlightVideoCardProps, type HighlightVideoData } from './components/HighlightVideoCard';
export { VideoCard, type VideoCardProps, type VideoData } from './components/VideoCard';
export { ArenaCard, type ArenaCardProps, type ArenaData } from './components/ArenaCard';
export { ArenaPosterCard, type ArenaPosterCardProps } from './components/ArenaPosterCard';
export { ArenaProfileHeader, type ArenaProfileHeaderProps } from './components/ArenaProfileHeader';
export { SponsorCarousel, type SponsorCarouselProps, type SponsorItem } from './components/SponsorCarousel';
export { LikeButton, type LikeButtonProps } from './components/LikeButton';
export { DownloadButton, type DownloadButtonProps } from './components/DownloadButton';
export { Logo, type LogoProps } from './components/Logo';
export { ShareLinkModal, type ShareLinkModalProps } from './components/ShareLinkModal';

// Export styles
import './styles/theme.css';
