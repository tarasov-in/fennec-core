/**
 * Form item rules builder
 * Migrated from Tool/index.js
 */

import _ from 'lodash'
import { isRequired } from './isRequired'
import { validator } from './validator'

/**
 * Generates validation rules for form fields based on field definition
 * @param {Object} item - Field definition with validators
 * @returns {Array} Array of validation rules
 *
 * Supports validators object format:
 * {
 *   required: true,
 *   min: null,
 *   max: null,
 *   email: false,
 *   url: false,
 *   len: null,
 *   pattern: null
 * }
 *
 * Or array format with custom validators:
 * [
 *   { func: (value) => value > 0, message: "Must be positive" },
 *   { required: true }
 * ]
 */
export function formItemRules(item) {
  let res = []

  if (item && item.validators) {
    // Array format - custom validators
    if (_.isArray(item.validators)) {
      for (let i = 0; i < item.validators.length; i++) {
        const _validator = item.validators[i]
        if (_validator.func) {
          res.push(
            validator(_validator.func, _validator.message),
          )
        } else {
          res.push(_validator)
        }
      }
    }
    // Object format - standard validators
    else if (_.isObject(item.validators)) {
      // Required validator
      if (isRequired(item) === true) {
        res.push({
          required: true,
          message: 'Укажите ' + item.label.toLowerCase() + '!'
        })
      }

      // Email validator
      if (item?.validators?.email !== undefined &&
          item?.validators?.email !== null &&
          item?.validators?.email === true) {
        res.push({
          type: "email",
          message: `Значение должно быть адресом электронной почты!`
        })
      }

      // URL validator
      if (item?.validators?.url !== undefined &&
          item?.validators?.url !== null &&
          item?.validators?.url === true) {
        res.push({
          type: "url",
          message: `Значение должно URL адресом (начинается с http:// или https:// )!`
        })
      }

      // Max length/value validator
      if (item?.validators?.max !== undefined && item?.validators?.max !== null) {
        res.push({
          type: (item?.type == "string" || item?.type == "text") ? "string" : "number",
          max: item?.validators?.max,
          message: `Значение должно быть не больше ${item?.validators?.max}${(item?.type == "string") ? " символов" : ""}!`
        })
      }

      // Min length/value validator
      if (item?.validators?.min !== undefined && item?.validators?.min !== null) {
        res.push({
          type: (item?.type == "string" || item?.type == "text") ? "string" : "number",
          min: item?.validators?.min,
          message: `Значение должно быть не меньше ${item?.validators?.min}${(item?.type == "string") ? " символов" : ""}!`
        })
      }

      // Pattern validator
      if (item?.validators?.pattern) {
        res.push({
          pattern: item?.validators?.pattern,
          message: `Значение должно соответствовать шаблону ${item?.validators?.pattern}!`
        })
      }
    }
  }

  return res
}
