/**
 * Functional programming utilities
 * Migrated from Tool/index.js
 */

import _ from 'lodash'

/**
 * Unwraps a value - if it's a function, calls it recursively until non-function
 * If it's not an array and element is falsy, wraps it in an array
 * @param {any} value - Value to unwrap
 * @param {boolean} element - If true, doesn't wrap in array
 * @returns {any} Unwrapped value
 */
export const unwrap = (value, element) => {
  if (_.isFunction(value) == true) {
    return unwrap(value())
  } else if (_.isArray(value)) {
    return value
  }
  return (!element) ? [value] : value
}

/**
 * Cleans array by removing null and undefined values
 * @param {any} value - Value to clean (array or single value)
 * @param {boolean} element - If true, doesn't wrap in array
 * @returns {Array|any} Cleaned value
 */
export const clean = (value, element) => {
  if (_.isArray(value)) {
    return value?.filter(e => e !== null && e !== undefined)
  }
  return (!element) ? [value]?.filter(e => e !== null && e !== undefined) : value
}

/**
 * Conditional execution - returns truthful if all equations are truthy
 * @param {any} equations - Conditions to check
 * @param {any} truthful - Value to return if conditions are true
 * @returns {any} Truthful value or undefined
 */
export const If = (equations, truthful) => {
  return (And(equations)) ? unwrap(truthful, true) : undefined
}

/**
 * Conditional execution - returns truthful or untruthful based on equations
 * @param {any} equations - Conditions to check
 * @param {any} truthful - Value to return if conditions are true
 * @param {any} untruthful - Value to return if conditions are false
 * @returns {any} Truthful or untruthful value
 */
export const IfElse = (equations, truthful, untruthful) => {
  return (And(equations)) ? unwrap(truthful, true) : unwrap(untruthful, true)
}

/**
 * Logical AND of all arguments
 * @param {Array|any} args - Arguments to AND together
 * @returns {boolean} True if all arguments are truthy
 */
export const And = (args) => {
  var acc = true
  let unwraped = unwrap(args)
  for (let i = 0; i < unwraped.length; i++) {
    const element = unwraped[i]
    acc = acc && element
    if (!acc) break
  }
  return acc
}

/**
 * Logical OR of all arguments
 * @param {Array|any} args - Arguments to OR together
 * @returns {boolean} True if any argument is truthy
 */
export const Or = (args) => {
  var acc = true
  let unwraped = unwrap(args)
  for (let i = 0; i < unwraped.length; i++) {
    const element = unwraped[i]
    acc = acc || element
  }
  return acc
}

/**
 * Uncapitalizes first letter of string
 * @param {string} str - String to uncapitalize
 * @returns {string} String with lowercase first letter
 */
export const uncapitalize = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
