/**
 * Context filter conversion functions
 * Migrated from Tool/index.js
 *
 * Context filters are objects like: { name: "fieldName", value: "fieldValue", method: "eq" }
 * Query filters are strings like: "w-eq-fieldName=fieldValue"
 */

import _ from 'lodash'
import { clean } from '../utils'
import { QueryParam } from './params'

/**
 * Converts context filters array to a plain object
 * @param {Array|Function} contextFilters - Context filters array or function returning array
 * @returns {Object} Object with field names as keys
 */
export const contextFilterToObject = (contextFilters) => {
  let ctxFlt = {}
  if (contextFilters) {
    let ctx = []
    if (_.isFunction(contextFilters)) {
      ctx = clean(contextFilters())
    } else {
      ctx = contextFilters
    }
    if (_.isArray(ctx)) {
      ctx.forEach(item => {
        if (item) {
          let v = queryFiltersToContextFilter(item)
          if (v?.name) {
            ctxFlt[v?.name?.toLowerCase() + ((v?.name && v?.name?.endsWith("ID")) ? "" : "ID")] = v?.value
          }
        }
      })
    }
  }
  return ctxFlt
}

/**
 * Converts a single context filter to query filter format
 * @param {Object|Function|string} item - Context filter item
 * @returns {string} Query filter string
 */
export const contextFilterToQueryFilters = (item) => {
  if (_.isObject(item)) {
    let keyName = (item.name.endsWith('ID') === true && item.name.endsWith('.ID') !== true)
      ? item.name.slice(0, -2) + ".ID"
      : item.name
    return QueryParam("w-" + ((item.method) ? item.method + "-" : "eq-") + keyName, item.value)
  } else if (_.isFunction(item)) {
    return item()
  } else if (_.isString(item)) {
    return item
  }
}

/**
 * Converts context filters array to query filters array
 * @param {Array|Function} contextFilters - Context filters array or function
 * @returns {Array} Array of query filter strings
 */
export const ContextFiltersToQueryFilters = (contextFilters) => {
  let ctxFlt = []
  if (contextFilters) {
    let ctx = []
    if (_.isFunction(contextFilters)) {
      ctx = clean(contextFilters())
    } else {
      ctx = contextFilters
    }
    if (_.isArray(ctx)) {
      ctx.forEach(item => {
        if (item) {
          let v = contextFilterToQueryFilters(item)
          if (v) {
            ctxFlt.push(v)
          }
        }
      })
    }
  }
  return ctxFlt
}

/**
 * Converts a single query filter to context filter format
 * @param {Object|Function|string} item - Query filter item
 * @returns {Object|undefined} Context filter object { name, value }
 */
export const queryFiltersToContextFilter = (item) => {
  if (_.isObject(item) && item?.name) {
    return item
  } else if (_.isFunction(item)) {
    return queryFiltersToContextFilter(item())
  } else if (_.isString(item)) {
    let nameValue = item.split("=")
    if (nameValue.length >= 2) {
      let fieldNameArr = nameValue[0].split("-")
      if (fieldNameArr.length > 1 && fieldNameArr[0] === "w") {
        return {
          name: fieldNameArr[fieldNameArr.length - 1]?.trim(),
          value: nameValue[1]?.trim()
        }
      }
    }
  }
}

/**
 * Converts query filters array to context filters array
 * @param {Array|Function} queryFilters - Query filters array or function
 * @returns {Array} Array of context filter objects
 */
export const QueryFiltersToContextFilters = (queryFilters) => {
  let ctxFlt = []
  if (queryFilters) {
    let ctx = []
    if (_.isFunction(queryFilters)) {
      ctx = clean(queryFilters())
    } else {
      ctx = queryFilters
    }
    if (_.isArray(ctx)) {
      ctx.forEach(item => {
        if (item) {
          let v = queryFiltersToContextFilter(item)
          if (v) {
            ctxFlt.push(v)
          }
        }
      })
    }
  }
  return ctxFlt
}

/**
 * Converts object to context filters array
 * @param {Object} obj - Object to convert
 * @param {string} method - Query method (eq, co, in, etc.)
 * @returns {Array} Array of context filter objects
 */
export const ObjectToContextFilters = (obj, method) => {
  if (!obj) return []
  let contextFilters = []
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      let keyName = key
      if (value) {
        contextFilters.push({ name: keyName, value: value, method: method })
      }
    }
  }
  return contextFilters
}
