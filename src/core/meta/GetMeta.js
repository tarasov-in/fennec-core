/**
 * Metadata access functions
 * Migrated from Tool/index.js
 */

/**
 * Recursively unwraps metadata - resolves functions to get actual metadata object
 * @param {Object|Function} meta - Metadata object or function returning metadata
 * @returns {Object} Unwrapped metadata object
 */
export function GetMeta(meta) {
  if (meta && meta !== null && typeof meta === "function") {
    let m = meta()
    if (m && m !== null && typeof m === "function") {
      return GetMeta(m)
    } else if (typeof m === "object") {
      return m
    }
  }
  return meta
}
