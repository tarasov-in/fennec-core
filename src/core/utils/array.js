/**
 * Array manipulation utilities
 * Migrated from Tool/index.js
 */

import _ from 'lodash'
import { IfElse } from './functional'

/**
 * Unpacks array field into multiple target fields
 * @param {Object} values - Values object
 * @param {string} field - Field name containing array
 * @param {Array} target - Target field names
 * @returns {Object} Values with unpacked fields
 */
export const arrayUnpack = (values, field, target) => {
  var f = values[field]
  delete values[field]
  if (target && values) {
    for (let i = 0; i < target.length; i++) {
      values[target[i]] = f[i]
    }
  }
  return values
}

/**
 * Ensures value is an array
 * @param {any} array - Unused parameter (legacy)
 * @param {any} item - Value to ensure is array
 * @returns {Array} Array
 */
export const upgradeInArray = (array, item) => {
  if (!item) return item
  if (_.isArray(item)) {
    return item
  }
  return [item]
}

/**
 * Adds or updates item in array by ID
 * @param {Array} array - Source array
 * @param {Object} item - Item to add/update
 * @param {boolean} first - If true, prepend instead of append
 * @returns {Array} Updated array
 */
export const updateInArray = (array, item, first) => {
  if (!array) array = []
  if (!item || !item.ID) return array
  if (_.findIndex(array, { ID: item.ID }) >= 0) {
    return array?.map(e => IfElse(e.ID === item.ID, item, e))
  } else {
    return (first) ? [item, ...array] : [...array, item]
  }
}

/**
 * Alias for updateInArray
 */
export const createInArray = (array, item) => {
  return updateInArray(array, item)
}

/**
 * Removes item from array by ID
 * @param {Array} array - Source array
 * @param {Object} item - Item to remove
 * @returns {Array} Updated array
 */
export const deleteInArray = (array, item) => {
  if (!array) array = []
  if (!item || !item.ID) return array
  return array?.filter(e => e.ID !== item.ID)
}

/**
 * Toggles item in array - adds if not present, removes if present
 * @param {Array} array - Source array
 * @param {Object} item - Item to toggle
 * @returns {Array} Updated array
 */
export const triggerInArray = (array, item) => {
  if (array.find(x => x.ID === item.ID) !== undefined) {
    return deleteInArray(array, item)
  } else {
    return updateInArray(array, item)
  }
}

/**
 * Returns empty array
 * @returns {Array} Empty array
 */
export const emptyInArray = (array, item) => {
  return []
}

/**
 * Returns undefined
 * @returns {undefined}
 */
export const undefinedInArray = (array, item) => {
  return undefined
}

// Batch operations with arrays of items

/**
 * Updates multiple items in array
 * @param {Array} array - Source array
 * @param {Object|Array} item - Item or array of items to update
 * @returns {Array} Updated array
 */
export const updateArrayInArray = (array, item) => {
  if (!array) array = []
  if (_.isArray(item)) {
    let tmp = [...array]
    for (let i = 0; i < item.length; i++) {
      const it = item[i]
      tmp = updateInArray(tmp, it)
    }
    return tmp
  } else {
    return updateInArray(array, item)
  }
}

/**
 * Alias for updateArrayInArray
 */
export const createArrayInArray = (array, item) => {
  return updateArrayInArray(array, item)
}

/**
 * Deletes multiple items from array
 * @param {Array} array - Source array
 * @param {Object|Array} item - Item or array of items to delete
 * @returns {Array} Updated array
 */
export const deleteArrayInArray = (array, item) => {
  if (!array) array = []
  if (_.isArray(item)) {
    let tmp = [...array]
    for (let i = 0; i < item.length; i++) {
      const it = item[i]
      tmp = deleteInArray(tmp, it)
    }
    return tmp
  } else {
    return deleteInArray(array, item)
  }
}

/**
 * Toggles multiple items in array
 * @param {Array} array - Source array
 * @param {Object|Array} item - Item or array of items to toggle
 * @returns {Array} Updated array
 */
export const triggerArrayInArray = (array, item) => {
  if (!array) array = []
  if (_.isArray(item)) {
    let tmp = [...array]
    for (let i = 0; i < item.length; i++) {
      const it = item[i]
      tmp = triggerInArray(tmp, it)
    }
    return tmp
  } else {
    return triggerInArray(array, item)
  }
}
