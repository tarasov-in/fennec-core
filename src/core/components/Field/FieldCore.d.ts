/**
 * FieldCore - Business logic for Field component
 *
 * Handles field type detection, validation, value normalization,
 * and prop generation without any UI dependencies.
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { UIAdapter, ValidationRule, SelectOption } from '../../../adapters/UIAdapter';
import { Dayjs } from 'dayjs';

export interface FieldMeta {
  type?:
    | 'string'
    | 'integer'
    | 'int'
    | 'long'
    | 'float'
    | 'double'
    | 'bigdecimal'
    | 'boolean'
    | 'bool'
    | 'date'
    | 'localdate'
    | 'time'
    | 'localtime'
    | 'datetime'
    | 'timestamp'
    | 'localdatetime'
    | 'file'
    | 'files'
    | 'image'
    | 'select'
    | 'multiselect'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'password'
    | 'email'
    | 'url'
    | 'tel'
    | 'color'
    | 'rate'
    | 'slider'
    | 'switch';
  name?: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  help?: string;
  tooltip?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  options?: SelectOption[];
  defaultValue?: any;
  format?: string;
  multiple?: boolean;
  accept?: string;
  rows?: number;
  precision?: number;
  step?: number;
  showTime?: boolean;
  [key: string]: any;
}

export interface FieldCoreProps {
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  [key: string]: any;
}

/**
 * FieldCore class - Pure business logic for Field component
 */
export class FieldCore {
  props: FieldCoreProps;
  meta: FieldMeta;
  adapter: UIAdapter;

  constructor(props: FieldCoreProps, meta: FieldMeta, adapter: UIAdapter);

  /**
   * Determines field type from metadata
   */
  getFieldType(): string;

  /**
   * Generates validation rules from metadata
   */
  getValidationRules(): ValidationRule[];

  /**
   * Checks if field is required
   */
  isRequired(): boolean;

  /**
   * Formats value from form to UI component
   */
  formatValue(value: any): any;

  /**
   * Normalizes value from UI component to form
   */
  normalizeValue(value: any): any;

  /**
   * Gets placeholder text
   */
  getPlaceholder(): string | undefined;

  /**
   * Gets component props for specific field type
   */
  getComponentProps(): Record<string, any>;

  /**
   * Gets options for select/radio/checkbox fields
   */
  getOptions(): SelectOption[];

  /**
   * Checks if field is disabled
   */
  isDisabled(): boolean;

  /**
   * Checks if field is read-only
   */
  isReadOnly(): boolean;

  /**
   * Gets label text
   */
  getLabel(): string | undefined;

  /**
   * Gets help text
   */
  getHelp(): string | undefined;

  /**
   * Gets tooltip text
   */
  getTooltip(): string | undefined;
}
