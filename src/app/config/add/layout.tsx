import React from 'react';
import StepNavigation from '@/components/StepNavigation';
import { NetworkConfigProvider } from '@/contexts/networkConfigContext';

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-2 lg:px-0">
      <div className="mt-6 mb-12 flex flex-col gap-x-2 text-foreground lg:flex-row">
        <StepNavigation />
        <NetworkConfigProvider>
          <div className="w-full">{children}</div>
        </NetworkConfigProvider>
      </div>
    </div>
  );

}
