'use client';
import React from 'react';
import StepNavigation from '@/components/StepNavigation';
import { NetworkConfigProvider } from '@/contexts/networkConfigContext';
import { usePathname } from 'next/navigation';

export default function CongigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Only show step navigation when in form steps, not on the list page
  const isFormStep = pathname.includes('/project-info') ||
    pathname.includes('/kind-info') ||
    pathname.includes('/relationship-info') ||
    pathname.includes('/review');

  return (
    <div className="w-full px-2 lg:px-0">
      <div className="mt-6 mb-12 flex flex-col gap-x-2 text-foreground lg:flex-row">
        {isFormStep && <StepNavigation />}
        <NetworkConfigProvider>
          <div className="w-full">{children}</div>
        </NetworkConfigProvider>
      </div>
    </div>
  );
}
