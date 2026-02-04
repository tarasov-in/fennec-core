/**
 * Metadata helper functions
 * Migrated from Tool/index.js
 */

import _ from 'lodash'

/**
 * Creates a deep clone of metadata object by name
 * @param {string} objectName - Name of metadata object
 * @param {Object} meta - Full metadata registry
 * @returns {Object} Cloned metadata object
 */
export function metaGetCloneObject(objectName, meta) {
  return _.cloneDeep(meta[objectName])
}

/**
 * Gets a field definition by name from metadata object (supports nested paths)
 * @param {string|Object} metaObject - Metadata object or object name
 * @param {Object} meta - Full metadata registry
 * @param {string|Array} fieldName - Field name or path (e.g., "user.role.name")
 * @returns {Object} Field definition
 */
export function metaGetFieldByName(metaObject, meta, fieldName) {
  // Если передали имя объекта метаданых, то извлекаем сам объект
  if (typeof (metaObject) === "string") {
    var metaObject = metaGetCloneObject(metaObject, meta)
  } else if (typeof (metaObject) !== "object") {
    return
  }

  if (!_.get(metaObject, "properties.length") || !fieldName) {
    return
  }

  if (typeof (fieldName) === "string") {
    fieldName = fieldName.split(".")
  }

  if (!fieldName.length || fieldName.length < 1) {
    return
  }

  for (var tag in metaObject.properties) {
    if (metaObject.properties[tag].name?.toLowerCase() === fieldName[0].toLowerCase()) {
      // Если сейчас не последняя часть fieldName
      if (fieldName.length > 1) {
        // Если текущая часть является объектом
        var subObjectName = _.get(metaObject, "properties[" + tag + "].relation.reference.object")
        if (subObjectName) {
          return metaGetFieldByName(meta[subObjectName], meta, fieldName.slice(1))
        } else {
          console.error("metaGetFieldByName. Не удалось найти " + fieldName + " в объекте " + metaObject.name, metaObject)
          return
        }
      } else {
        return metaObject.properties[tag]
      }
    }
  }
}

/**
 * Returns display fields that support sorting
 * @param {Array} display - Display structure
 * @param {Object} metaObject - Metadata object
 * @param {Object} meta - Full metadata registry
 * @param {string} parent - Parent field path
 * @param {Array} result - Accumulator for results
 * @returns {Array} Array of sortable field paths
 */
export function getSortingDisplayFields(display, metaObject, meta, parent, result) {
  result = result || []
  parent = parent || ""

  if (!display || !display.length || !metaObject) {
    return result
  }

  for (var i = 0; i < display.length; i++) {
    var field = display[i]

    if (!field.sorting) {
      continue
    }

    // uncapitalize function dependency - will be resolved via import
    const uncapitalize = (str) => str.charAt(0).toLowerCase() + str.slice(1)

    var name_field = field.value.split(".")?.map((e) => uncapitalize(e)).join(".")
    var metaField = metaGetFieldByName(metaObject, meta, name_field)

    if (parent) {
      name_field = parent + "." + name_field
    }

    if (_.get(metaField, "relation.reference.object") && meta[metaField.relation.reference.object]) {
      var fieldMeta = meta[metaField.relation.reference.object]
      getSortingDisplayFields(metaField.relation.display || fieldMeta.display, fieldMeta, meta, name_field, result)
    } else {
      result.push(name_field)
    }
  }

  return result
}
