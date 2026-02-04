/**
 * ActionWizardCore - UI-Agnostic Wizard State Management
 *
 * Handles multi-step wizard navigation, step data accumulation,
 * and step validation logic
 *
 * @version 2.1.0
 */

export class ActionWizardCore {
  constructor(steps = []) {
    this.steps = steps
    this.currentStepIndex = 0
    this.stepData = {} // Accumulated data from all steps
    this.onStepChangeCallbacks = []
  }

  /**
   * Check if this is a wizard (has multiple steps)
   * @returns {boolean}
   */
  isWizard() {
    return this.steps && this.steps.length > 1
  }

  /**
   * Get total number of steps
   * @returns {number}
   */
  getTotalSteps() {
    return this.steps ? this.steps.length : 0
  }

  /**
   * Get current step index (0-based)
   * @returns {number}
   */
  getCurrentStepIndex() {
    return this.currentStepIndex
  }

  /**
   * Get current step object
   * @returns {Object|null}
   */
  getCurrentStep() {
    return this.steps?.[this.currentStepIndex] || null
  }

  /**
   * Get step by index
   * @param {number} index
   * @returns {Object|null}
   */
  getStep(index) {
    return this.steps?.[index] || null
  }

  /**
   * Check if current step is the first step
   * @returns {boolean}
   */
  isFirstStep() {
    return this.currentStepIndex === 0
  }

  /**
   * Check if current step is the last step
   * @returns {boolean}
   */
  isLastStep() {
    return this.currentStepIndex === this.getTotalSteps() - 1
  }

  /**
   * Move to next step
   * @returns {boolean} - Success
   */
  nextStep() {
    if (this.isLastStep()) {
      return false
    }

    this.currentStepIndex++
    this.notifyStepChange()
    return true
  }

  /**
   * Move to previous step
   * @returns {boolean} - Success
   */
  prevStep() {
    if (this.isFirstStep()) {
      return false
    }

    this.currentStepIndex--
    this.notifyStepChange()
    return true
  }

  /**
   * Jump to specific step
   * @param {number} index
   * @returns {boolean} - Success
   */
  goToStep(index) {
    if (index < 0 || index >= this.getTotalSteps()) {
      return false
    }

    this.currentStepIndex = index
    this.notifyStepChange()
    return true
  }

  /**
   * Save data for specific step
   * @param {string} stepKey - Step key
   * @param {Object} data - Step data
   */
  setStepData(stepKey, data) {
    this.stepData[stepKey] = data
  }

  /**
   * Get data for specific step
   * @param {string} stepKey
   * @returns {Object|undefined}
   */
  getStepData(stepKey) {
    return this.stepData[stepKey]
  }

  /**
   * Get all accumulated step data
   * @returns {Object}
   */
  getAllStepData() {
    return { ...this.stepData }
  }

  /**
   * Clear all step data
   */
  clearStepData() {
    this.stepData = {}
  }

  /**
   * Reset wizard to initial state
   */
  reset() {
    this.currentStepIndex = 0
    this.clearStepData()
    this.notifyStepChange()
  }

  /**
   * Get current step's form component
   * @returns {Component|null}
   */
  getCurrentForm() {
    const step = this.getCurrentStep()
    return step?.form || null
  }

  /**
   * Get current step's object data
   * @returns {Object}
   */
  getCurrentObject() {
    const step = this.getCurrentStep()
    return step?.object || {}
  }

  /**
   * Get current step's metadata
   * @returns {Object}
   */
  getCurrentMeta() {
    const step = this.getCurrentStep()
    return step?.meta || {}
  }

  /**
   * Get current step's titles
   * @returns {Object}
   */
  getCurrentTitles() {
    const step = this.getCurrentStep()
    return step?.titles || {}
  }

  /**
   * Get current step's options
   * @returns {Object}
   */
  getCurrentOptions() {
    const step = this.getCurrentStep()
    return step?.options || {}
  }

  /**
   * Check if current step has nested steps
   * @returns {boolean}
   */
  hasNestedSteps() {
    const step = this.getCurrentStep()
    return !!(step?.steps && step.steps.length > 0)
  }

  /**
   * Get nested steps for current step
   * @returns {Array|null}
   */
  getNestedSteps() {
    const step = this.getCurrentStep()
    return step?.steps || null
  }

  /**
   * Check if current step uses Ant Form
   * @returns {boolean}
   */
  isAntFormEnabled() {
    const step = this.getCurrentStep()
    return step?.noAntForm !== true
  }

  /**
   * Register callback for step change
   * @param {Function} callback
   * @returns {Function} - Unregister function
   */
  onStepChange(callback) {
    this.onStepChangeCallbacks.push(callback)
    return () => {
      this.onStepChangeCallbacks = this.onStepChangeCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Notify step change callbacks
   */
  notifyStepChange() {
    this.onStepChangeCallbacks.forEach(callback => {
      callback(this.currentStepIndex, this.getCurrentStep())
    })
  }

  /**
   * Get props for wizard navigation buttons
   * @returns {Object}
   */
  getNavigationProps() {
    return {
      currentStep: this.currentStepIndex,
      totalSteps: this.getTotalSteps(),
      isFirstStep: this.isFirstStep(),
      isLastStep: this.isLastStep(),
      canGoNext: !this.isLastStep(),
      canGoPrev: !this.isFirstStep()
    }
  }

  /**
   * Get progress percentage
   * @returns {number} - 0-100
   */
  getProgress() {
    if (this.getTotalSteps() === 0) {
      return 0
    }
    return Math.round(((this.currentStepIndex + 1) / this.getTotalSteps()) * 100)
  }

  /**
   * Cleanup
   */
  destroy() {
    this.onStepChangeCallbacks = []
    this.stepData = {}
  }
}
