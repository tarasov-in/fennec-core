/**
 * Filter building and conversion functions
 * Migrated from Tool/index.js
 */

import _ from 'lodash'

/**
 * Converts item object to query string
 * @param {Object} item - Object with field-value pairs
 * @returns {string} Query string
 */
export const queryFilterByItem = (item) => {
  if (!item) return []
  let query = []
  for (const key in item) {
    if (Object.hasOwnProperty.call(item, key)) {
      const value = item[key]
      let keyName = (key.endsWith('ID') === true && key.endsWith('.ID') !== true)
        ? key.slice(0, -2) + ".ID"
        : key
      if (value) {
        query.push("w-" + keyName + "=" + value)
      }
    }
  }
  return query.join("&")
}

/**
 * Checks if element matches filter criteria
 * @param {Object} item - Filter criteria
 * @param {Object} element - Element to check
 * @returns {boolean} True if element matches
 */
export const filterByItem = (item, element) => {
  for (const key in item) {
    if (Object.hasOwnProperty.call(item, key)) {
      const value = item[key]
      if (element[key] === value) {
        return true
      }
    }
  }
  return false
}

/**
 * Converts filters UI state to URL query parameters
 * @param {Array} filters - Filter definitions
 * @param {Object} filter - Current filter values
 * @param {Object} sorting - Sorting configuration { name, order }
 * @param {number} page - Page number
 * @param {number} count - Items per page
 * @returns {Object} Query parameters object
 */
export function FilterToQueryParameters(filters, filter, sorting, page, count) {
  let flt = {}
  Object.keys(filter).forEach(key => {
    var item = filters?.find(e => e.name == key)

    let filterByKey = filter[key]
    switch (item.filterType) {
      case "group":
        switch (item.type) {
          case "object":
          case "document":
            flt["w-in-" + key] = (filterByKey && filterByKey.length && filterByKey.join) ? filterByKey.join(",") : filterByKey
            break
          default:
            flt["w-in-" + key] = (filterByKey && filterByKey.length && filterByKey.join) ? filterByKey.join(",") : filterByKey
            break
        }
        break
      case "range":
        switch (item.type) {
          case "int":
          case "uint":
          case "integer":
          case "int64":
          case "int32":
          case "uint64":
          case "uint32":
            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
              flt["w-lge-" + key] = filterByKey[0]
              flt["w-lwe-" + key] = filterByKey[1]
            }
            break
          case "double":
          case "float":
          case "float64":
          case "float32":
            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
              flt["w-lge-" + key] = filterByKey[0]
              flt["w-lwe-" + key] = filterByKey[1]
            }
            break
          case "time":
            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
              flt["w-lge-" + key] = filterByKey[0].format("HH:mm:ss")
              flt["w-lwe-" + key] = filterByKey[1].format("HH:mm:ss")
            }
            break
          case "date":
            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
              flt["w-lge-" + key] = filterByKey[0].format("YYYY-MM-DD")
              flt["w-lwe-" + key] = filterByKey[1].format("YYYY-MM-DD")
            }
            break
          case "datetime":
          case "time.Time":
            if (_.isArray(filterByKey) && filterByKey.length >= 2) {
              flt["w-lge-" + key] = filterByKey[0].format("YYYY-MM-DD HH:mm")
              flt["w-lwe-" + key] = filterByKey[1].format("YYYY-MM-DD HH:mm")
            }
            break
          default:
            flt["w-" + key] = filterByKey
            break
        }
        break
      default:
        switch (item.type) {
          case "string":
            flt["w-co-" + key] = filterByKey
            break
          default:
            flt["w-" + key] = filterByKey
            break
        }
        break
    }
  })

  let srt = {}
  if (sorting?.name) {
    srt[`s-${sorting.name}`] = sorting.order
  }

  let pc = {
    page: page,
    count: count,
  }

  return { ...flt, ...srt, ...pc }
}

/**
 * Converts URL query parameters to filters UI state
 * @param {URLSearchParams} urlRequestParameters - URL search parameters
 * @param {Array} filters - Filter definitions
 * @returns {Array} Filters with applied values
 */
export function QueryParametersToFilters(urlRequestParameters, filters) {
    let flt = [...filters]
    for (let i = 0; i < flt.length; i++) {
        const item = flt[i];

        function set(item, flt, i, s) {
            let v = urlRequestParameters.get(`${s}${item.name}`)
            if (v) {
                flt[i].filtered = v;
            }
        }
        function setin(item, flt, i, s) {
            let v = urlRequestParameters.get(`${s}${item.name}`)
            if (v) {
                flt[i].filtered = (v && v.split) ? v.split(",").map((val) => {
                    let nval = parseInt(val)
                    if (!isNaN(nval)) {
                        return nval;
                    }

                    return val;
                }) : v;
            }
        }
        function seta(item, flt, i, s1, s2) {
            let v1 = urlRequestParameters.get(`${s1}${item.name}`)
            let v2 = urlRequestParameters.get(`${s2}${item.name}`)
            if (v1 && v2) {
                flt[i].filtered = [v1, v2];
            }
        }
        function setm(item, flt, i, s1, s2, format) {
            let v1 = urlRequestParameters.get(`${s1}${item.name}`)
            let v2 = urlRequestParameters.get(`${s2}${item.name}`)
            if (v1 && v2) {
                flt[i].filtered = [dayjs(v1), dayjs(v2)];
            }
        }
        switch (item.filterType) {
            case "group":
                switch (item.type) {
                    case "object":
                    case "document":
                        setin(item, flt, i, "w-in-");
                        break;
                    default:
                        setin(item, flt, i, "w-in-");
                        break;
                }
                break;
            case "range":
                switch (item.type) {
                    case "int":
                    case "uint":
                    case "integer":
                    case "int64":
                    case "int32":
                    case "uint64":
                    case "uint32":
                        seta(item, flt, i, "w-lge-", "w-lwe-");
                        break;
                    case "double":
                    case "float":
                    case "float64":
                    case "float32":
                        seta(item, flt, i, "w-lge-", "w-lwe-");
                        break;
                    case "time":
                        setm(item, flt, i, "w-lge-", "w-lwe-", "HH:mm:ss");
                        break;
                    case "date":
                        setm(item, flt, i, "w-lge-", "w-lwe-", "YYYY-MM-DD");
                        break;
                    case "datetime":
                    case "time.Time":
                        setm(item, flt, i, "w-lge-", "w-lwe-", "YYYY-MM-DD HH:mm");
                        break;
                    default:
                        set(item, flt, i, "w-");
                        break;
                }
                break;
            default:
                switch (item.type) {
                    case "string":
                        set(item, flt, i, "w-co-");
                        break;
                    default:
                        set(item, flt, i, "w-");
                        break;
                }
                break;
        }
    }

    for (let i = 0; i < flt.length; i++) {
        const item = flt[i];
        let v = urlRequestParameters.get(`s-${item.name}`)
        if (v) {
            flt[i].sorted = v;
        }
    }

    // for (let i = 0; i < flt.length; i++) {
    //     const item = flt[i];
    //     let v = urlRequestParameters.get(`f-max-${item.name}`)
    //     flt[i].func = ["max"]
    // }
    return flt
}