// Breakpoint values for responsive design
export const BREAKPOINTS = {
  mobile: 576,
  tablet: 768,
  desktop: 992,
  largeDesktop: 1200,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

// For tailwind.config.js
export const tailwindScreens = Object.entries(BREAKPOINTS).reduce(
  (screens, [key, value]) => ({
    ...screens,
    [key]: `${value}px`,
  }),
  {}
);
