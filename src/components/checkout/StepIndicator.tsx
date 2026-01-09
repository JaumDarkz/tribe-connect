/**
 * StepIndicator Component
 * Shows progress through checkout wizard steps
 */

import { Check } from 'lucide-react';
import { CheckoutStep } from '@/types/checkout';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: CheckoutStep;
  currentStepIndex: number;
}

const steps: { key: CheckoutStep; label: string }[] = [
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirm', label: 'Confirm' },
];

export const StepIndicator = ({ currentStep, currentStepIndex }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = index < currentStepIndex;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isActive && 'text-primary',
                  isCompleted && 'text-primary',
                  !isActive && !isCompleted && 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-16 md:w-24 h-0.5 mx-2 transition-all duration-300',
                  index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
