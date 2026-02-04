/**
 * CollectionCore Tests
 *
 * Comprehensive tests for CollectionCore business logic
 */

import { CollectionCore } from '../CollectionCore'
import dayjs from 'dayjs'

describe('CollectionCore', () => {
  describe('Default Filters', () => {
    it('should extract default filters from filter definitions', () => {
      const filters = [
        { name: 'status', filtered: 'active' },
        { name: 'category', filtered: 'electronics' },
        { name: 'name', filter: true }
      ]

      const collectionCore = new CollectionCore({})
      const defaultFilters = collectionCore.getDefaultFilters(filters)

      expect(defaultFilters).toEqual({
        status: 'active',
        category: 'electronics'
      })
    })

    it('should return empty object for no filtered values', () => {
      const filters = [
        { name: 'name', filter: true },
        { name: 'email', filter: true }
      ]

      const collectionCore = new CollectionCore({})
      const defaultFilters = collectionCore.getDefaultFilters(filters)

      expect(defaultFilters).toEqual({})
    })

    it('should handle empty filters array', () => {
      const collectionCore = new CollectionCore({})
      const defaultFilters = collectionCore.getDefaultFilters([])

      expect(defaultFilters).toEqual({})
    })
  })

  describe('Default Sorting', () => {
    it('should extract default sorting from filter definitions', () => {
      const filters = [
        { name: 'name', sort: true },
        { name: 'createdAt', sort: true, sorted: 'DESC' },
        { name: 'updatedAt', sort: true }
      ]

      const collectionCore = new CollectionCore({})
      const defaultSorting = collectionCore.getDefaultSorting(filters)

      expect(defaultSorting).toEqual({
        name: 'createdAt',
        order: 'DESC'
      })
    })

    it('should return default sorting when no sorted value', () => {
      const filters = [
        { name: 'name', sort: true }
      ]

      const collectionCore = new CollectionCore({})
      const defaultSorting = collectionCore.getDefaultSorting(filters)

      expect(defaultSorting).toEqual({
        name: '',
        order: 'ASC'
      })
    })
  })

  describe('Query Parameters Building', () => {
    it('should build basic query parameters', () => {
      const collectionCore = new CollectionCore({})
      const filters = []
      const contextFilters = []
      const filter = {}
      const sorting = { name: '', order: 'ASC' }
      const current = 1
      const count = 20
      const queryDetail = 'model'

      const params = collectionCore.buildQueryParams(
        filters,
        contextFilters,
        filter,
        sorting,
        current,
        count,
        queryDetail
      )

      expect(params).toContainEqual({ name: 'detail', value: 'model' })
      expect(params).toContainEqual({ name: 'page', value: 1 })
      expect(params).toContainEqual({ name: 'count', value: 20 })
    })

    it('should include sorting parameters', () => {
      const collectionCore = new CollectionCore({})
      const sorting = { name: 'createdAt', order: 'DESC' }

      const params = collectionCore.buildQueryParams(
        [],
        [],
        {},
        sorting,
        1,
        20,
        'model'
      )

      expect(params).toContainEqual({ name: 's-createdAt', value: 'DESC' })
    })
  })

  describe('Filter Building by Type', () => {
    it('should build group filter', () => {
      const collectionCore = new CollectionCore({})
      const item = { name: 'category', filterType: 'group' }
      const akey = 'category'
      const filterByKey = ['electronics', 'books']

      const result = collectionCore.buildFilterByType(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-in-category', value: ['electronics', 'books'] })
    })

    it('should build range filter for integers', () => {
      const collectionCore = new CollectionCore({})
      const item = { name: 'price', type: 'integer', filterType: 'range' }
      const akey = 'price'
      const filterByKey = [10, 100]

      const result = collectionCore.buildFilterByType(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-lge-price', value: 10 })
      expect(result).toContainEqual({ name: 'w-lwe-price', value: 100 })
    })

    it('should build range filter for dates', () => {
      const collectionCore = new CollectionCore({})
      const item = { name: 'createdAt', type: 'date', filterType: 'range' }
      const akey = 'createdAt'
      const filterByKey = [dayjs('2024-01-01'), dayjs('2024-12-31')]

      const result = collectionCore.buildFilterByType(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-lge-createdAt', value: '2024-01-01' })
      expect(result).toContainEqual({ name: 'w-lwe-createdAt', value: '2024-12-31' })
    })

    it('should build string filter with default comparer', () => {
      const collectionCore = new CollectionCore({})
      const item = { name: 'name', type: 'string' }
      const akey = 'name'
      const filterByKey = 'test'

      const result = collectionCore.buildFilterByType(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-co-name', value: 'test' })
    })

    it('should build string filter with custom comparer', () => {
      const collectionCore = new CollectionCore({})
      const item = { name: 'email', type: 'string', queryComparer: 'eq' }
      const akey = 'email'
      const filterByKey = 'test@example.com'

      const result = collectionCore.buildFilterByType(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-eq-email', value: 'test@example.com' })
    })
  })

  describe('Range Filter Building', () => {
    it('should handle time range', () => {
      const collectionCore = new CollectionCore({})
      const item = { type: 'time' }
      const akey = 'workTime'
      const filterByKey = [dayjs('09:00:00', 'HH:mm:ss'), dayjs('17:00:00', 'HH:mm:ss')]

      const result = collectionCore.buildRangeFilter(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-lge-workTime', value: '09:00:00' })
      expect(result).toContainEqual({ name: 'w-lwe-workTime', value: '17:00:00' })
    })

    it('should handle datetime range', () => {
      const collectionCore = new CollectionCore({})
      const item = { type: 'datetime' }
      const akey = 'createdAt'
      const filterByKey = [
        dayjs('2024-01-01 00:00:00'),
        dayjs('2024-12-31 23:59:59')
      ]

      const result = collectionCore.buildRangeFilter(item, akey, filterByKey)

      expect(result[0].name).toBe('w-lge-createdAt')
      expect(result[1].name).toBe('w-lwe-createdAt')
    })

    it('should return empty array for invalid range', () => {
      const collectionCore = new CollectionCore({})
      const item = { type: 'integer' }
      const akey = 'age'
      const filterByKey = [10] // Not a valid range (needs 2 values)

      const result = collectionCore.buildRangeFilter(item, akey, filterByKey)

      expect(result).toEqual([])
    })

    it('should handle float range', () => {
      const collectionCore = new CollectionCore({})
      const item = { type: 'float' }
      const akey = 'price'
      const filterByKey = [9.99, 99.99]

      const result = collectionCore.buildRangeFilter(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-lge-price', value: 9.99 })
      expect(result).toContainEqual({ name: 'w-lwe-price', value: 99.99 })
    })
  })

  describe('Default Filter Building', () => {
    it('should handle func type with queryPrefix', () => {
      const collectionCore = new CollectionCore({})
      const item = { type: 'func', queryPrefix: 'custom-' }
      const akey = 'field'
      const filterByKey = 'value'

      const result = collectionCore.buildDefaultFilter(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'custom-field', value: 'value' })
    })

    it('should handle queryRaw', () => {
      const collectionCore = new CollectionCore({})
      const rawParam = { name: 'raw-param', value: 'raw-value' }
      const item = { queryRaw: rawParam }
      const akey = 'field'
      const filterByKey = 'value'

      const result = collectionCore.buildDefaultFilter(item, akey, filterByKey)

      expect(result).toContainEqual(rawParam)
    })

    it('should handle queryRaw as function', () => {
      const collectionCore = new CollectionCore({})
      const item = {
        queryRaw: (value, item, key) => ({ name: `custom-${key}`, value: value })
      }
      const akey = 'field'
      const filterByKey = 'test'

      const result = collectionCore.buildDefaultFilter(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'custom-field', value: 'test' })
    })

    it('should handle queryComparer as function', () => {
      const collectionCore = new CollectionCore({})
      const item = {
        queryComparer: (value, item) => value.length > 5 ? 'eq' : 'co'
      }
      const akey = 'name'
      const filterByKey = 'verylongname'

      const result = collectionCore.buildDefaultFilter(item, akey, filterByKey)

      expect(result).toContainEqual({ name: 'w-eq-name', value: 'verylongname' })
    })
  })

  describe('Collection Item Management', () => {
    it('should update item in collection', () => {
      const collectionCore = new CollectionCore({})
      const collection = [
        { ID: 1, name: 'Item 1' },
        { ID: 2, name: 'Item 2' },
        { ID: 3, name: 'Item 3' }
      ]
      const updatedItem = { ID: 2, name: 'Updated Item 2' }

      const result = collectionCore.updateCollectionItem(collection, updatedItem)

      expect(result).toHaveLength(3)
      expect(result[1]).toEqual(updatedItem)
    })

    it('should remove item from collection', () => {
      const collectionCore = new CollectionCore({})
      const collection = [
        { ID: 1, name: 'Item 1' },
        { ID: 2, name: 'Item 2' },
        { ID: 3, name: 'Item 3' }
      ]
      const itemToRemove = { ID: 2, name: 'Item 2' }

      const result = collectionCore.removeCollectionItem(collection, itemToRemove)

      expect(result).toHaveLength(2)
      expect(result.find(i => i.ID === 2)).toBeUndefined()
    })
  })

  describe('Filter Changes Detection', () => {
    it('should detect filter changes', () => {
      const collectionCore = new CollectionCore({})
      const oldFilter = { status: 'active' }
      const newFilter = { status: 'inactive' }

      expect(collectionCore.hasFiltersChanged(oldFilter, newFilter)).toBe(true)
    })

    it('should detect no changes when filters are same', () => {
      const collectionCore = new CollectionCore({})
      const oldFilter = { status: 'active', category: 'books' }
      const newFilter = { status: 'active', category: 'books' }

      expect(collectionCore.hasFiltersChanged(oldFilter, newFilter)).toBe(false)
    })

    it('should detect changes when filter added', () => {
      const collectionCore = new CollectionCore({})
      const oldFilter = { status: 'active' }
      const newFilter = { status: 'active', category: 'books' }

      expect(collectionCore.hasFiltersChanged(oldFilter, newFilter)).toBe(true)
    })
  })

  describe('Pagination Validation', () => {
    it('should validate and fix pagination parameters', () => {
      const collectionCore = new CollectionCore({})
      const result = collectionCore.validatePaginationParams(5, 25)

      expect(result).toEqual({ current: 5, count: 25 })
    })

    it('should fix invalid current page', () => {
      const collectionCore = new CollectionCore({})
      const result = collectionCore.validatePaginationParams(0, 20)

      expect(result.current).toBe(1)
    })

    it('should fix invalid count', () => {
      const collectionCore = new CollectionCore({})
      const result = collectionCore.validatePaginationParams(1, 0)

      expect(result.count).toBe(1)
    })

    it('should handle string parameters', () => {
      const collectionCore = new CollectionCore({})
      const result = collectionCore.validatePaginationParams('3', '30')

      expect(result).toEqual({ current: 3, count: 30 })
    })
  })

  describe('Pagination Checks', () => {
    it('should detect more pages available', () => {
      const collectionCore = new CollectionCore({})
      expect(collectionCore.hasMorePages(2, 5)).toBe(true)
    })

    it('should detect last page', () => {
      const collectionCore = new CollectionCore({})
      expect(collectionCore.hasMorePages(5, 5)).toBe(false)
    })

    it('should detect beyond last page', () => {
      const collectionCore = new CollectionCore({})
      expect(collectionCore.hasMorePages(6, 5)).toBe(false)
    })
  })

  describe('Filter Value Management', () => {
    it('should get filter value', () => {
      const collectionCore = new CollectionCore({})
      const filters = { status: 'active', category: 'books' }

      expect(collectionCore.getFilterValue(filters, 'status')).toBe('active')
      expect(collectionCore.getFilterValue(filters, 'category')).toBe('books')
    })

    it('should return undefined for non-existent filter', () => {
      const collectionCore = new CollectionCore({})
      const filters = { status: 'active' }

      expect(collectionCore.getFilterValue(filters, 'unknown')).toBeUndefined()
    })

    it('should set filter value', () => {
      const collectionCore = new CollectionCore({})
      const filters = { status: 'active' }
      const item = {}

      const result = collectionCore.setFilterValue(filters, 'category', 'books', item)

      expect(result).toEqual({ status: 'active', category: 'books' })
    })

    it('should remove filter when value is empty', () => {
      const collectionCore = new CollectionCore({})
      const filters = { status: 'active', category: 'books' }
      const item = {}

      const result = collectionCore.setFilterValue(filters, 'category', null, item)

      expect(result).toEqual({ status: 'active' })
    })

    it('should not remove permanent filter when empty', () => {
      const collectionCore = new CollectionCore({})
      const filters = { status: 'active', permanent: 'value' }
      const item = { permanent: true }

      const result = collectionCore.setFilterValue(filters, 'permanent', '', item)

      expect(result).toEqual({ status: 'active', permanent: '' })
    })

    it('should remove filter when array is empty', () => {
      const collectionCore = new CollectionCore({})
      const filters = { status: 'active', tags: ['tag1'] }
      const item = {}

      const result = collectionCore.setFilterValue(filters, 'tags', [], item)

      expect(result).toEqual({ status: 'active' })
    })
  })
})
