import { useEffect, useState } from 'react';
import { BREAKPOINTS, BreakpointKey } from '@/config/breakpoints';

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  currentBreakpoint: BreakpointKey | null;
}

/**
 * React hook to determine the current viewport breakpoint using `window.innerWidth` for simplicity and testability.
 *
 * @returns Object with boolean flags for different breakpoints and the current breakpoint name:
 *   - isMobile: width <= 575px
 *   - isTablet: 576px <= width <= 767px
 *   - isDesktop: 768px <= width <= 1199px
 *   - isLargeDesktop: width >= 1200px
 *   - currentBreakpoint: 'mobile' | 'tablet' | 'desktop' | 'largeDesktop' | null
 *
 * The hook listens to the `resize` event and recalculates the breakpoints whenever the window width changes.
 * It uses `window.innerWidth` to determine the current viewport size, making it easier to mock in tests.
 *
 * @example Conditionally rendering components based on the current breakpoint
 * const { currentBreakpoint } = useBreakpoint();
 *
 * return (
 *   <div>
 *     {currentBreakpoint === 'mobile' && <MobileComponent />}
 *     {currentBreakpoint === 'tablet' && <TabletComponent />}
 *     {currentBreakpoint === 'desktop' && <DesktopComponent />}
 *     {currentBreakpoint === 'largeDesktop' && <LargeDesktopComponent />}
 *   </div>
 * );
 *
 * @example Applying multiple styles dynamically based on the current breakpoint
 * const { currentBreakpoint } = useBreakpoint();
 *
 * const styles = {
 *   mobile: { fontSize: '12px', padding: '8px' },
 *   tablet: { fontSize: '14px', padding: '12px' },
 *   desktop: { fontSize: '16px', padding: '16px' },
 *   largeDesktop: { fontSize: '18px', padding: '20px' },
 * };
 *
 * return (
 *   <div style={styles[currentBreakpoint || 'desktop']}>
 *     <p>This text is styled dynamically based on the current breakpoint.</p>
 *   </div>
 * );
 */

export function useBreakpoint(): Breakpoints {
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    currentBreakpoint: null,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);

    const tabletQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`
    );

    const desktopQuery = window.matchMedia(
      `(min-width: ${BREAKPOINTS.desktop}px) and (max-width: ${BREAKPOINTS.largeDesktop - 1}px)`
    );

    const largeDesktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.largeDesktop}px)`);

    const isMobile = mobileQuery.matches;
    const isTablet = tabletQuery.matches;
    const isDesktop = desktopQuery.matches;
    const isLargeDesktop = largeDesktopQuery.matches;

    const currentBreakpoint: BreakpointKey | null = isMobile
      ? 'mobile'
      : isTablet
        ? 'tablet'
        : isDesktop
          ? 'desktop'
          : isLargeDesktop
            ? 'largeDesktop'
            : null;

    setBreakpoints({
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
      currentBreakpoint,
    });
  }, [windowWidth]);

  return breakpoints;
}
