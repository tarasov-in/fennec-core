/**
 * Display and formatting utilities
 * Migrated from Tool/index.js
 */

import _ from 'lodash'
import dayjs from 'dayjs'
import { getObjectValue } from './object'
import { uncapitalize } from './functional'

/**
 * Gets display representation of object by metadata name
 * @param {Object} data - Object data
 * @param {string} name - Metadata object name
 * @param {Object} meta - Full metadata registry
 * @returns {string} Display representation
 */
export function getObjectDisplay(data, name, meta) {
  if (!name || !meta || !data) return undefined

  const display = (display) => {
    if (display?.fields) {
      return display
    }
  }

  const metaObject = meta[name]
  return getDisplay(data, display(metaObject?.display), metaObject, meta)
}

/**
 * Gets display representation of object by property metadata
 * @param {Object} data - Object data
 * @param {Object} propertyMeta - Property metadata
 * @param {Object} meta - Full metadata registry
 * @returns {string} Display representation
 */
export function getFieldDisplay(data, propertyMeta, meta) {
  if (!propertyMeta || !meta || !data) return undefined

  const display = (display) => {
    if (display?.fields) {
      return display
    }
  }

  const metaObject = meta[getObjectValue(propertyMeta, "relation.reference.object")]
  return getDisplay(data, display(propertyMeta?.relation?.display) || display(metaObject?.display), metaObject, meta)
}

/**
 * Gets display representation of object using display structure
 * @param {Object} data - Object data
 * @param {Object} display - Display structure with fields array
 * @param {Object} metaObject - Metadata object
 * @param {Object} meta - Full metadata registry
 * @returns {string} Display representation
 */
export function getDisplay(data, display, metaObject, meta) {
  var result = ""

  if (!data) {
    return result
  }

  if (!display || !display.fields) {
    return result
  }

  var sep = ""
  if (display.sep) {
    sep = display.sep
  }

  for (var i = 0; i < display.fields.length; i++) {
    // Получили поле, получили значение поля
    var field = display.fields[i]

    var name_field = field.value.split(".")?.map((e) => uncapitalize(e)).join(".")

    var value_field = getObjectValue(data, name_field)

    // Import metaGetFieldByName from meta helpers
    const { metaGetFieldByName } = require('../meta/helpers')

    if (_.isObject(value_field)) {
      value_field = getDisplay(value_field, metaGetFieldByName(metaObject, meta, name_field)?.relation?.display, metaObject, meta)
      if (!value_field) {
        var subMeta = meta[metaGetFieldByName(metaObject, meta, name_field)?.relation?.reference?.object]
        value_field = getDisplay(getObjectValue(data, name_field), subMeta?.display, subMeta, meta)
      }
    }

    // Если задан объект meta, пытаемся отформатировать поле в соответствии с типом
    var metaField = metaGetFieldByName(metaObject, meta, name_field)

    if (metaField && metaField.type) {
      value_field = getFormatFieldValueTableView(value_field, metaField.type, metaField)
    }

    if (value_field) {
      result += ((field.prefix) || "") + value_field + ((field.suffix) || "")

      if (i < display.fields.length - 1) {
        result += sep
      }
    }
  }

  return result
}

/**
 * Checks if type is numeric
 * @param {string} type - Field type
 * @returns {boolean} True if type is numeric
 */
export function typeIsNumber(type) {
  return (type === "int" ||
    type === "integer" ||
    type === "long" ||
    type === "double" ||
    type === "bigdecimal")
}

/**
 * Formats field value for table display
 * @param {any} data - Field value
 * @param {string} type - Field type
 * @param {Object} meta - Field metadata
 * @returns {string} Formatted value
 */
export function getFormatFieldValueTableView(data, type, meta) {
  if (type === "boolean" || type === "bool") {
    var trueValue = getObjectValue(meta, "booleanPresenter.trueValue") || "Да"
    var falseValue = getObjectValue(meta, "booleanPresenter.falseValue") || "Нет"
    return data ? trueValue : falseValue
  }

  if (!data) {
    return ''
  }

  if (type === "timestamp" || type === "datetime" || type == "localdatetime") {
    var mDate = dayjs(data)
    if (mDate && mDate.isValid()) {
      return mDate.format("DD.MM.YYYY HH:mm:ss")
    }
  } else if (type === "date" || type == "localdate") {
    var mDate = dayjs(data)
    if (mDate && mDate.isValid()) {
      return mDate.format("DD.MM.YYYY")
    }
  } else if (type === "time" || type === "localtime") {
    var mDate = ''
    if (data.length <= 8) {
      mDate = dayjs(data, "HH:mm:ss")
    } else if (data.length > 8) {
      mDate = dayjs(data)
    }

    if (mDate && mDate.isValid()) {
      return mDate.format("HH:mm:ss")
    }
  } else if (type === "int" || type === "uint" ||
    type === "integer" ||
    type === "long") {
    return priceFormat(data)
  } else if (type === "double" ||
    type === "bigdecimal" || type === "float") {
    return priceFormat(data, 2)
  } else {
    return data
  }

  return ''
}

/**
 * Formats number as price with locale formatting
 * @param {number|string} price - Price value
 * @param {number} precision - Decimal precision (default: 0)
 * @returns {string} Formatted price
 */
export function priceFormat(price, precision) {
  if (!price) {
    price = 0
  }

  if (typeof (price) === "string") {
    price = Number.parseFloat(price.trim().replace(" ", "").replace(",", "."))
  }

  if (!precision) {
    precision = 0
  }

  return Number(price.toFixed(precision)).toLocaleString('ru', { minimumFractionDigits: precision })
}
