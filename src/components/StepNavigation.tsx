'use client';
import { usePathname } from 'next/navigation';
import path from 'path';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { AddDealRoutes } from '@/types';

const steps = [
  {
    title: 'Step One',
    route: 'step-one',
    link: AddDealRoutes.PRODUCT_INFO,
  },
  {
    title: 'Step Two',
    route: 'step-two',
    link: AddDealRoutes.COUPON_DETAILS,
  },
  {
    title: 'Step Three',
    route: 'step-three',
    link: AddDealRoutes.CONTACT_INFO,
  },
  { 
    title: 'Review', 
    route: 'review', 
    link: AddDealRoutes.REVIEW_DEAL 
  },
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
    <div className="mb-12 mt-4 lg:mb-0 min-w-60">
      {/* back button */}
      <Button
        variant="ghost"
        size="lg"
        asChild
        className="mb-4 lg:mb-12 gap-2"
      >
        <Link href={steps[currentStep - 1]?.link || steps[0].link}>
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>
      </Button>

      {/* list of form steps */}
      <div className="relative flex flex-row justify-between lg:flex-col lg:justify-start lg:gap-8">
        {steps.map((step, i) => {
          const isActive = currentPath === step.route;
          const isCompleted = i < currentStep;
          
          return (
            <Link
              href={step.link}
              key={step.link}
              className="group z-20 flex items-center gap-3 text-2xl"
              prefetch={true}
            >
              <Badge
                variant={isActive ? "default" : "outline"}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm transition-all duration-200 lg:h-8 lg:w-8 lg:text-lg',
                  isActive && 'bg-primary text-primary-foreground hover:bg-primary',
                  !isActive && 'border-2 group-hover:border-primary group-hover:text-primary',
                  isCompleted && 'bg-primary/20 border-primary'
                )}
              >
                {i + 1}
              </Badge>
              <span
                className={cn(
                  'hidden transition-colors duration-200 lg:block',
                  isActive ? 'font-semibold text-foreground' : 'font-light text-muted-foreground',
                  'group-hover:text-foreground'
                )}
              >
                {step.title}
              </span>
            </Link>
          );
        })}
        
        {/* mobile background dashes */}
        <div className="absolute top-4 flex h-1 w-full border-b border-dashed border-muted-foreground/30 lg:hidden" />
      </div>
    </div>
  );
}