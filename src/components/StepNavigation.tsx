'use client';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ConfigRoutes } from '@/types';

const steps = [
  { title: 'Project Info', route: 'project-info', link: ConfigRoutes.PROJECT_INFO },
  { title: 'Kind Info', route: 'kind-info', link: ConfigRoutes.KIND_INFO },
  { title: 'Relationship Info', route: 'relationship-info', link: ConfigRoutes.RELATIONSHIP_INFO },
  { title: 'Review', route: 'review', link: ConfigRoutes.REVIEW_CONFIG },
];

export default function StepNavigation() {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepIndex = steps.findIndex((step) => step.route === currentPath);
    setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
  }, [currentPath]);

  return (
    <div className="mb-10 mt-4 min-w-60">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="lg"
        asChild
        className="mb-8 gap-2 text-muted-foreground hover:text-foreground ml-6"
      >
        <Link href={steps[currentStep - 1]?.link || steps[0].link}>
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>
      </Button>

      {/* Timeline */}
      <div className="relative flex flex-row justify-between lg:flex-col lg:gap-10 pl-1 lg:pl-6">

        {/* Vertical Line (Desktop) */}
        <div className="absolute left-[35px] top-0 bottom-0 w-[2px] bg-muted-foreground/20 hidden lg:block" />

        {/* Horizontal Line (Mobile) */}
        <div className="absolute top-[11px] left-0 right-0 h-[2px] bg-muted-foreground/20 lg:hidden" />

        {steps.map((step, i) => {
          const isActive = currentPath === step.route;
          const isCompleted = i < currentStep;

          return (
            <Link
              href={step.link}
              key={step.link}
              className="group flex flex-col items-center lg:flex-row lg:items-center gap-2 lg:gap-4 relative z-10 text-center lg:text-left"
            >
              <div
                className={cn(
                  'flex items-center justify-center rounded-full border h-6 w-6 lg:h-6 lg:w-6 text-xs transition-all duration-200',
                  'bg-background shadow-sm',
                  isActive && 'border-primary bg-primary text-primary-foreground shadow-md scale-105',
                  isCompleted && 'border-primary bg-primary text-primary-foreground',
                  !isActive && !isCompleted && 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {i + 1}
              </div>


              {/* Labels */}
              <div className="flex flex-col">
                {/* Title — moves below on mobile */}
                <span
                  className={cn(
                    'text-xs lg:text-sm font-medium transition-colors',
                    isActive && 'text-foreground',
                    isCompleted && 'text-primary',
                    !isActive && !isCompleted && 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
