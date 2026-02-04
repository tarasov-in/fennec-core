/**
 * Model - Modern Model/Form component with UI-agnostic architecture
 *
 * Uses ModelCore (business logic) + ModelRenderer (UI via UIAdapter)
 * v2.2.0: Added automatic Desktop/Mobile responsive switching
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { ComponentType, ReactNode } from 'react';
import { ModelMeta, ContextFilter } from '../../../core/components/Model/ModelCore';
import { FormInstance } from '../../../adapters/UIAdapter';

export interface ModelProps {
  /**
   * Metadata object or function that returns metadata
   */
  meta: ModelMeta | (() => ModelMeta);

  /**
   * Object with current form values
   */
  object?: Record<string, any>;

  /**
   * Change handler for form values
   */
  onChange?: (values: Record<string, any>) => void;

  /**
   * Submit handler called when form is submitted
   */
  onFinish?: (values: Record<string, any>) => void;

  /**
   * Error handler called when form validation fails
   */
  onFinishFailed?: (errorInfo: any) => void;

  /**
   * Context filters for related data loading
   */
  contextFilters?: ContextFilter[];

  /**
   * Scheme defining which relations to load
   * @example ['addresses', 'orders.items']
   */
  scheme?: string[];

  /**
   * Function to compare relation properties
   */
  linksCompareFunction?: (property: any) => string | undefined;

  /**
   * Form layout
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical' | 'inline';

  /**
   * Whether form fields are disabled
   */
  disabled?: boolean;

  /**
   * Whether form fields are read-only
   */
  readOnly?: boolean;

  /**
   * Form instance (for programmatic form control)
   */
  form?: FormInstance;

  /**
   * CSS class name
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;

  /**
   * Force mobile rendering regardless of screen size 
   * @default undefined (auto-detect based on screen width ≤768px)
   */
  forceMobile?: boolean;

  /**
   * Custom footer buttons
   */
  footer?: ReactNode;

  /**
   * Show/hide submit button
   * @default true
   */
  showSubmit?: boolean;

  /**
   * Show/hide reset button
   * @default false
   */
  showReset?: boolean;

  /**
   * Submit button text
   * @default 'Submit'
   */
  submitText?: string;

  /**
   * Reset button text
   * @default 'Reset'
   */
  resetText?: string;

  /**
   * Additional props passed to underlying Form component
   */
  [key: string]: any;
}

/**
 * Model Component
 *
 * @example
 * ```tsx
 * // Simple form
 * <Model
 *   meta={userMeta}
 *   object={user}
 *   onFinish={handleSave}
 * />
 *
 * // Form with context filters
 * <Model
 *   meta={orderMeta}
 *   object={order}
 *   contextFilters={[
 *     { name: 'userId', value: currentUserId, operator: 'eq' }
 *   ]}
 *   scheme={['items', 'shipping']}
 *   onFinish={handleSave}
 * />
 *
 * // Mobile form
 * <Model
 *   forceMobile={true}
 *   meta={profileMeta}
 *   object={profile}
 *   onFinish={handleSave}
 * />
 *
 * // Controlled form
 * const [form] = Form.useForm();
 * <Model
 *   form={form}
 *   meta={productMeta}
 *   onFinish={async (values) => {
 *     await saveProduct(values);
 *     form.resetFields();
 *   }}
 * />
 * ```
 */
export const Model: ComponentType<ModelProps>;

export default Model;
