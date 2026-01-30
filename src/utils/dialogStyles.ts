/**
 * Shared dialog styling utilities for consistent modal appearance.
 * Use these utilities across all dialog components to ensure design consistency.
 */

/**
 * Returns the appropriate container width class based on breakpoint.
 * Standard dialog width: 706px on desktop, responsive on smaller screens.
 */
export function getDialogContainerClass(isMobile: boolean, isTablet: boolean): string {
  if (isMobile) return 'w-[calc(100vw-60px)] max-w-[420px]';
  if (isTablet) return 'w-[calc(100vw-140px)] max-w-[600px]';
  return 'w-[706px]';
}

/**
 * Shared dialog style constants for consistent appearance.
 */
export const DIALOG_STYLES = {
  /** Standard padding for dialog content */
  padding: 'pt-10 pb-6 px-6 tablet:px-10',
  /** Standard gap between dialog sections */
  contentGap: 'gap-6',
  /** Standard shadow for dialogs */
  shadow: 'shadow-[0px_4px_24px_0px_rgba(0,0,0,0.08)]',
  /** Standard button row styling with top border */
  buttonRow: 'w-full pt-6 border-t border-border inline-flex justify-end items-start gap-2.5',
  /** Base dialog content classes */
  contentBase: 'bg-card rounded-lg inline-flex flex-col justify-start items-start overflow-hidden',
  /** Dialog content with scroll support */
  contentScrollable: 'max-h-[calc(95svh)] overflow-y-auto',
} as const;

/**
 * Title class for dialog headers - consistent across all dialogs.
 */
export const DIALOG_TITLE_CLASS = 'text-foreground text-xl font-satoshi font-semibold';

/**
 * Description class for dialog descriptions - consistent across all dialogs.
 */
export const DIALOG_DESCRIPTION_CLASS = 'text-muted-foreground text-base font-normal leading-normal';
