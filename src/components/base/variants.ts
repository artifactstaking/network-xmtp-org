import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex justify-center items-center gap-2.5 px-4 py-2.5 rounded-lg font-bold text-sm font-inter bg-red-500 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-white hover:bg-accent/80 data-[disabled]:bg-stone-300 data-[disabled]:text-white data-[disabled]:rounded-lg data-[disabled]:font-bold data-[disabled]:font-inter',
        white:
          'bg-white rounded outline outline-1 outline-offset-[-1px] outline-neutral-200 text-black',
        secondary:
          'bg-white rounded-lg border border-[hsl(var(--border))] text-black hover:bg-neutral-100 inline-flex justify-center items-center gap-2.5 px-4 py-2.5 font-bold text-sm font-inter data-[disabled]:bg-stone-300 data-[disabled]:text-white data-[disabled]:rounded-lg data-[disabled]:font-bold data-[disabled]:font-inter',
        ghost: 'text-black bg-transparent',
        link: 'text-black bg-transparent border-none shadow-none p-0 m-0 font-normal normal-case hover:underline hover:text-[color:hsl(var(--accent-xmtp))] focus-visible:outline-none',
        alternate:
          'bg-neutral-200 rounded-lg text-black hover:bg-neutral-300 inline-flex justify-center items-center gap-2.5 px-4 py-2.5 font-bold text-sm font-inter data-[disabled]:bg-stone-300 data-[disabled]:text-white data-[disabled]:rounded-lg data-[disabled]:font-bold data-[disabled]:font-inter',
      },
      size: {
        default: '',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
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
        default: 'border-accent',
        primary: 'border-primary',
        secondary: 'border-secondary',
        logo: 'border-accent',
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
  'inline-flex items-center rounded-lg outline outline-1 outline-offset-[-1px] px-2.5 py-2 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-gray-300 bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        link: 'bg-white text-black hover:bg-neutral-100',
        // transaction status variants
        complete:
          'inline-flex items-center justify-center rounded-md border py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-visible [a&]:hover:bg-accent [a&]:hover:text-accent-foreground text-muted-foreground px-1.5 hover:bg-stone-100',
        processing:
          'inline-flex items-center justify-center rounded-md border py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-visible [a&]:hover:bg-accent [a&]:hover:text-accent-foreground text-muted-foreground px-1.5 hover:bg-stone-100',
        finalize:
          'inline-flex items-center justify-center rounded-md border py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-visible [a&]:hover:bg-accent [a&]:hover:text-accent-foreground text-muted-foreground px-1.5 hover:bg-stone-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
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
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
