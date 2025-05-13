// src/components/ui/TooltipInfo.tsx
import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';

interface TooltipInfoProps {
  children: React.ReactNode;
  id: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const TooltipInfo: React.FC<TooltipInfoProps> = ({ 
  children, 
  id, 
  side = 'top' 
}) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={300}>
        <RadixTooltip.Trigger asChild>
          <span 
            className="inline-flex items-center justify-center ml-1.5 w-5 h-5 bg-[var(--primary-color)] text-white rounded-full text-center leading-5 text-sm font-bold cursor-help transition-colors hover:bg-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] focus:ring-offset-2"
            tabIndex={0}
            aria-label="More information"
            role="button"
            aria-describedby={id}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
          >
            ?
          </span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            id={id}
            className="bg-[var(--primary-color)] text-white text-left rounded-md p-4 max-w-xs z-50 text-sm font-normal shadow-md border border-[var(--secondary-color)]"
            sideOffset={5}
            side={side}
            role="tooltip"
            aria-live="polite"
          >
            <div className="leading-relaxed">{children}</div>
            <RadixTooltip.Arrow className="fill-[var(--primary-color)]" width={10} height={5} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default TooltipInfo;