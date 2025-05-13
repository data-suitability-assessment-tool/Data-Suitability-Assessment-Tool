// src/components/ui/ResultCard.tsx
import React from 'react';

interface ResultCardProps {
  result: 'pass' | 'fail' | 'warning' | null;
  children: React.ReactNode;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, children, className = '' }) => {
  const getResultClass = () => {
    switch (result) {
      case 'pass':
        return 'bg-[var(--success-color)] text-white';
      case 'fail':
        return 'bg-[var(--error-color)] text-white';
      case 'warning':
        return 'bg-[var(--warning-color)] text-white';
      default:
        return '';
    }
  };
  
  return (
    <div className={`p-4 rounded font-bold mt-5 text-center ${getResultClass()} ${className}`}>
      {children}
    </div>
  );
};

export default ResultCard;