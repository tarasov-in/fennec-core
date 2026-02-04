/**
 * Field - Modern Field component with UI-agnostic architecture
 *
 * Uses FieldCore (business logic) + FieldRenderer (UI via UIAdapter)
 * v2.2.0: Added automatic Desktop/Mobile responsive switching
 * Supports 26+ field types
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { ComponentType } from 'react';
import { FieldMeta } from '../../../core/components/Field/FieldCore';

export interface FieldProps {
  /**
   * Metadata object or function that returns metadata
   */
  meta: FieldMeta | (() => FieldMeta);

  /**
   * Current field value
   */
  value?: any;

  /**
   * Change handler
   */
  onChange?: (value: any) => void;

  /**
   * Whether field is disabled
   */
  disabled?: boolean;

  /**
   * Whether field is read-only
   */
  readOnly?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Field label
   */
  label?: string;

  /**
   * Help text shown below the field
   */
  help?: string;

  /**
   * Tooltip text
   */
  tooltip?: string;

  /**
   * CSS class name
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;

  /**
   * Force mobile rendering regardless of screen size (NEW in v2.2)
   * @default undefined (auto-detect based on screen width ≤768px)
   */
  forceMobile?: boolean;

  /**
   * Additional props passed to underlying component
   */
  [key: string]: any;
}

/**
 * Field Component
 *
 * @example
 * ```tsx
 * // Simple string input
 * <Field
 *   meta={{ type: 'string', label: 'Name' }}
 *   value={name}
 *   onChange={setName}
 * />
 *
 * // Date picker
 * <Field
 *   meta={{ type: 'date', label: 'Birth Date' }}
 *   value={birthDate}
 *   onChange={setBirthDate}
 * />
 *
 * // Select with options
 * <Field
 *   meta={{
 *     type: 'select',
 *     label: 'Category',
 *     options: [
 *       { label: 'Option 1', value: 1 },
 *       { label: 'Option 2', value: 2 }
 *     ]
 *   }}
 *   value={category}
 *   onChange={setCategory}
 * />
 *
 * // Force mobile UI
 * <Field
 *   forceMobile={true}
 *   meta={{ type: 'string' }}
 *   value={value}
 *   onChange={setValue}
 * />
 * ```
 */
export const Field: ComponentType<FieldProps>;

export default Field;
