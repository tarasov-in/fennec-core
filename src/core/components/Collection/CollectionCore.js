/**
 * CollectionCore - Business logic for Collection component
 *
 * Handles data loading, filtering, sorting, pagination,
 * and CRUD operations without any UI dependencies.
 */

import {
  GetMetaPropertyByPath,
  updateInArray,
  deleteInArray,
  ContextFiltersToQueryFilters,
  contextFilterToObject,
  QueryParam,
  QueryFunc,
  QueryDetail
} from '../../utils'

var _ = require('lodash')

export class CollectionCore {
  constructor(props) {
    this.props = props
    this.name = props.name
    this.meta = props.meta
    this.filters = props.filters
    this.contextFilters = props.contextFilters
    this.queryDetail = props.queryDetail
  }

  /**
   * Generates default filters from filter definitions
   * Extracts initial filtered values
   * @param {Array} filters - Filter definitions
   * @returns {Object} Object with field names as keys
   */
  getDefaultFilters(filters) {
    if (!filters || !filters.length) return {}

    let filtr = {}
    for (let d = 0; d < filters.length; d++) {
      const element = filters[d]
      if (element.filtered) {
        filtr = { ...filtr, [element.name]: element.filtered }
      }
    }
    return filtr
  }

  /**
   * Generates default sorting from filter definitions
   * @param {Array} filters - Filter definitions
   * @returns {Object} { name: string, order: 'ASC'|'DESC' }
   */
  getDefaultSorting(filters) {
    let sorted = { name: '', order: 'ASC' }

    if (!filters || !filters.length) return sorted

    for (let s = 0; s < filters.length; s++) {
      const element = filters[s]
      if (element.sorted) {
        sorted.name = element.name
        sorted.order = element.sorted
        break
      }
    }
    return sorted
  }

  /**
   * Builds query parameters for server request
   * @param {Array} filters - Filter metadata
   * @param {Array} contextFilters - Context filters
   * @param {Object} filter - Current filter values
   * @param {Object} sorting - Current sorting { name, order }
   * @param {number} current - Current page
   * @param {number} count - Items per page
   * @param {string} queryDetail - Query detail level
   * @returns {Array} Array of query parameters
   */
  buildQueryParams(filters, contextFilters, filter, sorting, current, count, queryDetail) {
    let ctxFlt = ContextFiltersToQueryFilters(contextFilters)
    let flt = []

    // Build filter parameters
    Object.keys(filter).forEach(key => {
      var item = filters?.find(e => e.name == key)
      var akey = item?.alias || key

      // Additional filters
      if (item?.additionalFilter) {
        let additionalFlt = ContextFiltersToQueryFilters(item?.additionalFilter)
        flt.push(...additionalFlt)
      }

      if (item) {
        let filterByKey = filter[key]
        flt.push(...this.buildFilterByType(item, akey, filterByKey))
      }
    })

    // Build function parameters
    let func = []
    filters?.forEach(item => {
      if (item.func && _.isArray(item.func)) {
        item.func.forEach(fu => {
          func.push(QueryFunc(fu, item.name))
        })
      }
    })

    // Build sorting parameters
    let sort = []
    if (sorting && sorting?.name) {
      sort.push(QueryParam(`s-${sorting.name}`, sorting.order))
    }

    // Combine all parameters
    let params = [
      QueryDetail(queryDetail || 'model'),
      QueryParam(`page`, current),
      QueryParam(`count`, count),
      ...sort,
      ...flt,
      ...func,
      ...ctxFlt
    ]

    return params
  }

  /**
   * Builds filter parameters based on field type and filterType
   * @param {Object} item - Filter metadata
   * @param {string} akey - Alias key
   * @param {any} filterByKey - Filter value
   * @returns {Array} Array of query parameters
   */
  buildFilterByType(item, akey, filterByKey) {
    let flt = []

    switch (item?.filterType) {
      case 'group':
        flt.push(QueryParam('w-in-' + akey, filterByKey))
        break

      case 'range':
        flt.push(...this.buildRangeFilter(item, akey, filterByKey))
        break

      default:
        flt.push(...this.buildDefaultFilter(item, akey, filterByKey))
        break
    }

    return flt
  }

  /**
   * Builds range filter parameters
   * @param {Object} item - Filter metadata
   * @param {string} akey - Alias key
   * @param {any} filterByKey - Filter value (should be array [min, max])
   * @returns {Array} Array of query parameters
   */
  buildRangeFilter(item, akey, filterByKey) {
    let flt = []

    if (!_.isArray(filterByKey) || filterByKey.length < 2) {
      return flt
    }

    switch (item?.type) {
      case 'int':
      case 'uint':
      case 'integer':
      case 'int64':
      case 'int32':
      case 'uint64':
      case 'uint32':
      case 'double':
      case 'float':
      case 'float64':
      case 'float32':
        flt.push(QueryParam('w-lge-' + akey, filterByKey[0]))
        flt.push(QueryParam('w-lwe-' + akey, filterByKey[1]))
        break

      case 'time':
        flt.push(QueryParam('w-lge-' + akey, filterByKey[0].format('HH:mm:ss')))
        flt.push(QueryParam('w-lwe-' + akey, filterByKey[1].format('HH:mm:ss')))
        break

      case 'date':
        flt.push(QueryParam('w-lge-' + akey, filterByKey[0].format('YYYY-MM-DD')))
        flt.push(QueryParam('w-lwe-' + akey, filterByKey[1].format('YYYY-MM-DD')))
        break

      case 'datetime':
      case 'time.Time':
        flt.push(QueryParam('w-lge-' + akey, filterByKey[0].format('YYYY-MM-DD HH:mm')))
        flt.push(QueryParam('w-lwe-' + akey, filterByKey[1].format('YYYY-MM-DD HH:mm')))
        break

      default:
        if (item?.queryComparer) {
          const comparer = _.isFunction(item?.queryComparer)
            ? item?.queryComparer(filterByKey, item)
            : item?.queryComparer
          flt.push(QueryParam(`w-${comparer}-` + akey, filterByKey))
        } else {
          flt.push(QueryParam('w-' + akey, filterByKey))
        }
        break
    }

    return flt
  }

  /**
   * Builds default filter parameters
   * @param {Object} item - Filter metadata
   * @param {string} akey - Alias key
   * @param {any} filterByKey - Filter value
   * @returns {Array} Array of query parameters
   */
  buildDefaultFilter(item, akey, filterByKey) {
    let flt = []

    switch (item?.type) {
      case 'string':
        const comparer = _.isFunction(item?.queryComparer)
          ? item?.queryComparer(filterByKey, item) || 'co'
          : item?.queryComparer || 'co'
        flt.push(QueryParam(`w-${comparer}-` + akey, filterByKey))
        break

      case 'func':
        const prefix = _.isFunction(item?.queryPrefix)
          ? item?.queryPrefix(filterByKey, item) || ''
          : item?.queryPrefix || ''
        flt.push(QueryParam(`${prefix}` + akey, filterByKey))
        break

      default:
        if (item?.queryRaw) {
          const raw = _.isFunction(item?.queryRaw)
            ? item?.queryRaw(filterByKey, item, akey)
            : item?.queryRaw
          flt.push(raw)
        } else if (item?.queryComparer) {
          const comparer = _.isFunction(item?.queryComparer)
            ? item?.queryComparer(filterByKey, item)
            : item?.queryComparer
          flt.push(QueryParam(`w-${comparer}-` + akey, filterByKey))
        } else {
          flt.push(QueryParam('w-' + akey, filterByKey))
        }
        break
    }

    return flt
  }

  /**
   * Enriches filters with metadata
   * @param {Array} propFilters - Filter definitions from props
   * @param {Object} meta - Global metadata
   * @param {Object} mobject - Model object metadata
   * @returns {Array} Enriched filters
   */
  enrichFiltersWithMetadata(propFilters, meta, mobject) {
    if (!propFilters || !meta || !mobject) return propFilters || []

    return propFilters.map(pf => {
      let field = GetMetaPropertyByPath(meta, mobject, pf.name)
      return {
        ...field,
        ...pf
      }
    })
  }

  /**
   * Updates item in collection
   * @param {Array} collection - Current collection
   * @param {Object} item - Updated item
   * @returns {Array} Updated collection
   */
  updateCollectionItem(collection, item) {
    return updateInArray(collection, item)
  }

  /**
   * Removes item from collection
   * @param {Array} collection - Current collection
   * @param {Object} item - Item to remove
   * @returns {Array} Updated collection
   */
  removeCollectionItem(collection, item) {
    return deleteInArray(collection, item)
  }

  /**
   * Checks if filters have changed
   * @param {Object} oldFilter - Old filter values
   * @param {Object} newFilter - New filter values
   * @returns {boolean} True if filters changed
   */
  hasFiltersChanged(oldFilter, newFilter) {
    return !_.isEqual(oldFilter, newFilter)
  }

  /**
   * Builds context filter object from contextFilters array
   * @param {Array} contextFilters - Context filters
   * @returns {Object} Object with field names as keys
   */
  buildContextFilterObject(contextFilters) {
    return contextFilterToObject(contextFilters)
  }

  /**
   * Validates pagination parameters
   * @param {number} current - Current page
   * @param {number} count - Items per page
   * @returns {Object} { current, count } with validated values
   */
  validatePaginationParams(current, count) {
    return {
      current: Math.max(1, parseInt(current) || 1),
      count: Math.max(1, parseInt(count) || 20)
    }
  }

  /**
   * Calculates if there are more pages
   * @param {number} current - Current page
   * @param {number} totalPages - Total pages
   * @returns {boolean} True if has more pages
   */
  hasMorePages(current, totalPages) {
    return current < totalPages
  }

  /**
   * Gets filter value for a specific field
   * @param {Object} filters - All filters
   * @param {string} fieldName - Field name
   * @returns {any} Filter value or undefined
   */
  getFilterValue(filters, fieldName) {
    return filters[fieldName]
  }

  /**
   * Sets filter value for a specific field
   * @param {Object} filters - Current filters
   * @param {string} fieldName - Field name
   * @param {any} value - Filter value
   * @param {Object} item - Filter metadata
   * @returns {Object} Updated filters
   */
  setFilterValue(filters, fieldName, value, item) {
    // Remove filter if value is empty/null and not permanent
    if ((!value && !item?.permanent) ||
        (item?.permanent && (value === undefined || value === null)) ||
        (_.isArray(value) && value.length == 0)) {
      let f = { ...filters }
      delete f[fieldName]
      return f
    }

    // Set filter value
    return { ...filters, [fieldName]: value }
  }
}
