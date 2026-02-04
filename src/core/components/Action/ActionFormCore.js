/**
 * ActionFormCore - UI-Agnostic Form State Management
 *
 * Handles form values, change detection, validation,
 * and data transformation (modify function, FormData)
 *
 * @version 2.1.0
 */

import { makeFormData } from '../../../Tool'

export class ActionFormCore {
  constructor(props = {}) {
    this.props = props
    this.initialValues = props.object || {}
    this.currentValues = { ...this.initialValues }
    this.changedFields = new Set()
    this.onChangeCallbacks = []
  }

  /**
   * Get initial form values
   * @returns {Object}
   */
  getInitialValues() {
    return { ...this.initialValues }
  }

  /**
   * Get current form values
   * @returns {Object}
   */
  getCurrentValues() {
    return { ...this.currentValues }
  }

  /**
   * Update form values
   * @param {Object} values - New values
   */
  setValues(values) {
    this.currentValues = { ...values }
    this.detectChanges()
    this.notifyChange()
  }

  /**
   * Update single field value
   * @param {string} fieldName
   * @param {*} value
   */
  setFieldValue(fieldName, value) {
    this.currentValues[fieldName] = value
    this.detectChanges()
    this.notifyChange()
  }

  /**
   * Get value of specific field
   * @param {string} fieldName
   * @returns {*}
   */
  getFieldValue(fieldName) {
    return this.currentValues[fieldName]
  }

  /**
   * Check if form has been modified
   * @returns {boolean}
   */
  isFormChanged() {
    return this.changedFields.size > 0
  }

  /**
   * Check if specific field has been modified
   * @param {string} fieldName
   * @returns {boolean}
   */
  isFieldChanged(fieldName) {
    return this.changedFields.has(fieldName)
  }

  /**
   * Get list of changed fields
   * @returns {Array<string>}
   */
  getChangedFields() {
    return Array.from(this.changedFields)
  }

  /**
   * Detect changes between initial and current values
   */
  detectChanges() {
    this.changedFields.clear()

    Object.keys(this.currentValues).forEach(key => {
      const initialValue = this.initialValues[key]
      const currentValue = this.currentValues[key]

      if (this.isValueDifferent(initialValue, currentValue)) {
        this.changedFields.add(key)
      }
    })

    // Check for removed fields
    Object.keys(this.initialValues).forEach(key => {
      if (!(key in this.currentValues)) {
        this.changedFields.add(key)
      }
    })
  }

  /**
   * Compare two values for equality
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  isValueDifferent(a, b) {
    // Same reference
    if (a === b) {
      return false
    }

    // Different types
    if (typeof a !== typeof b) {
      return true
    }

    // null or undefined
    if (a == null || b == null) {
      return a !== b
    }

    // Arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return true
      }
      return a.some((item, index) => this.isValueDifferent(item, b[index]))
    }

    // Objects
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)

      if (keysA.length !== keysB.length) {
        return true
      }

      return keysA.some(key => this.isValueDifferent(a[key], b[key]))
    }

    // Primitives
    return a !== b
  }

  /**
   * Reset form to initial values
   */
  reset() {
    this.currentValues = { ...this.initialValues }
    this.changedFields.clear()
    this.notifyChange()
  }

  /**
   * Apply modify function if provided
   * @param {Object} values - Input values
   * @returns {Object} - Modified values
   */
  applyModify(values) {
    const { modify } = this.props

    if (modify && typeof modify === 'function') {
      return modify(values)
    }

    return values
  }

  /**
   * Convert values to FormData if needed
   * @param {Object} values - Input values
   * @returns {FormData|Object}
   */
  toFormData(values) {
    const { isFormData } = this.props

    if (isFormData) {
      return makeFormData(values)
    }

    return values
  }

  /**
   * Prepare values for submission
   * Applies modify and FormData transformation
   * @param {Object} values - Raw form values
   * @returns {FormData|Object}
   */
  prepareForSubmit(values) {
    const modifiedValues = this.applyModify(values)
    return this.toFormData(modifiedValues)
  }

  /**
   * Check if OK button should be disabled
   * @returns {boolean}
   */
  isSubmitDisabled() {
    const { disabledOkOnUncahngedForm, readonly, disabled } = this.props

    // Explicitly disabled or readonly
    if (disabled || readonly) {
      return true
    }

    // Disable if form unchanged and flag is set
    if (disabledOkOnUncahngedForm && !this.isFormChanged()) {
      return true
    }

    return false
  }

  /**
   * Validate form (stub for future validation)
   * @returns {Object} - { valid: boolean, errors: Object }
   */
  validate() {
    // TODO: Implement validation logic
    return {
      valid: true,
      errors: {}
    }
  }

  /**
   * Register callback for value changes
   * @param {Function} callback
   * @returns {Function} - Unregister function
   */
  onChange(callback) {
    this.onChangeCallbacks.push(callback)
    return () => {
      this.onChangeCallbacks = this.onChangeCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Notify change callbacks
   */
  notifyChange() {
    this.onChangeCallbacks.forEach(callback => {
      callback(this.currentValues, this.changedFields)
    })
  }

  /**
   * Check if Ant Form should be used
   * @returns {boolean}
   */
  shouldUseAntForm() {
    return this.props.noAntForm !== true
  }

  /**
   * Get props for form rendering
   * @returns {Object}
   */
  getFormProps() {
    return {
      initialValues: this.getInitialValues(),
      values: this.getCurrentValues(),
      onChange: (values) => this.setValues(values)
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.onChangeCallbacks = []
    this.changedFields.clear()
  }
}
