/**
 * Query parameter building functions
 * Migrated from Tool/index.js
 */

import _ from 'lodash'

/**
 * Combines multiple query parameters into a single query string
 * @param {Array} queryParams - Array of query parameter strings or functions
 * @returns {string} Combined query string
 */
export const QueryParams = (queryParams) => {
  let ext = ""
  if (queryParams) {
    for (let i = 0; i < queryParams.length; i++) {
      const param = queryParams[i]
      if (_.isString(param)) {
        ext += (!ext) ? param : '&' + param
      } else if (_.isFunction(param)) {
        ext += (!ext) ? param() : '&' + param()
      }
    }
  }
  return ext
}

/**
 * Creates a function-based query parameter
 * @param {string} func - Function name
 * @param {string} name - Field name
 * @returns {string} Query parameter string
 */
export const QueryFunc = (func, name) => {
  return `f-${func}-${name}`
}

/**
 * Creates a simple query parameter
 * @param {string} name - Parameter name
 * @param {any} value - Parameter value
 * @returns {string} Query parameter string
 */
export const QueryParam = (name, value) => {
  return `${name}=${value}`
}

/**
 * Creates a sorting query parameter
 * @param {string} name - Field name to sort by
 * @param {string} value - Sort direction (asc/desc)
 * @returns {string} Query parameter string
 */
export const QueryOrder = (name, value) => {
  return `s-${name}=${value}`
}

/**
 * Creates a detail level query parameter
 * @param {string} value - Detail level value
 * @returns {string} Query parameter string
 */
export const QueryDetail = (value) => {
  return QueryParam("detail", (value) ? value : "none")
}

/**
 * Converts object to array of query parameters
 * @param {Object} object - Object to convert
 * @param {string} method - Query method (optional)
 * @returns {Array} Array of query parameter strings
 */
export const ObjectToQueryParam = (object, method) => {
  let f = []
  let array = Object.entries(object)
  for (let i = 0; i < array.length; i++) {
    const element = array[i]
    if (element) {
      let keyName = (element[0].endsWith('ID') === true && element[0].endsWith('.ID') !== true)
        ? element[0].slice(0, -2) + ".ID"
        : element[0]
      f.push(QueryParam(`w-${keyName}`, element[1]))
    }
  }
  return f
}
