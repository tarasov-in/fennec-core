/**
 * ModelCore - Business logic for Model component
 *
 * Handles model properties extraction, filtering, validation,
 * and form operations without any UI dependencies.
 */

import { GetMeta, GetMetaProperties, formItemRules, isRequired, uncapitalize, getObjectValue } from '../../utils'

var _ = require('lodash')

export class ModelCore {
  constructor(props) {
    this.props = props
    this.meta = GetMeta(props.meta)
    this.object = props.object
    this.contextFilters = props.contextFilters
    this.scheme = props.scheme
    this.linksCompareFunction = props.linksCompareFunction
  }

  /**
   * Gets all properties from metadata
   * @returns {Array} All properties
   */
  getProperties() {
    if (!this.meta) return []
    return GetMetaProperties(this.meta)
  }

  /**
   * Gets filtered properties (excluding ID and one-to-many relations)
   * @returns {Array} Filtered properties for form fields
   */
  getFilteredProperties() {
    const properties = this.getProperties()
    if (!properties) return []

    return properties
      .filter(e => (!e.name || (e.name && e.name.toUpperCase() !== 'ID')))
      .filter(e => (!e.relation || (e.relation && e.relation.type !== 'one-many')))
  }

  /**
   * Gets one-to-many relation properties
   * @returns {Array} One-to-many relations for tabs/collections
   */
  getOneToManyRelations() {
    const properties = this.getProperties()
    if (!properties) return []

    let oneToMany = properties.filter(e => e.relation && e.relation.type === 'one-many')

    // Apply scheme filtering if present
    if (this.scheme && !this.scheme.length) {
      // Empty scheme means no relations
      return []
    }

    if (this.scheme?.length) {
      let headScheme = {}

      for (let i = 0; i < this.scheme.length; i++) {
        const element = this.scheme[i].toLowerCase()
        let arr = element.split('.')

        if (arr && arr.length && arr[0]) {
          headScheme[arr[0]] = true
        }
      }

      const func = this.linksCompareFunction || ((e) => _.get(e, 'name'))
      oneToMany = oneToMany.filter(e => {
        return (func(e) && (headScheme[func(e)?.toLowerCase()]))
      })
    }

    return oneToMany
  }

  /**
   * Gets tail scheme for nested relations
   * Used when rendering Collection By Property for one-to-many relations
   * @returns {Array|undefined} Tail scheme or undefined
   */
  getTailScheme() {
    if (!this.scheme?.length) return undefined

    let tailScheme = []

    for (let i = 0; i < this.scheme.length; i++) {
      const element = this.scheme[i].toLowerCase()
      let arr = element.split('.')

      if (arr && arr.length && arr[0]) {
        arr.splice(0, 1)
        if (arr && arr.length) {
          let c = arr.join('.')
          tailScheme.push(c)
        }
      }
    }

    return tailScheme
  }

  /**
   * Gets exclude fields from context filters
   * Fields that are present in context filters should be hidden from the form
   * @returns {Object} Object with field names as keys
   */
  getExcludeFields() {
    if (!this.contextFilters) return {}

    let excludeFields = {}

    if (Array.isArray(this.contextFilters)) {
      this.contextFilters.forEach(filter => {
        if (filter.name) {
          excludeFields[filter.name.toLowerCase()] = true
          excludeFields[filter.name.toLowerCase() + 'ID'] = true
        }
      })
    } else if (typeof this.contextFilters === 'object') {
      Object.keys(this.contextFilters).forEach(key => {
        excludeFields[key.toLowerCase()] = true
        excludeFields[key.toLowerCase() + 'ID'] = true
      })
    }

    return excludeFields
  }

  /**
   * Gets validation rules for a property
   * @param {Object} property - Property metadata
   * @returns {Array} Ant Design Form validation rules
   */
  getValidationRules(property) {
    return formItemRules(property)
  }

  /**
   * Checks if property is required
   * @param {Object} property - Property metadata
   * @returns {boolean}
   */
  isRequired(property) {
    return isRequired(property)
  }

  /**
   * Gets field name for Form.Item
   * For object/document types, adds "ID" suffix
   * @param {Object} property - Property metadata
   * @returns {string} Field name
   */
  getFieldName(property) {
    const isObjectType = property.type === 'object' || property.type === 'document'
    const baseName = uncapitalize(property.name)

    return isObjectType ? baseName + 'ID' : baseName
  }

  /**
   * Gets initial values for form
   * @returns {Object} Initial form values
   */
  getInitialValues() {
    return this.object || {}
  }

  /**
   * Checks if property should be excluded from form
   * @param {Object} property - Property metadata
   * @param {Object} excludeFields - Fields to exclude
   * @returns {boolean} True if should be excluded
   */
  shouldExcludeProperty(property, excludeFields) {
    if (!property.name) return false

    const lowerName = property.name.toLowerCase()
    return !!(excludeFields[lowerName] || excludeFields[lowerName + 'ID'])
  }

  /**
   * Gets properties for rendering (filtered and excluding context filter fields)
   * @returns {Array} Properties to render in form
   */
  getPropertiesForRendering() {
    const filtered = this.getFilteredProperties()
    const excludeFields = this.getExcludeFields()

    return filtered.filter(property => !this.shouldExcludeProperty(property, excludeFields))
  }

  /**
   * Checks if model has one-to-many relations to display
   * @returns {boolean}
   */
  hasOneToManyRelations() {
    const relations = this.getOneToManyRelations()
    return !!(this.object && this.object.ID && relations && relations.length > 0)
  }

  /**
   * Gets label for property
   * @param {Object} property - Property metadata
   * @returns {string|undefined} Label text or undefined for bool types
   */
  getPropertyLabel(property) {
    if (property.type === 'bool' || property.type === 'boolean') {
      return undefined
    }
    return property.label
  }

  /**
   * Gets display name for model object
   * @param {Function} getObjectDisplay - Display function from utils
   * @param {Object} gmeta - Global metadata
   * @returns {string} Display string
   */
  getObjectDisplay(getObjectDisplay, gmeta) {
    if (!this.meta.name || !this.object) return ''
    return getObjectDisplay(this.object, this.meta.name, gmeta)
  }

  /**
   * Checks if property is a functional render (type: 'func')
   * @param {Object} property - Property metadata
   * @returns {boolean}
   */
  isFunctionalProperty(property) {
    return !property.name && property.type === 'func' && property.render
  }
}
