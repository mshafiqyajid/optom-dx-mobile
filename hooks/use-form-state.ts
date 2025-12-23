import { useState, useCallback, useMemo } from 'react';

type ValidationRule<T> = {
  validate: (value: T[keyof T], values: T) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

type FormErrors<T> = Partial<Record<keyof T, string>>;

interface UseFormStateOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * Custom hook for managing form state with validation
 *
 * @example
 * const { values, errors, setValue, validate, handleSubmit, reset } = useFormState({
 *   initialValues: { email: '', password: '' },
 *   validationRules: {
 *     email: [{ validate: (v) => !!v, message: 'Email is required' }],
 *     password: [{ validate: (v) => v.length >= 6, message: 'Password must be 6+ chars' }],
 *   },
 *   onSubmit: async (values) => { await login(values); },
 * });
 */
export function useFormState<T extends object>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormStateOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set a single field value
  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      // Clear error when value changes
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Set multiple values at once
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  // Mark field as touched
  const setFieldTouched = useCallback((key: keyof T, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [key]: isTouched }));
  }, []);

  // Validate a single field
  const validateField = useCallback(
    (key: keyof T): string | null => {
      const rules = validationRules[key];
      if (!rules) return null;

      for (const rule of rules) {
        if (!rule.validate(values[key], values)) {
          return rule.message;
        }
      }
      return null;
    },
    [values, validationRules]
  );

  // Validate all fields
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    let isValid = true;

    for (const key of Object.keys(validationRules) as (keyof T)[]) {
      const error = validateField(key);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validateField, validationRules]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched(allTouched);

    // Validate
    if (!validate()) {
      return false;
    }

    // Submit
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        return true;
      } catch {
        return false;
      } finally {
        setIsSubmitting(false);
      }
    }

    return true;
  }, [values, validate, onSubmit]);

  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Check if form is valid (memoized)
  const isValid = useMemo(() => {
    for (const key of Object.keys(validationRules) as (keyof T)[]) {
      const error = validateField(key);
      if (error) return false;
    }
    return true;
  }, [validateField, validationRules]);

  // Check if form has been modified
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setMultipleValues,
    setFieldTouched,
    validateField,
    validate,
    handleSubmit,
    reset,
  };
}

// Common validation helpers
export const ValidationHelpers = {
  required: (message = 'This field is required') => ({
    validate: (value: unknown) => {
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return true;
      return value != null;
    },
    message,
  }),

  minLength: (min: number, message?: string) => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return true;
      return value.length >= min;
    },
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string) => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return true;
      return value.length <= max;
    },
    message: message || `Must be at most ${max} characters`,
  }),

  email: (message = 'Invalid email address') => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return true;
      if (!value) return true; // Use required for empty check
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    message,
  }),

  pattern: (regex: RegExp, message: string) => ({
    validate: (value: unknown) => {
      if (typeof value !== 'string') return true;
      if (!value) return true;
      return regex.test(value);
    },
    message,
  }),
};
