import { useState, useCallback, useMemo } from 'react';

interface UseMultiStepFormOptions {
  totalSteps: number;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

interface UseMultiStepFormReturn {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

/**
 * Hook for managing multi-step form navigation
 *
 * @example
 * const { currentStep, isLastStep, nextStep, prevStep } = useMultiStepForm({
 *   totalSteps: 6,
 *   onComplete: () => saveData(),
 * });
 *
 * const handleNext = () => {
 *   if (isLastStep) {
 *     saveData();
 *   } else {
 *     nextStep();
 *   }
 * };
 */
export function useMultiStepForm({
  totalSteps,
  initialStep = 1,
  onStepChange,
  onComplete,
}: UseMultiStepFormOptions): UseMultiStepFormReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  // Progress as a percentage (0-1)
  const progress = useMemo(() => {
    return currentStep / totalSteps;
  }, [currentStep, totalSteps]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [totalSteps, onStepChange]
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    } else if (currentStep === totalSteps) {
      onComplete?.();
    }
  }, [currentStep, totalSteps, onStepChange, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  }, [currentStep, onStepChange]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    goToStep,
    nextStep,
    prevStep,
    reset,
  };
}

/**
 * Hook for prefilling form data from API response
 * Handles the common pattern of loading data once and hydrating form state
 *
 * @example
 * const { hasLoaded, markAsLoaded } = useFormDataLoader();
 *
 * useEffect(() => {
 *   if (data && !hasLoaded) {
 *     setField1(data.field1);
 *     setField2(data.field2);
 *     markAsLoaded();
 *   }
 * }, [data, hasLoaded]);
 */
export function useFormDataLoader() {
  const [hasLoaded, setHasLoaded] = useState(false);

  const markAsLoaded = useCallback(() => {
    setHasLoaded(true);
  }, []);

  const reset = useCallback(() => {
    setHasLoaded(false);
  }, []);

  return {
    hasLoaded,
    markAsLoaded,
    reset,
  };
}
