/**
 * Form utilities
 * Migrated from Tool/index.js
 */

import _ from 'lodash'
import {
  upgradeInArray,
  createInArray,
  updateInArray,
  deleteInArray,
  emptyInArray,
  undefinedInArray,
  arrayUnpack
} from './array'

/**
 * Converts values object to FormData for file uploads
 * @param {Object} values - Values object
 * @returns {FormData} FormData instance
 */
export const makeFormData = (values) => {
  const formData = new FormData()
  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      const value = values[key]
      if (_.isArray(value)) {
        value.forEach(item => {
          if (item) {
            formData.append(key, item)
          }
        })
      } else {
        if (value) {
          formData.append(key, value)
        }
      }
    }
  }
  return formData
}

/**
 * Unpacks special form fields (starting with @)
 * @param {Object} form - Ant Design form instance
 * @param {Object} values - Form values
 * @returns {Object} Values with unpacked fields
 */
export const unpackFormFields = (form, values) => {
  if (!form) return values
  var fields = form.getFieldsValue()
  for (var name in fields) {
    if (name.startsWith("@")) {
      var flds = form?.getFieldInstance(name)?.props?.fields
      values = arrayUnpack(values, name, flds)
    }
  }
  return values
}

/**
 * Prevents default event and stops propagation
 * @param {Event} e - Event object
 */
export const preventDefault = (e) => {
  e.preventDefault()
  e.stopPropagation()
}

/**
 * Executes event handler with values and context
 * @param {Function} event - Event handler function
 * @param {Object} values - Values object
 * @param {Object} context - Context object
 * @returns {Object} Modified values or original values
 */
export const eventExecution = (event, values, context) => {
  if (!event) return values
  return event(values, context) || values
}

/**
 * Detects and returns mutation function by name or returns provided function
 * @param {string|Function} mutation - Mutation name or function
 * @returns {Function} Mutation function
 */
export const detectMutation = (mutation) => {
  if (_.isFunction(mutation)) {
    return mutation
  } else if (_.isString(mutation)) {
    switch (mutation) {
      case "upgrade": return upgradeInArray
      case "create": return createInArray
      case "update": return updateInArray
      case "delete": return deleteInArray
      case "empty": return emptyInArray
      case "undefined": return undefinedInArray
      default:
        return updateInArray
    }
  }
  return updateInArray
}
