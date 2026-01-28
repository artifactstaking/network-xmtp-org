import React from 'react';
import { useBreakpoint } from '@/hooks/ui/useBreakpoint';
import { cn } from '@/utils/cn';

type AlertType = 'error' | 'warning' | 'info' | 'success';

interface AlertContainerProps {
  children: React.ReactNode;
  type?: AlertType;
  className?: string;
}

const alertTypeStyles: Record<AlertType, string> = {
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
};

export const AlertContainer: React.FC<AlertContainerProps> = ({
  children,
  type = 'info',
  className,
}) => {
  const { isMobile, isTablet } = useBreakpoint();

  const sizeClassName = isMobile
    ? 'w-[calc(100vw-80px)] mx-auto max-w-[420px]'
    : isTablet
      ? 'w-[calc(100vw-160px)] mx-auto max-w-[496px]'
      : 'max-w-[496px]';

  const alertStyles = cn(
    'border rounded-md p-3 text-sm',
    alertTypeStyles[type],
    sizeClassName,
    className
  );

  return <div className={alertStyles}>{children}</div>;
};

export default AlertContainer;
