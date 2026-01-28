/**
 * Responsive page container for consistent layout across pages.
 * Applies breakpoint-based minHeight, padding, and gap.
 * Renders as a <main> element for semantic structure.
 *
 * @param children - Content to render inside the container
 * @param className - Additional classes for customization
 * @param center - Whether to center children vertically (default: false)
 *
 * Note: For complex horizontal layouts (e.g., side-by-side components),
 * handle layout inside child components. PageContainer only manages vertical stacking and spacing.
 */
import { ReactNode } from 'react';
import { useBreakpoint } from '@/hooks/ui/useBreakpoint';
import { BREAKPOINTS } from '@/config/breakpoints';

export interface PageContainerProps {
  /** Content to render inside the container */
  children: ReactNode;

  /** Additional classes for customization */
  className?: string;

  /** Whether to center children vertically */
  center?: boolean;
}

export function PageContainer({
  children,
  className = '',
  center = false,
}: PageContainerProps): React.ReactElement {
  const { currentBreakpoint } = useBreakpoint();

  let containerMaxWidth = '';
  let containerMinHeight = '';
  let containerPaddingX = '';
  let containerPaddingY = '';
  let containerGap = '';

  if (currentBreakpoint === 'mobile') {
    containerMaxWidth = 'max-w-full';
    containerMinHeight = `min-h-[${BREAKPOINTS.mobile}px]`;
    containerPaddingX = 'px-4';
    containerPaddingY = 'pt-4 pb-6';
    containerGap = 'gap-8';
  } else if (currentBreakpoint === 'tablet') {
    containerMaxWidth = 'max-w-full';
    containerMinHeight = `min-h-[${BREAKPOINTS.tablet}px]`;
    containerPaddingX = 'px-4';
    containerPaddingY = 'pt-6 pb-8';
    containerGap = 'gap-10';
  } else if (currentBreakpoint === 'desktop' || currentBreakpoint === 'largeDesktop') {
    containerMaxWidth = '';
    containerMinHeight = `min-h-[${BREAKPOINTS.desktop}px]`;
    containerPaddingX = 'px-[60px]';
    containerPaddingY = 'pt-8 pb-10';
    containerGap = 'gap-12';
  }

  const centerClasses = center ? 'justify-center' : '';

  return (
    <main
      className={`w-full ${containerMaxWidth} ${containerMinHeight} ${containerPaddingX} ${containerPaddingY} rounded-lg flex flex-col ${centerClasses} ${containerGap} mx-auto ${className}`.trim()}
    >
      {children}
    </main>
  );
}
