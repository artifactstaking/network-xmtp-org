import React, { ReactNode, forwardRef } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

interface MessageTextProps extends TypographyProps {
  variant?: 'error' | 'info' | 'success' | 'warning';
}

/**
 * Heading1 - Largest heading for page titles
 * Uses Satoshi font for brand consistency with xmtp.org
 */
export const Heading1 = forwardRef<
  HTMLHeadingElement,
  TypographyProps & React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <h1
      ref={ref}
      className={`font-satoshi text-xl mobile:text-xl tablet:text-xl desktop:text-1.5xl largeDesktop:text-1.5xl font-bold ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
});

Heading1.displayName = 'Heading1';

/**
 * Heading2 - Section headings
 * Uses Satoshi font for brand consistency with xmtp.org
 */
export const Heading2 = forwardRef<
  HTMLHeadingElement,
  TypographyProps & React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={`font-satoshi text-lg mobile:text-lg tablet:text-lg desktop:text-lg largeDesktop:text-lg font-semibold ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
});

Heading2.displayName = 'Heading2';

/**
 * Heading3 - Subsection headings
 * Uses Satoshi font for brand consistency with xmtp.org
 */
export const Heading3 = forwardRef<
  HTMLHeadingElement,
  TypographyProps & React.HTMLAttributes<HTMLHeadingElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`font-satoshi text-base mobile:text-base tablet:text-base desktop:text-base largeDesktop:text-base font-medium ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});

Heading3.displayName = 'Heading3';

/**
 * Body - Standard paragraph text
 */
export const Body = forwardRef<
  HTMLParagraphElement,
  TypographyProps & React.HTMLAttributes<HTMLParagraphElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm mobile:text-xs tablet:text-sm desktop:text-sm largeDesktop:text-sm ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

Body.displayName = 'Body';

/**
 * Label - Form labels, categories, tags
 */
export const Label = forwardRef<
  HTMLSpanElement,
  TypographyProps & React.HTMLAttributes<HTMLSpanElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`text-xs mobile:text-xs tablet:text-sm desktop:text-sm largeDesktop:text-sm text-text-primary font-bold ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Label.displayName = 'Label';

/**
 * MenuItem - For menu items, same size as Label but without bold styling
 */
export const MenuItem = forwardRef<
  HTMLSpanElement,
  TypographyProps & React.HTMLAttributes<HTMLSpanElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`text-xs mobile:text-xs tablet:text-sm desktop:text-sm largeDesktop:text-sm ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

MenuItem.displayName = 'MenuItem';

/**
 * Caption - Small helper text, footnotes
 */
export const Caption = forwardRef<
  HTMLSpanElement,
  TypographyProps & React.HTMLAttributes<HTMLSpanElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={`text-xs mobile:text-xs tablet:text-xs desktop:text-xs largeDesktop:text-xs text-text-secondary ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Caption.displayName = 'Caption';

/**
 * Button text component
 */
export const ButtonText = forwardRef<
  HTMLSpanElement,
  TypographyProps & React.HTMLAttributes<HTMLSpanElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <span ref={ref} className={`text-base font-bold ${className}`} {...props}>
      {children}
    </span>
  );
});

ButtonText.displayName = 'ButtonText';

/**
 * Code - For displaying code snippets
 */
export const Code = forwardRef<HTMLElement, TypographyProps & React.HTMLAttributes<HTMLElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={`font-mono text-xs mobile:text-xs tablet:text-xs desktop:text-xs largeDesktop:text-xs bg-muted px-1.5 py-0.5 rounded ${className}`}
        {...props}
      >
        {children}
      </code>
    );
  }
);

Code.displayName = 'Code';

/**
 * Link - Styled anchor tag
 */
export const Link = forwardRef<
  HTMLAnchorElement,
  TypographyProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <a ref={ref} className={`hover:text-muted-foreground transition-colors ${className}`} {...props}>
      {children}
    </a>
  );
});

Link.displayName = 'Link';

/**
 * MessageText - For form validation, status, and other user messages
 */
export const MessageText = forwardRef<
  HTMLSpanElement,
  MessageTextProps & React.HTMLAttributes<HTMLSpanElement>
>(({ children, className = '', variant = 'error', ...props }, ref) => {
  let colorClass = 'text-accent';
  if (variant === 'info') colorClass = 'text-blue-600';
  else if (variant === 'success') colorClass = 'text-green-600';
  else if (variant === 'warning') colorClass = 'text-yellow-600';
  return (
    <span
      ref={ref}
      className={`text-xs mobile:text-xs tablet:text-xs desktop:text-xs largeDesktop:text-xs ${colorClass} ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </span>
  );
});

MessageText.displayName = 'MessageText';

/**
 * Blockquote - For testimonials and quotations
 */
export const Blockquote = forwardRef<
  HTMLQuoteElement,
  TypographyProps & React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <blockquote
      ref={ref}
      className={`pl-4 border-l-4 border-border italic text-sm mobile:text-sm tablet:text-sm desktop:text-sm largeDesktop:text-sm text-text-secondary ${className}`}
      {...props}
    >
      {children}
    </blockquote>
  );
});

Blockquote.displayName = 'Blockquote';

/**
 * ListItem - For consistent list styling
 */
export const ListItem = forwardRef<
  HTMLLIElement,
  TypographyProps & React.LiHTMLAttributes<HTMLLIElement>
>(({ children, className = '', ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={`text-xs mobile:text-xs tablet:text-sm desktop:text-sm largeDesktop:text-sm mb-1 ${className}`}
      {...props}
    >
      {children}
    </li>
  );
});

ListItem.displayName = 'ListItem';

/**
 * ScreenReaderOnly - For content only visible to screen readers
 */
export const ScreenReaderOnly = forwardRef<
  HTMLSpanElement,
  TypographyProps & React.HTMLAttributes<HTMLSpanElement>
>(({ children, ...props }, ref) => {
  return (
    <span ref={ref} className="sr-only" {...props}>
      {children}
    </span>
  );
});

ScreenReaderOnly.displayName = 'ScreenReaderOnly';
