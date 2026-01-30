import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-red-500 text-white hover:bg-red-600',
        white:
          'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
        secondary:
          'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700',
        ghost: 'text-zinc-400 bg-transparent hover:bg-zinc-800 hover:text-zinc-200',
        link: 'text-zinc-400 bg-transparent border-none shadow-none p-0 m-0 font-normal hover:underline hover:text-zinc-200 focus-visible:outline-none',
        alternate:
          'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
      },
      size: {
        default: '',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

// Spinner Variants
export const spinnerVariants = cva(
  'animate-spin rounded-full border-current border-t-transparent',
  {
    variants: {
      variant: {
        default: 'border-zinc-400',
        primary: 'border-red-500',
        secondary: 'border-zinc-600',
        logo: 'border-red-500',
      },
      size: {
        sm: 'h-6 w-6 border-2',
        md: 'h-8 w-8 border-[3px]',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-[5px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Badge Variants
export const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-zinc-800 text-zinc-200',
        secondary: 'bg-zinc-700 text-zinc-300',
        destructive: 'bg-red-500/20 text-red-400',
        outline: 'border border-zinc-700 text-zinc-300',
        link: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
        complete: 'bg-emerald-500/20 text-emerald-400',
        processing: 'bg-amber-500/20 text-amber-400',
        finalize: 'bg-zinc-700 text-zinc-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-zinc-800 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-zinc-700 bg-transparent hover:bg-zinc-800 hover:text-zinc-200',
      },
      size: {
        default: 'h-10 px-3 min-w-10',
        sm: 'h-9 px-2.5 min-w-9',
        lg: 'h-11 px-5 min-w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const sheetVariants = cva(
  'fixed z-50 gap-4 bg-zinc-900 p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b border-zinc-800 data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t border-zinc-800 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r border-zinc-800 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l border-zinc-800 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-zinc-800 hover:text-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-500 active:bg-zinc-800 active:text-zinc-200 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-zinc-800 data-[active=true]:font-medium data-[active=true]:text-zinc-100 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-zinc-800 hover:text-zinc-200',
        outline: 'bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
