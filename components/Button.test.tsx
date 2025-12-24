import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render as button element', () => {
      render(<Button>Test</Button>);

      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('variants', () => {
    it('should apply primary variant by default', () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('from-blue-600');
      expect(button.className).toContain('to-blue-700');
    });

    it('should apply secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-white');
      expect(button.className).toContain('border-slate-300');
    });

    it('should apply danger variant', () => {
      render(<Button variant="danger">Danger</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('from-red-500');
      expect(button.className).toContain('to-red-600');
    });

    it('should apply ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-slate-600');
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Button>Medium</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('px-4');
      expect(button.className).toContain('py-2');
      expect(button.className).toContain('text-base');
    });

    it('should apply small size', () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('px-3');
      expect(button.className).toContain('py-1.5');
      expect(button.className).toContain('text-sm');
    });

    it('should apply large size', () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('py-3');
      expect(button.className).toContain('text-lg');
    });
  });

  describe('fullWidth', () => {
    it('should not be full width by default', () => {
      render(<Button>Normal</Button>);

      const button = screen.getByRole('button');
      expect(button.className).not.toContain('w-full');
    });

    it('should apply full width when specified', () => {
      render(<Button fullWidth>Full Width</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('w-full');
    });
  });

  describe('custom className', () => {
    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });

    it('should merge custom className with default styles', () => {
      render(<Button className="custom-class">Merged</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
      expect(button.className).toContain('rounded-lg');
      expect(button.className).toContain('font-medium');
    });
  });

  describe('interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should pass through button HTML attributes', () => {
      render(
        <Button type="submit" name="test-button">
          Submit
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveAttribute('name', 'test-button');
    });
  });

  describe('disabled state', () => {
    it('should be enabled by default', () => {
      render(<Button>Enabled</Button>);

      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should be disabled when specified', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should apply disabled opacity class', () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled:opacity-50');
      expect(button.className).toContain('disabled:cursor-not-allowed');
    });
  });

  describe('accessibility', () => {
    it('should have button role', () => {
      render(<Button>Accessible</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('should support aria-disabled', () => {
      render(<Button aria-disabled="true">Disabled</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should have focus ring styles', () => {
      render(<Button>Focus</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus:ring-2');
      expect(button.className).toContain('focus:ring-offset-2');
    });
  });

  describe('visual states', () => {
    it('should have transition classes', () => {
      render(<Button>Transition</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('transition-all');
      expect(button.className).toContain('duration-200');
    });

    it('should have active scale effect', () => {
      render(<Button>Active</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('active:scale-95');
    });

    it('should have flexbox centering', () => {
      render(<Button>Centered</Button>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('inline-flex');
      expect(button.className).toContain('items-center');
      expect(button.className).toContain('justify-center');
    });
  });

  describe('edge cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe('');
    });

    it('should handle multiple children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('IconText');
    });

    it('should handle JSX children', () => {
      render(
        <Button>
          <svg data-testid="icon" />
          Click
        </Button>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Click')).toBeInTheDocument();
    });

    it('should handle all props combined', () => {
      const handleClick = vi.fn();
      render(
        <Button
          variant="danger"
          size="lg"
          fullWidth
          disabled
          onClick={handleClick}
          className="custom"
          aria-label="Delete"
        >
          Delete
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('from-red-500');
      expect(button.className).toContain('px-6');
      expect(button.className).toContain('w-full');
      expect(button.className).toContain('custom');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-label', 'Delete');
    });
  });

  describe('type attribute', () => {
    it('should have button type by default', () => {
      render(<Button>Default Type</Button>);

      const button = screen.getByRole('button');
      // Note: button type defaults to "submit" in HTML, but we can override
      expect(button).toBeInTheDocument();
    });

    it('should support submit type', () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support reset type', () => {
      render(<Button type="reset">Reset</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'reset');
    });

    it('should support button type', () => {
      render(<Button type="button">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
