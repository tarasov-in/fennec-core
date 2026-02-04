/**
 * ActionModalCore - UI-Agnostic Modal State Management
 *
 * Handles modal open/close logic, visibility state, scroll locking, and history
 * Independent of UI library - works with any modal implementation
 *
 * @version 2.1.0
 */

import { pushStateHistoryModal } from '../../../Tool'

export class ActionModalCore {
  constructor(props = {}) {
    this.props = props
    this.opened = props.visible !== undefined ? props.visible : false
    this.controlled = props.visible !== undefined
    this.onOpenCallbacks = []
    this.onCloseCallbacks = []
  }

  /**
   * Check if modal is controlled by parent component
   * @returns {boolean}
   */
  isControlled() {
    return this.controlled
  }

  /**
   * Check if modal is currently opened
   * @returns {boolean}
   */
  isOpened() {
    return this.opened
  }

  /**
   * Open modal
   * Handles scroll locking and history push
   * @param {Object} options - Optional configuration
   * @returns {boolean} - Success
   */
  open(options = {}) {
    // Controlled mode - cannot open from inside
    if (this.controlled) {
      return false
    }

    // Already opened
    if (this.opened) {
      return false
    }

    this.opened = true

    // Notify callbacks
    this.onOpenCallbacks.forEach(callback => callback())

    // Push to history for back button support
    if (!options.skipHistory) {
      pushStateHistoryModal()
    }

    return true
  }

  /**
   * Close modal
   * Handles scroll unlocking and optional callback
   * @param {Object} options - Configuration
   * @param {boolean} options.skipCallback - Skip calling close callback
   * @returns {boolean} - Success
   */
  close(options = {}) {
    // Controlled mode - cannot close from inside
    if (this.controlled) {
      return false
    }

    // Already closed
    if (!this.opened) {
      return false
    }

    this.opened = false

    // Notify callbacks
    if (!options.skipCallback) {
      this.onCloseCallbacks.forEach(callback => callback())
    }

    return true
  }

  /**
   * Toggle modal state
   * @returns {boolean} - New state
   */
  toggle() {
    if (this.opened) {
      this.close()
    } else {
      this.open()
    }
    return this.opened
  }

  /**
   * Update controlled state from props
   * @param {boolean} visible - New visibility state
   */
  updateControlledState(visible) {
    if (this.controlled) {
      this.opened = visible
    }
  }

  /**
   * Register callback for open event
   * @param {Function} callback
   * @returns {Function} - Unregister function
   */
  onOpen(callback) {
    this.onOpenCallbacks.push(callback)
    return () => {
      this.onOpenCallbacks = this.onOpenCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Register callback for close event
   * @param {Function} callback
   * @returns {Function} - Unregister function
   */
  onClose(callback) {
    this.onCloseCallbacks.push(callback)
    return () => {
      this.onCloseCallbacks = this.onCloseCallbacks.filter(cb => cb !== callback)
    }
  }

  /**
   * Get all props for modal rendering
   * @returns {Object}
   */
  getModalProps() {
    return {
      visible: this.opened,
      onClose: () => this.close(),
      onCancel: () => this.close()
    }
  }

  /**
   * Get trigger props
   * @param {Object} customProps - Custom trigger props
   * @returns {Object}
   */
  getTriggerProps(customProps = {}) {
    const { disabled, readonly } = this.props

    return {
      onClick: () => {
        if (!disabled && !readonly) {
          this.open()
        }
      },
      disabled: disabled || readonly,
      ...customProps
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.onOpenCallbacks = []
    this.onCloseCallbacks = []
  }
}
