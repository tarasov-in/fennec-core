/**
 * ActionCore - Main UI-Agnostic Action Logic
 *
 * Orchestrates modal, wizard, and form logic for Action component
 * Handles action execution, loading state, and PubSub integration
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { ReactNode, ComponentType } from 'react';
import { ModelMeta } from '../Model/ModelCore';
import { FormInstance } from '../../../adapters/UIAdapter';

export interface ActionStep {
  label: string;
  description?: string;
  form?: ComponentType<any> | ReactNode;
  object?: Record<string, any>;
  meta?: ModelMeta;
  disabled?: boolean;
  [key: string]: any;
}

export interface ActionCoreProps {
  /**
   * Modal visibility
   */
  visible?: boolean;

  /**
   * Wizard steps (if undefined/null, simple action mode)
   */
  steps?: ActionStep[];

  /**
   * Form object/data
   */
  object?: Record<string, any>;

  /**
   * Modify function for form submission
   */
  modify?: (data: Record<string, any>) => Promise<any>;

  /**
   * Use FormData for submission
   */
  isFormData?: boolean;

  /**
   * Disable OK button when form is unchanged
   */
  disabledOkOnUncahngedForm?: boolean;

  /**
   * Readonly mode
   */
  readonly?: boolean;

  /**
   * Disabled mode
   */
  disabled?: boolean;

  /**
   * Don't use Ant Design Form wrapper
   */
  noAntForm?: boolean;

  /**
   * Custom form component
   */
  form?: ComponentType<any> | ReactNode;

  [key: string]: any;
}

/**
 * ActionModalCore - Modal management logic
 */
export class ActionModalCore {
  visible: boolean;

  constructor(props: { visible?: boolean });

  isVisible(): boolean;
  show(): void;
  hide(): void;
  toggle(): void;
}

/**
 * ActionWizardCore - Wizard/Steps management logic
 */
export class ActionWizardCore {
  steps?: ActionStep[];
  currentStep: number;

  constructor(steps?: ActionStep[]);

  isWizard(): boolean;
  getCurrentStep(): number;
  setCurrentStep(step: number): void;
  nextStep(): void;
  prevStep(): void;
  isFirstStep(): boolean;
  isLastStep(): boolean;
  getSteps(): ActionStep[];
  getCurrentStepData(): ActionStep | null;
  getCurrentForm(): ComponentType<any> | ReactNode | null;
  getCurrentObject(): Record<string, any>;
}

/**
 * ActionFormCore - Form management logic
 */
export class ActionFormCore {
  object?: Record<string, any>;
  originalObject?: Record<string, any>;
  modify?: (data: Record<string, any>) => Promise<any>;
  isFormData?: boolean;
  disabledOkOnUncahngedForm?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  noAntForm?: boolean;

  constructor(props: {
    object?: Record<string, any>;
    modify?: (data: Record<string, any>) => Promise<any>;
    isFormData?: boolean;
    disabledOkOnUncahngedForm?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    noAntForm?: boolean;
  });

  getObject(): Record<string, any>;
  setObject(object: Record<string, any>): void;
  updateObject(updates: Record<string, any>): void;
  resetObject(): void;
  isFormChanged(): boolean;
  shouldDisableOk(): boolean;
  submit(formInstance?: FormInstance): Promise<any>;
}

/**
 * ActionCore - Main Action logic orchestrator
 */
export class ActionCore {
  props: ActionCoreProps;
  modal: ActionModalCore;
  wizard: ActionWizardCore;
  form: ActionFormCore;
  loading: boolean;
  onLoadingChangeCallbacks: Array<(loading: boolean) => void>;

  constructor(props?: ActionCoreProps);

  /**
   * Check if this is a wizard mode
   */
  isWizard(): boolean;

  /**
   * Check if component is in readonly mode
   */
  isReadonly(): boolean;

  /**
   * Check if component is disabled
   */
  isDisabled(): boolean;

  /**
   * Check if currently loading
   */
  isLoading(): boolean;

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void;

  /**
   * Get current form component
   */
  getCurrentForm(): ComponentType<any> | ReactNode | null;

  /**
   * Get current form object/data
   */
  getCurrentObject(): Record<string, any>;

  /**
   * Subscribe to loading state changes
   */
  onLoadingChange(callback: (loading: boolean) => void): () => void;

  /**
   * Notify all loading change subscribers
   */
  notifyLoadingChange(): void;

  /**
   * Execute action (submit form)
   */
  execute(formInstance?: FormInstance): Promise<any>;

  /**
   * Handle OK button click
   */
  handleOk(formInstance?: FormInstance): Promise<void>;

  /**
   * Handle Cancel button click
   */
  handleCancel(): void;

  /**
   * Handle wizard next step
   */
  handleNext(): void;

  /**
   * Handle wizard previous step
   */
  handlePrev(): void;
}

export { ActionModalCore, ActionWizardCore, ActionFormCore };
