import { useState, useCallback } from 'react';

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export interface UseFormValidationOptions<T> {
  rules?: ValidationRule<T>[];
  required?: boolean;
  requiredMessage?: string;
}

/**
 * フォームバリデーション用カスタムフック
 * 複数箇所で使われているバリデーションロジックを統一
 */
export const useFormValidation = <T = string>(
  initialValue: T,
  options: UseFormValidationOptions<T> = {}
) => {
  const { rules = [], required = false, requiredMessage = '入力は必須です' } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    (val: T = value): boolean => {
      // Required check
      if (required) {
        const isEmpty =
          val === null ||
          val === undefined ||
          (typeof val === 'string' && val.trim() === '') ||
          (Array.isArray(val) && val.length === 0);

        if (isEmpty) {
          setError(requiredMessage);
          return false;
        }
      }

      // Custom rules
      for (const rule of rules) {
        if (!rule.validate(val)) {
          setError(rule.message);
          return false;
        }
      }

      setError(null);
      return true;
    },
    [value, required, requiredMessage, rules]
  );

  const handleChange = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (touched) {
        validate(newValue);
      }
    },
    [touched, validate]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    isValid: error === null,
    setValue: handleChange,
    onBlur: handleBlur,
    validate,
    reset,
  };
};
