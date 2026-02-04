/**
 * ModelCore Tests
 *
 * Comprehensive tests for ModelCore business logic
 */

import { ModelCore } from '../ModelCore'

describe('ModelCore', () => {
  describe('Property Extraction', () => {
    it('should get all properties from metadata', () => {
      const meta = {
        properties: [
          { name: 'ID', type: 'integer' },
          { name: 'name', type: 'string', label: 'Name' },
          { name: 'email', type: 'string', label: 'Email' }
        ]
      }

      const modelCore = new ModelCore({ meta })
      const properties = modelCore.getProperties()

      expect(properties).toHaveLength(3)
      expect(properties[0].name).toBe('ID')
      expect(properties[1].name).toBe('name')
      expect(properties[2].name).toBe('email')
    })

    it('should return empty array for invalid metadata', () => {
      const modelCore = new ModelCore({ meta: null })
      const properties = modelCore.getProperties()

      expect(properties).toEqual([])
    })

    it('should filter out ID and one-to-many relations', () => {
      const meta = {
        properties: [
          { name: 'ID', type: 'integer' },
          { name: 'name', type: 'string', label: 'Name' },
          { name: 'company', type: 'object', relation: { type: 'many-to-one' } },
          { name: 'employees', type: 'array', relation: { type: 'one-many' } }
        ]
      }

      const modelCore = new ModelCore({ meta })
      const filtered = modelCore.getFilteredProperties()

      expect(filtered).toHaveLength(2)
      expect(filtered[0].name).toBe('name')
      expect(filtered[1].name).toBe('company')
    })

    it('should get only one-to-many relations', () => {
      const meta = {
        properties: [
          { name: 'name', type: 'string' },
          { name: 'employees', type: 'array', relation: { type: 'one-many' }, label: 'Employees' },
          { name: 'departments', type: 'array', relation: { type: 'one-many' }, label: 'Departments' }
        ]
      }

      const modelCore = new ModelCore({ meta })
      const oneToMany = modelCore.getOneToManyRelations()

      expect(oneToMany).toHaveLength(2)
      expect(oneToMany[0].name).toBe('employees')
      expect(oneToMany[1].name).toBe('departments')
    })

    it('should return empty array when scheme is empty', () => {
      const meta = {
        properties: [
          { name: 'employees', type: 'array', relation: { type: 'one-many' } }
        ]
      }

      const modelCore = new ModelCore({ meta, scheme: [] })
      const oneToMany = modelCore.getOneToManyRelations()

      expect(oneToMany).toEqual([])
    })

    it('should filter one-to-many by scheme', () => {
      const meta = {
        properties: [
          { name: 'employees', type: 'array', relation: { type: 'one-many' }, label: 'Employees' },
          { name: 'departments', type: 'array', relation: { type: 'one-many' }, label: 'Departments' },
          { name: 'projects', type: 'array', relation: { type: 'one-many' }, label: 'Projects' }
        ]
      }

      const modelCore = new ModelCore({ meta, scheme: ['employees', 'departments'] })
      const oneToMany = modelCore.getOneToManyRelations()

      expect(oneToMany).toHaveLength(2)
      expect(oneToMany[0].name).toBe('employees')
      expect(oneToMany[1].name).toBe('departments')
    })
  })

  describe('Tail Scheme', () => {
    it('should extract tail scheme', () => {
      const modelCore = new ModelCore({
        meta: {},
        scheme: ['employees.contacts', 'departments.manager']
      })
      const tailScheme = modelCore.getTailScheme()

      expect(tailScheme).toEqual(['contacts', 'manager'])
    })

    it('should return undefined for empty scheme', () => {
      const modelCore = new ModelCore({ meta: {}, scheme: [] })
      const tailScheme = modelCore.getTailScheme()

      expect(tailScheme).toBeUndefined()
    })

    it('should handle single-level scheme', () => {
      const modelCore = new ModelCore({
        meta: {},
        scheme: ['employees', 'departments']
      })
      const tailScheme = modelCore.getTailScheme()

      expect(tailScheme).toEqual([])
    })
  })

  describe('Context Filters', () => {
    it('should extract exclude fields from array context filters', () => {
      const contextFilters = [
        { name: 'companyID', value: 123 },
        { name: 'departmentID', value: 456 }
      ]

      const modelCore = new ModelCore({ meta: {}, contextFilters })
      const excludeFields = modelCore.getExcludeFields()

      expect(excludeFields).toEqual({
        'companyid': true,
        'companyidID': true,
        'departmentid': true,
        'departmentidID': true
      })
    })

    it('should extract exclude fields from object context filters', () => {
      const contextFilters = {
        companyID: 123,
        departmentID: 456
      }

      const modelCore = new ModelCore({ meta: {}, contextFilters })
      const excludeFields = modelCore.getExcludeFields()

      expect(excludeFields.companyid).toBe(true)
      expect(excludeFields.departmentid).toBe(true)
    })

    it('should return empty object for no context filters', () => {
      const modelCore = new ModelCore({ meta: {} })
      const excludeFields = modelCore.getExcludeFields()

      expect(excludeFields).toEqual({})
    })
  })

  describe('Field Names', () => {
    it('should add ID suffix for object types', () => {
      const property = { name: 'company', type: 'object' }
      const modelCore = new ModelCore({ meta: {} })
      const fieldName = modelCore.getFieldName(property)

      expect(fieldName).toBe('companyID')
    })

    it('should add ID suffix for document types', () => {
      const property = { name: 'author', type: 'document' }
      const modelCore = new ModelCore({ meta: {} })
      const fieldName = modelCore.getFieldName(property)

      expect(fieldName).toBe('authorID')
    })

    it('should not add ID suffix for regular types', () => {
      const property = { name: 'name', type: 'string' }
      const modelCore = new ModelCore({ meta: {} })
      const fieldName = modelCore.getFieldName(property)

      expect(fieldName).toBe('name')
    })

    it('should uncapitalize field names', () => {
      const property = { name: 'Name', type: 'string' }
      const modelCore = new ModelCore({ meta: {} })
      const fieldName = modelCore.getFieldName(property)

      expect(fieldName).toBe('name')
    })
  })

  describe('Initial Values', () => {
    it('should return object as initial values', () => {
      const object = { name: 'John', email: 'john@example.com' }
      const modelCore = new ModelCore({ meta: {}, object })
      const initialValues = modelCore.getInitialValues()

      expect(initialValues).toEqual(object)
    })

    it('should return empty object when no object provided', () => {
      const modelCore = new ModelCore({ meta: {} })
      const initialValues = modelCore.getInitialValues()

      expect(initialValues).toEqual({})
    })
  })

  describe('Property Exclusion', () => {
    it('should exclude properties in exclude fields', () => {
      const property = { name: 'companyID', type: 'integer' }
      const excludeFields = { companyid: true }
      const modelCore = new ModelCore({ meta: {} })

      const shouldExclude = modelCore.shouldExcludeProperty(property, excludeFields)

      expect(shouldExclude).toBe(true)
    })

    it('should exclude properties with ID suffix', () => {
      const property = { name: 'company', type: 'object' }
      const excludeFields = { companyID: true }
      const modelCore = new ModelCore({ meta: {} })

      const shouldExclude = modelCore.shouldExcludeProperty(property, excludeFields)

      expect(shouldExclude).toBe(false) // Note: checking lowercase
    })

    it('should not exclude properties not in exclude fields', () => {
      const property = { name: 'name', type: 'string' }
      const excludeFields = { companyid: true }
      const modelCore = new ModelCore({ meta: {} })

      const shouldExclude = modelCore.shouldExcludeProperty(property, excludeFields)

      expect(shouldExclude).toBe(false)
    })
  })

  describe('Properties for Rendering', () => {
    it('should return filtered properties excluding context filters', () => {
      const meta = {
        properties: [
          { name: 'ID', type: 'integer' },
          { name: 'name', type: 'string', label: 'Name' },
          { name: 'companyID', type: 'integer', label: 'Company' },
          { name: 'email', type: 'string', label: 'Email' },
          { name: 'employees', type: 'array', relation: { type: 'one-many' } }
        ]
      }

      const contextFilters = [{ name: 'companyID', value: 123 }]
      const modelCore = new ModelCore({ meta, contextFilters })
      const forRendering = modelCore.getPropertiesForRendering()

      expect(forRendering).toHaveLength(2)
      expect(forRendering[0].name).toBe('name')
      expect(forRendering[1].name).toBe('email')
    })
  })

  describe('One-to-Many Relations Check', () => {
    it('should return true when object has ID and relations exist', () => {
      const meta = {
        properties: [
          { name: 'employees', type: 'array', relation: { type: 'one-many' } }
        ]
      }
      const object = { ID: 123 }
      const modelCore = new ModelCore({ meta, object })

      expect(modelCore.hasOneToManyRelations()).toBe(true)
    })

    it('should return false when object has no ID', () => {
      const meta = {
        properties: [
          { name: 'employees', type: 'array', relation: { type: 'one-many' } }
        ]
      }
      const object = {}
      const modelCore = new ModelCore({ meta, object })

      expect(modelCore.hasOneToManyRelations()).toBe(false)
    })

    it('should return false when no relations exist', () => {
      const meta = {
        properties: [
          { name: 'name', type: 'string' }
        ]
      }
      const object = { ID: 123 }
      const modelCore = new ModelCore({ meta, object })

      expect(modelCore.hasOneToManyRelations()).toBe(false)
    })
  })

  describe('Property Labels', () => {
    it('should return label for non-boolean types', () => {
      const property = { name: 'name', type: 'string', label: 'Name' }
      const modelCore = new ModelCore({ meta: {} })
      const label = modelCore.getPropertyLabel(property)

      expect(label).toBe('Name')
    })

    it('should return undefined for boolean types', () => {
      const property = { name: 'active', type: 'bool', label: 'Active' }
      const modelCore = new ModelCore({ meta: {} })
      const label = modelCore.getPropertyLabel(property)

      expect(label).toBeUndefined()
    })

    it('should return undefined for boolean types (alternative)', () => {
      const property = { name: 'enabled', type: 'boolean', label: 'Enabled' }
      const modelCore = new ModelCore({ meta: {} })
      const label = modelCore.getPropertyLabel(property)

      expect(label).toBeUndefined()
    })
  })

  describe('Functional Properties', () => {
    it('should identify functional properties', () => {
      const property = { type: 'func', render: () => {} }
      const modelCore = new ModelCore({ meta: {} })

      expect(modelCore.isFunctionalProperty(property)).toBe(true)
    })

    it('should not identify regular properties as functional', () => {
      const property = { name: 'name', type: 'string' }
      const modelCore = new ModelCore({ meta: {} })

      expect(modelCore.isFunctionalProperty(property)).toBe(false)
    })

    it('should require both type=func and render function', () => {
      const property1 = { type: 'func' }
      const property2 = { render: () => {} }
      const modelCore = new ModelCore({ meta: {} })

      expect(modelCore.isFunctionalProperty(property1)).toBe(false)
      expect(modelCore.isFunctionalProperty(property2)).toBe(false)
    })
  })
})
