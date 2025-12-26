import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from './useFormValidation';

describe('useFormValidation', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useFormValidation('initial'));
    expect(result.current.value).toBe('initial');
    expect(result.current.error).toBeNull();
    expect(result.current.touched).toBe(false);
    expect(result.current.isValid).toBe(true);
  });

  it('should validate required field', () => {
    const { result } = renderHook(() =>
      useFormValidation('', { required: true, requiredMessage: '必須項目です' })
    );

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.error).toBe('必須項目です');
    expect(result.current.isValid).toBe(false);
  });

  it('should validate custom rules', () => {
    const { result } = renderHook(() =>
      useFormValidation('test', {
        rules: [
          {
            validate: (value: string) => value.length >= 5,
            message: '5文字以上入力してください',
          },
        ],
      })
    );

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.error).toBe('5文字以上入力してください');
    expect(result.current.isValid).toBe(false);
  });

  it('should pass validation with valid value', () => {
    const { result } = renderHook(() =>
      useFormValidation('valid text', {
        required: true,
        rules: [
          {
            validate: (value: string) => value.length >= 5,
            message: '5文字以上入力してください',
          },
        ],
      })
    );

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isValid).toBe(true);
  });

  it('should update value and validate on change after touched', () => {
    const { result } = renderHook(() =>
      useFormValidation('', {
        required: true,
      })
    );

    // First touch
    act(() => {
      result.current.onBlur();
    });

    expect(result.current.touched).toBe(true);
    expect(result.current.error).toBe('入力は必須です');

    // Update value
    act(() => {
      result.current.setValue('new value');
    });

    expect(result.current.value).toBe('new value');
    expect(result.current.error).toBeNull();
    expect(result.current.isValid).toBe(true);
  });

  it('should not validate on change before touched', () => {
    const { result } = renderHook(() =>
      useFormValidation('', {
        required: true,
      })
    );

    act(() => {
      result.current.setValue('test');
    });

    // Should not show error until touched
    expect(result.current.error).toBeNull();
    expect(result.current.touched).toBe(false);
  });

  it('should reset to initial state', () => {
    const { result } = renderHook(() =>
      useFormValidation('initial', {
        required: true,
      })
    );

    // Make changes
    act(() => {
      result.current.setValue('changed');
      result.current.onBlur();
    });

    expect(result.current.value).toBe('changed');
    expect(result.current.touched).toBe(true);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe('initial');
    expect(result.current.error).toBeNull();
    expect(result.current.touched).toBe(false);
  });

  it('should validate array values', () => {
    const { result } = renderHook(() =>
      useFormValidation<string[]>([], {
        required: true,
        requiredMessage: '少なくとも1つ選択してください',
      })
    );

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.error).toBe('少なくとも1つ選択してください');

    act(() => {
      result.current.setValue(['item1']);
    });

    // Validate after setValue (which re-validates since touched is true)
    expect(result.current.error).toBeNull();
    expect(result.current.isValid).toBe(true);
  });

  it('should manually validate without blur', () => {
    const { result } = renderHook(() =>
      useFormValidation('', {
        required: true,
      })
    );

    act(() => {
      const isValid = result.current.validate();
      expect(isValid).toBe(false);
    });

    expect(result.current.error).toBe('入力は必須です');
  });
});
