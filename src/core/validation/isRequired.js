/**
 * Validation helpers
 * Migrated from Tool/index.js
 */

/**
 * Checks if field is required based on validators
 * @param {Object} item - Field definition with validators
 * @returns {boolean} True if field is required
 */
export function isRequired(item) {
  if (item && item.validators) {
    return item.validators.required || item.required
  }
  return false
}
