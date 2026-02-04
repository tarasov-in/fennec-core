/**
 * Metadata properties manipulation functions
 * Migrated from Tool/index.js
 */

import _ from 'lodash'
import { GetMeta } from './GetMeta'

/**
 * Gets properties array from metadata, optionally excluding specific properties
 * @param {Object|Array} meta - Metadata object or properties array
 * @param {Array} exclude - Array of property names to exclude
 * @returns {Array} Properties array
 */
export function GetMetaProperties(meta, exclude) {
  var xmeta = GetMeta(meta)
  if (typeof xmeta === "object" && !Array.isArray(xmeta)) {
    let p = xmeta.properties
    if (p && exclude) {
      p = p?.filter(e => exclude.findIndex(f => f.toLowerCase() === e.name.toLowerCase()) < 0)
    }
    return p
  } else if (typeof xmeta === "object" && Array.isArray(xmeta)) {
    return xmeta
  } else {
    console.warn("Не удалось определить метаданные из переданного параметра")
  }
}

/**
 * Sets properties in metadata object
 * @param {Object|Array} meta - Metadata object or properties array
 * @param {Array} properties - New properties array
 * @returns {Object|Array} Updated metadata
 */
export function SetMetaProperties(meta, properties) {
  return (meta && _.isArray(meta)) ? properties : { ...meta, properties: properties }
}

/**
 * Gets a specific property from metadata by path (supports nested properties via dot notation)
 * @param {Object} meta - Full metadata object with all entity definitions
 * @param {Object} obj - Current entity metadata object
 * @param {string} path - Property path (e.g., "user.role.name")
 * @returns {Object} Property definition
 */
export function GetMetaPropertyByPath(meta, obj, path) {
  let properties = GetMetaProperties(obj)
  let array = path?.split(".")
  if (array && array.length > 1) {
    for (let i = 0; i < array.length; i++) {
      const element = array[i]
      let property = properties.find(e => e.name.toLowerCase() == element.toLowerCase())
      let nobj = _.get(property, "relation.reference.object")
      let type = _.get(property, "relation.type")
      if (nobj) {
        let mnobj = meta[nobj]
        if (mnobj) {
          return GetMetaPropertyByPath(meta, mnobj, array.slice(1, array.length).join("."))
        }
      }
    }
  } else {
    return properties.find(e => e.name.toLowerCase() == path.toLowerCase())
  }
}
