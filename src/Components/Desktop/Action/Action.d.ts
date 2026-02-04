/**
 * Action - Modern Action/Modal component with UI-agnostic architecture
 *
 * Uses ActionCore (business logic) + ActionRenderer (UI via UIAdapter)
 * Supports simple modal forms and multi-step wizard forms
 * Added automatic Desktop/Mobile responsive switching
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { ComponentType, ReactNode } from 'react';
import { ActionStep } from '../../../core/components/Action/ActionCore';
import { FormInstance } from '../../../adapters/UIAdapter';

export interface ActionProps {
  /**
   * Modal visibility
   */
  visible?: boolean;

  /**
   * Visibility change handler
   */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * Modal close handler
   */
  onClose?: () => void;

  /**
   * Modal title
   */
  title?: string | ReactNode;

  /**
   * Modal width
   * @default 600
   */
  width?: number | string;

  /**
   * Wizard steps (if provided, wizard mode is enabled)
   */
  steps?: ActionStep[];

  /**
   * Form object/data
   */
  object?: Record<string, any>;

  /**
   * Form change handler
   */
  onChange?: (values: Record<string, any>) => void;

  /**
   * Form submit handler
   */
  onFinish?: (values: Record<string, any>) => void;

  /**
   * Form validation error handler
   */
  onFinishFailed?: (errorInfo: any) => void;

  /**
   * Modify function for form submission (alternative to onFinish)
   * Supports async operations
   */
  modify?: (data: Record<string, any>) => Promise<any>;

  /**
   * Use FormData for submission (for file uploads)
   * @default false
   */
  isFormData?: boolean;

  /**
   * Disable OK button when form is unchanged
   * @default false
   */
  disabledOkOnUncahngedForm?: boolean;

  /**
   * Readonly mode (all fields disabled for viewing only)
   * @default false
   */
  readonly?: boolean;

  /**
   * Disabled mode (all fields disabled)
   * @default false
   */
  disabled?: boolean;

  /**
   * Don't use Ant Design Form wrapper
   * @default false
   */
  noAntForm?: boolean;

  /**
   * Custom form component
   */
  form?: ComponentType<any> | ReactNode;

  /**
   * Form instance (for programmatic form control)
   */
  formInstance?: FormInstance;

  /**
   * Custom footer buttons
   */
  footer?: ReactNode | null;

  /**
   * Show/hide OK button
   * @default true
   */
  showOk?: boolean;

  /**
   * Show/hide Cancel button
   * @default true
   */
  showCancel?: boolean;

  /**
   * OK button text
   * @default 'OK'
   */
  okText?: string;

  /**
   * Cancel button text
   * @default 'Cancel'
   */
  cancelText?: string;

  /**
   * OK button loading state
   */
  confirmLoading?: boolean;

  /**
   * Center modal vertically
   * @default false
   */
  centered?: boolean;

  /**
   * Allow closing modal by clicking mask
   * @default true
   */
  maskClosable?: boolean;

  /**
   * Show close icon
   * @default true
   */
  closable?: boolean;

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
   * Wizard: Show step indicators
   * @default true
   */
  showSteps?: boolean;

  /**
   * Wizard: Current step (controlled mode)
   */
  currentStep?: number;

  /**
   * Wizard: Step change handler (controlled mode)
   */
  onStepChange?: (step: number) => void;

  /**
   * Additional props passed to underlying Modal component
   */
  [key: string]: any;
}

/**
 * Action Component
 *
 * @example
 * ```tsx
 * // Simple modal form
 * <Action
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Edit User"
 *   form={<UserForm />}
 *   object={user}
 *   onFinish={handleSave}
 * />
 *
 * // Wizard form with steps
 * <Action
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Create Order"
 *   steps={[
 *     {
 *       label: 'Customer Info',
 *       form: <CustomerForm />,
 *       object: { customerId: null }
 *     },
 *     {
 *       label: 'Products',
 *       form: <ProductsForm />,
 *       object: { products: [] }
 *     },
 *     {
 *       label: 'Shipping',
 *       form: <ShippingForm />,
 *       object: { address: null }
 *     }
 *   ]}
 *   onFinish={handleCreateOrder}
 * />
 *
 * // With async modify function
 * <Action
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Upload Document"
 *   form={<DocumentForm />}
 *   object={document}
 *   isFormData={true}
 *   modify={async (formData) => {
 *     const response = await uploadDocument(formData);
 *     return response.data;
 *   }}
 * />
 *
 * // Readonly mode
 * <Action
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="View Details"
 *   form={<DetailsForm />}
 *   object={details}
 *   readonly={true}
 *   footer={null}
 * />
 *
 * // Mobile modal
 * <Action
 *   forceMobile={true}
 *   visible={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Quick Edit"
 *   form={<QuickEditForm />}
 *   object={item}
 *   onFinish={handleSave}
 * />
 * ```
 */
export const Action: ComponentType<ActionProps>;

export default Action;
