/**
 * FieldCore - Business logic for Field component
 *
 * Handles field type detection, validation, value normalization,
 * and prop generation without any UI dependencies.
 */

import { formItemRules, isRequired } from '../../validation'
import dayjs from 'dayjs'

export class FieldCore {
  constructor(props, meta, adapter) {
    this.props = props
    this.meta = meta
    this.adapter = adapter
  }

  /**
   * Determines field type from metadata
   * @returns {string} Field type
   */
  getFieldType() {
    return this.meta?.type || 'string'
  }

  /**
   * Generates validation rules from metadata
   * @returns {Array} Ant Design Form validation rules
   */
  getValidationRules() {
    return formItemRules(this.meta)
  }

  /**
   * Checks if field is required
   * @returns {boolean}
   */
  isRequired() {
    return isRequired(this.meta)
  }

  /**
   * Formats value from form to UI component
   * @param {any} value - Raw value from form
   * @returns {any} Formatted value for UI
   */
  formatValue(value) {
    const type = this.getFieldType()

    if (value === null || value === undefined) {
      return undefined
    }

    switch (type) {
      case 'integer':
      case 'int':
      case 'long':
        return typeof value === 'number' ? value : parseInt(value, 10)

      case 'float':
      case 'double':
      case 'bigdecimal':
        return typeof value === 'number' ? value : parseFloat(value)

      case 'boolean':
      case 'bool':
        return Boolean(value)

      case 'date':
      case 'localdate':
        // Convert to dayjs for DatePicker
        if (dayjs.isDayjs(value)) return value
        if (!value) return null
        return dayjs(value)

      case 'time':
      case 'localtime':
        // Convert to dayjs for TimePicker
        if (dayjs.isDayjs(value)) return value
        if (!value) return null
        // If value is string like "HH:mm:ss", parse it
        if (typeof value === 'string' && value.length <= 8) {
          return dayjs(value, 'HH:mm:ss')
        }
        return dayjs(value)

      case 'datetime':
      case 'timestamp':
      case 'localdatetime':
        // Convert to dayjs for DateTimePicker
        if (dayjs.isDayjs(value)) return value
        if (!value) return null
        return dayjs(value)

      case 'file':
      case 'files':
      case 'image':
        // File values are handled as fileList arrays by Upload component
        // Value can be: array of file objects, single file object, or null
        if (!value) return []
        if (Array.isArray(value)) return value
        return [value]

      case 'rate':
        // Rate is just a number
        return typeof value === 'number' ? value : parseFloat(value) || 0

      case 'color':
        // Color is a string (hex, rgb, etc.)
        return value || '#000000'

      case 'slider':
        // Slider is a number
        return typeof value === 'number' ? value : parseInt(value, 10) || 0

      case 'json':
        // JSON is displayed as formatted string in textarea
        if (!value) return ''
        if (typeof value === 'string') return value
        try {
          return JSON.stringify(value, null, 2)
        } catch (e) {
          return String(value)
        }

      case 'string':
      case 'text':
      case 'password':
      case 'email':
      case 'url':
      case 'phone':
      default:
        return String(value)
    }
  }

  /**
   * Parses value from UI component to form
   * @param {any} value - Value from UI component
   * @returns {any} Parsed value for form
   */
  parseValue(value) {
    const type = this.getFieldType()

    if (value === null || value === undefined || value === '') {
      return undefined
    }

    switch (type) {
      case 'integer':
      case 'int':
      case 'long':
        return typeof value === 'number' ? Math.floor(value) : parseInt(value, 10)

      case 'float':
      case 'double':
      case 'bigdecimal':
        return typeof value === 'number' ? value : parseFloat(value)

      case 'boolean':
      case 'bool':
        return Boolean(value)

      case 'date':
      case 'localdate':
        // Parse from DatePicker to ISO date string
        if (dayjs.isDayjs(value)) {
          return value.format('YYYY-MM-DD')
        }
        return value

      case 'time':
      case 'localtime':
        // Parse from TimePicker to HH:mm:ss string
        if (dayjs.isDayjs(value)) {
          return value.format('HH:mm:ss')
        }
        return value

      case 'datetime':
      case 'timestamp':
      case 'localdatetime':
        // Parse from DateTimePicker to ISO string
        if (dayjs.isDayjs(value)) {
          return value.toISOString()
        }
        return value

      case 'file':
        // For single file, return the file object or null
        if (!value) return null
        if (Array.isArray(value)) {
          return value.length > 0 ? value[0] : null
        }
        return value

      case 'files':
      case 'image':
        // For multiple files/images, return array
        if (!value) return []
        if (Array.isArray(value)) return value
        return [value]

      case 'rate':
        // Return number for rate
        return typeof value === 'number' ? value : parseFloat(value) || 0

      case 'color':
        // Return color string
        return value || '#000000'

      case 'slider':
        // Return number for slider
        return typeof value === 'number' ? value : parseInt(value, 10) || 0

      case 'json':
        // Parse JSON string to object
        if (!value) return null
        if (typeof value === 'object') return value
        try {
          return JSON.parse(value)
        } catch (e) {
          console.warn('Failed to parse JSON:', e)
          return value // Return as string if parsing fails
        }

      case 'string':
      case 'text':
      case 'password':
      case 'email':
      case 'url':
      case 'phone':
      default:
        return value
    }
  }

  /**
   * Generates props for UI component
   * @returns {Object} Props object
   */
  getComponentProps() {
    const type = this.getFieldType()
    const value = this.props.value

    return {
      value: this.formatValue(value),
      onChange: this.handleChange.bind(this),
      disabled: this.isDisabled(),
      placeholder: this.getPlaceholder(),
      ...this.getTypeSpecificProps(type)
    }
  }

  /**
   * Handles value change from UI component
   * @param {any} value - New value from UI
   */
  handleChange(value) {
    const parsed = this.parseValue(value)
    this.props.onChange?.(parsed)
  }

  /**
   * Checks if field is disabled
   * @returns {boolean}
   */
  isDisabled() {
    return this.props.disabled || this.meta?.disabled || false
  }

  /**
   * Checks if field is read-only
   * @returns {boolean}
   */
  isReadOnly() {
    return this.props.readOnly || this.meta?.readOnly || false
  }

  /**
   * Generates placeholder text
   * @returns {string}
   */
  getPlaceholder() {
    if (this.props.placeholder) {
      return this.props.placeholder
    }

    if (this.meta?.placeholder) {
      return this.meta.placeholder
    }

    const label = this.meta?.label || ''
    const type = this.getFieldType()

    switch (type) {
      case 'integer':
      case 'int':
      case 'long':
      case 'float':
      case 'double':
      case 'bigdecimal':
        return `Введите ${label || 'число'}`

      case 'boolean':
      case 'bool':
        return '' // Boolean fields don't need placeholder

      case 'date':
      case 'localdate':
        return `Выберите ${label || 'дату'}`

      case 'time':
      case 'localtime':
        return `Выберите ${label || 'время'}`

      case 'datetime':
      case 'timestamp':
      case 'localdatetime':
        return `Выберите ${label || 'дату и время'}`

      case 'select':
      case 'multiselect':
        return `Выберите ${label || 'значение'}`

      case 'radio':
        return '' // Radio groups don't need placeholder

      case 'checkbox':
        return '' // Checkboxes don't need placeholder

      case 'file':
        return `Выберите ${label || 'файл'}`

      case 'files':
        return `Выберите ${label || 'файлы'}`

      case 'image':
        return `Выберите ${label || 'изображение'}`

      case 'rate':
        return '' // Rate doesn't need placeholder

      case 'color':
        return `Выберите ${label || 'цвет'}`

      case 'slider':
        return '' // Slider doesn't need placeholder

      case 'json':
        return `Введите ${label || 'JSON'}`

      case 'string':
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
      case 'password':
      default:
        return `Введите ${label || 'значение'}`
    }
  }

  /**
   * Gets type-specific props for UI component
   * @param {string} type - Field type
   * @returns {Object} Type-specific props
   */
  getTypeSpecificProps(type) {
    switch (type) {
      case 'integer':
      case 'int':
      case 'long':
        return {
          min: this.meta?.validators?.min,
          max: this.meta?.validators?.max,
          precision: 0,
          step: 1,
          style: { width: '100%' }
        }

      case 'float':
      case 'double':
      case 'bigdecimal':
        return {
          min: this.meta?.validators?.min,
          max: this.meta?.validators?.max,
          precision: 2,
          step: 0.01,
          style: { width: '100%' }
        }

      case 'boolean':
      case 'bool':
        return {
          checked: this.formatValue(this.props.value)
        }

      case 'password':
        return {
          type: 'password',
          autoComplete: 'new-password'
        }

      case 'email':
        return {
          type: 'email',
          autoComplete: 'email'
        }

      case 'url':
        return {
          type: 'url'
        }

      case 'phone':
        return {
          type: 'tel',
          autoComplete: 'tel'
        }

      case 'text':
        return {
          rows: 4,
          autoSize: { minRows: 2, maxRows: 10 }
        }

      case 'date':
      case 'localdate':
        return {
          format: this.meta?.format || 'DD.MM.YYYY',
          style: { width: '100%' }
        }

      case 'time':
      case 'localtime':
        return {
          format: this.meta?.format || 'HH:mm:ss',
          style: { width: '100%' }
        }

      case 'datetime':
      case 'timestamp':
      case 'localdatetime':
        return {
          format: this.meta?.format || 'DD.MM.YYYY HH:mm:ss',
          showTime: true,
          style: { width: '100%' }
        }

      case 'select':
        return {
          options: this.getOptions(),
          showSearch: this.meta?.searchable !== false,
          allowClear: !this.isRequired(),
          style: { width: '100%' }
        }

      case 'multiselect':
        return {
          options: this.getOptions(),
          mode: 'multiple',
          showSearch: this.meta?.searchable !== false,
          allowClear: !this.isRequired(),
          style: { width: '100%' }
        }

      case 'radio':
        return {
          options: this.getOptions()
        }

      case 'checkbox':
        return {
          checked: this.formatValue(this.props.value),
          children: this.meta?.checkboxLabel || this.meta?.label
        }

      case 'file':
        return {
          accept: this.meta?.accept,
          maxCount: 1,
          maxSize: this.meta?.maxSize,
          listType: 'text'
        }

      case 'files':
        return {
          accept: this.meta?.accept,
          multiple: true,
          maxCount: this.meta?.maxCount || 10,
          maxSize: this.meta?.maxSize,
          listType: 'text'
        }

      case 'image':
        return {
          accept: this.meta?.accept || 'image/*',
          maxCount: this.meta?.multiple ? (this.meta?.maxCount || 10) : 1,
          multiple: this.meta?.multiple || false,
          maxSize: this.meta?.maxSize,
          listType: 'picture-card'
        }

      case 'rate':
        return {
          count: this.meta?.count || 5,
          allowHalf: this.meta?.allowHalf || false
        }

      case 'color':
        return {
          showText: this.meta?.showText || false
        }

      case 'slider':
        return {
          min: this.meta?.min || 0,
          max: this.meta?.max || 100,
          step: this.meta?.step || 1,
          marks: this.meta?.marks,
          style: { width: '100%' }
        }

      case 'json':
        return {
          rows: this.meta?.rows || 6,
          autoSize: { minRows: 4, maxRows: 20 }
        }

      case 'string':
      default:
        return {}
    }
  }

  /**
   * Gets options for select/radio fields
   * @returns {Array} Options array
   */
  getOptions() {
    // Options from meta
    if (this.meta?.options) {
      return this.meta.options
    }

    // Options from meta.enum
    if (this.meta?.enum) {
      return this.meta.enum.map(value => ({
        label: value,
        value: value
      }))
    }

    // Options from meta.choices
    if (this.meta?.choices) {
      return this.meta.choices.map(choice => ({
        label: choice.label || choice.name || choice.value,
        value: choice.value || choice.id
      }))
    }

    return []
  }

  /**
   * Gets label for Form.Item
   * @returns {string}
   */
  getLabel() {
    return this.props.label || this.meta?.label || ''
  }

  /**
   * Gets help text for Form.Item
   * @returns {string}
   */
  getHelp() {
    return this.props.help || this.meta?.help || ''
  }

  /**
   * Gets tooltip text for Form.Item
   * @returns {string}
   */
  getTooltip() {
    return this.props.tooltip || this.meta?.tooltip || ''
  }
}
