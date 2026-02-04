/**
 * Custom validator builder
 * Migrated from Tool/index.js
 */

/**
 * Creates a validator function for form fields
 * @param {Function} func - Validation function that returns boolean
 * @param {string} message - Error message to show on validation failure
 * @returns {Object} Validator object compatible with Ant Design Form
 */
export function validator(func, message) {
  return {
    validator: (_, value) => {
      if (func(value)) {
        return Promise.resolve()
      }
      return Promise.reject(new Error(message))
    }
  }
}
