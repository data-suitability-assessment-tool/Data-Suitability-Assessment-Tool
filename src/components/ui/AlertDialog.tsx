// src/components/ui/AlertDialogComponent.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialogRoot,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction
} from './Dialog';
import { Button } from './Button';

interface AlertDialogComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const AlertDialogComponent: React.FC<AlertDialogComponentProps> = ({
  open,
  onClose,
  title,
  message
}) => {
  const { t } = useTranslation();
  
  const dialogTitle = title || t('alerts.title');
  const titleId = React.useId();
  const descriptionId = React.useId();
  
  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [open, onClose]);
  
  return (
    <AlertDialogRoot open={open} onOpenChange={onClose}>
      <AlertDialogContent
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <AlertDialogHeader>
          <AlertDialogTitle id={titleId}>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription id={descriptionId}>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={onClose} autoFocus>{t('alerts.ok')}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
};

export default AlertDialogComponent;