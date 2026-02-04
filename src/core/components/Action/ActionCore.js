/**
 * ActionCore - Main UI-Agnostic Action Logic
 *
 * Orchestrates modal, wizard, and form logic for Action component
 * Handles action execution, loading state, and PubSub integration
 *
 * @version 2.1.0
 */

import { ActionModalCore } from './ActionModalCore'
import { ActionWizardCore } from './ActionWizardCore'
import { ActionFormCore } from './ActionFormCore'

export class ActionCore {
  constructor(props = {}) {
    this.props = props

    // Sub-cores
    this.modal = new ActionModalCore({
      visible: props.visible
    })

    this.wizard = new ActionWizardCore(props.steps)

    this.form = new ActionFormCore({
      object: props.object,
      modify: props.modify,
      isFormData: props.isFormData,
      disabledOkOnUncahngedForm: props.disabledOkOnUncahngedForm,
      readonly: props.readonly,
      disabled: props.disabled,
      noAntForm: props.noAntForm
    })

    // Execution state
    this.loading = false
    this.onLoadingChangeCallbacks = []
  }

  /**
   * Check if this is a wizard mode
   * @returns {boolean}
   */
  isWizard() {
    return this.wizard.isWizard()
  }

  /**
   * Check if component is in readonly mode
   * @returns {boolean}
   */
  isReadonly() {
    return this.props.readonly === true
  }

  /**
   * Check if component is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.props.disabled === true
  }

  /**
   * Check if currently loading
   * @returns {boolean}
   */
  isLoading() {
    return this.loading
  }

  /**
   * Set loading state
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.loading = loading
    this.notifyLoadingChange()
  }

  /**
   * Get current form component
   * For wizard: current step's form
   * For simple: main form
   * @returns {Component|null}
   */
  getCurrentForm() {
    if (this.isWizard()) {
      return this.wizard.getCurrentForm()
    }
    return this.props.form || null
  }

  /**
   * Get current form object/data
   * For wizard: current step's object
   * For simple: main object
   * @returns {Object}
   */
  getCurrentObject() {
    if (this.isWizard()) {
      return this.wizard.getCurrentObject()
    }
    return this.props.object || {}
  }

  /**
   * Get current titles
   * @returns {Object}
   */
  getCurrentTitles() {
    if (this.isWizard()) {
      return this.wizard.getCurrentTitles()
    }
    return this.props.titles || {}
  }

  /**
   * Get button text for current state
   * @returns {Object}
   */
  getButtonText() {
    const { okText, dismissText, nextText, backText, placeholder } = this.props

    if (this.isWizard()) {
      const isLastStep = this.wizard.isLastStep()
      const isFirstStep = this.wizard.isFirstStep()

      return {
        ok: isLastStep ? (okText || 'Завершить') : (nextText || 'Далее'),
        dismiss: dismissText || 'Отмена',
        back: backText || 'Назад',
        showBack: !isFirstStep,
        placeholder: placeholder || 'Открыть'
      }
    }

    return {
      ok: okText || 'OK',
      dismiss: dismissText || 'Отмена',
      back: null,
      showBack: false,
      placeholder: placeholder || 'Открыть'
    }
  }

  /**
   * Handle OK button click
   * For wizard: move to next step or execute
   * For simple: execute immediately
   * @param {Object} formValues - Current form values
   */
  async handleOk(formValues) {
    if (this.isWizard()) {
      const currentStep = this.wizard.getCurrentStep()
      const stepKey = currentStep?.key

      // Save current step data
      if (stepKey) {
        this.wizard.setStepData(stepKey, formValues)
      }

      // If not last step, move to next
      if (!this.wizard.isLastStep()) {
        this.wizard.nextStep()
        return
      }

      // Last step - execute action with all data
      const allStepData = this.wizard.getAllStepData()
      await this.executeAction(allStepData)
    } else {
      // Simple action - execute immediately
      await this.executeAction(formValues)
    }
  }

  /**
   * Handle Back button click (wizard only)
   */
  handleBack() {
    if (this.isWizard()) {
      this.wizard.prevStep()
    }
  }

  /**
   * Execute the action
   * @param {Object} values - Form values
   */
  async executeAction(values) {
    const { action, callback } = this.props

    if (!action) {
      console.warn('ActionCore: no action function provided')
      return
    }

    // Prepare values (modify + FormData)
    const preparedValues = this.form.prepareForSubmit(values)

    // Set loading
    this.setLoading(true)

    // Unlock function
    const unlock = () => {
      this.setLoading(false)
    }

    // Close function
    const close = (skipCallback = false) => {
      this.modal.close({ skipCallback })

      // Reset wizard and form on close
      if (this.isWizard()) {
        this.wizard.reset()
      }
      this.form.reset()
    }

    try {
      // Execute action
      await action(preparedValues, unlock, close)

      // Additional callback if provided
      if (callback && typeof callback === 'function') {
        callback(preparedValues)
      }
    } catch (error) {
      // Error handling - just unlock, don't close
      unlock()
      console.error('ActionCore: action execution failed', error)
      throw error
    }
  }

  /**
   * Check if submit button should be disabled
   * @returns {boolean}
   */
  isSubmitDisabled() {
    // Loading state
    if (this.loading) {
      return true
    }

    // Form-level checks
    return this.form.isSubmitDisabled()
  }

  /**
   * Get all props needed for rendering
   * @returns {Object}
   */
  getRenderProps() {
    const buttonText = this.getButtonText()

    return {
      // Modal
      modalProps: this.modal.getModalProps(),
      triggerProps: this.modal.getTriggerProps(this.props.triggerOptions),

      // Form
      formProps: this.form.getFormProps(),
      currentForm: this.getCurrentForm(),
      currentObject: this.getCurrentObject(),
      useAntForm: this.form.shouldUseAntForm(),

      // Wizard
      isWizard: this.isWizard(),
      wizardProps: this.wizard.getNavigationProps(),

      // Titles & Text
      titles: this.getCurrentTitles(),
      buttonText,

      // State
      loading: this.loading,
      submitDisabled: this.isSubmitDisabled(),
      readonly: this.isReadonly(),
      disabled: this.isDisabled(),

      // Handlers
      onOk: (values) => this.handleOk(values),
      onBack: () => this.handleBack(),
      onClose: () => this.modal.close(),
      onOpen: () => this.modal.open(),

      // Additional props
      mode: this.props.mode || 'default',
      brief: this.props.brief,
      swipe: this.props.swipe,
      contextFilters: this.props.contextFilters,
      hideMenu: this.props.hideMenu,
      formWraperStyle: this.props.formWraperStyle,
      triggerStyle: this.props.triggerStyle
    }
  }

  /**
   * Update from new props (for React component updates)
   * @param {Object} newProps
   */
  updateProps(newProps) {
    this.props = { ...this.props, ...newProps }

    // Update modal controlled state
    if (newProps.visible !== undefined) {
      this.modal.updateControlledState(newProps.visible)
    }

    // Update form initial values if object changed
    if (newProps.object !== undefined) {
      this.form.initialValues = newProps.object
    }

    // Update wizard steps if changed
    if (newProps.steps !== undefined) {
      this.wizard.steps = newProps.steps
    }
  }

  /**
   * Register callback for loading state changes
   * @param {Function} callback
   * @returns {Function} - Unregister function
   */
  onLoadingChange(callback) {
    this.onLoadingChangeCallbacks.push(callback)
    return () => {
      this.onLoadingChangeCallbacks = this.onLoadingChangeCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Notify loading change callbacks
   */
  notifyLoadingChange() {
    this.onLoadingChangeCallbacks.forEach(callback => {
      callback(this.loading)
    })
  }

  /**
   * Cleanup
   */
  destroy() {
    this.modal.destroy()
    this.wizard.destroy()
    this.form.destroy()
    this.onLoadingChangeCallbacks = []
  }
}

// Export all sub-cores as well
export { ActionModalCore } from './ActionModalCore'
export { ActionWizardCore } from './ActionWizardCore'
export { ActionFormCore } from './ActionFormCore'
