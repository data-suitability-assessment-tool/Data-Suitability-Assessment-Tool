// src/components/ui/TooltipInfo.tsx
import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';

interface TooltipInfoProps {
  children: React.ReactNode;
  id: string;
}

const TooltipInfo: React.FC<TooltipInfoProps> = ({ children, id }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={300}>
        <RadixTooltip.Trigger asChild>
          <span 
            className="inline-block ml-1.5 w-5 h-5 bg-primary text-white rounded-full text-center leading-5 text-sm font-bold cursor-help"
            tabIndex={0}
            aria-label="More information"
            role="button"
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
            className="bg-[#555] text-white text-left rounded-md p-2.5 max-w-xs z-50 text-sm font-normal"
            sideOffset={5}
            role="tooltip"
            aria-live="polite"
          >
            {children}
            <RadixTooltip.Arrow className="fill-[#555]" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default TooltipInfo;