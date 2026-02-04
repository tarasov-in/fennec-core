/**
 * FieldRenderer - UI rendering for Field component
 *
 * Renders field using UIAdapter, completely decoupled from specific UI library
 */

import React from 'react'
import { useUIAdapter } from '../../../adapters/UIProvider'

/**
 * Maps field type to UI component from adapter
 * @param {string} type - Field type
 * @param {Object} adapter - UI adapter instance
 * @returns {React.Component} UI component
 */
function getUIComponentForType(type, adapter) {
  switch (type) {
    // String types
    case 'string':
    case 'email':
    case 'url':
    case 'phone':
      return adapter.Input

    case 'password':
      return adapter.Input?.Password || adapter.Input

    case 'text':
      return adapter.Input?.TextArea || adapter.TextArea

    // Numeric types
    case 'integer':
    case 'int':
    case 'long':
    case 'float':
    case 'double':
    case 'bigdecimal':
    case 'percent':
      return adapter.InputNumber

    // Boolean
    case 'boolean':
    case 'bool':
      return adapter.Switch

    // Date/Time types
    case 'date':
    case 'localdate':
      return adapter.DatePicker

    case 'time':
    case 'localtime':
      return adapter.TimePicker

    case 'datetime':
    case 'timestamp':
    case 'localdatetime':
      return adapter.DatePicker // DateTimePicker в будущем

    // Select types
    case 'select':
      return adapter.Select

    case 'multiselect':
      return adapter.Select // с mode="multiple"

    case 'radio':
      return adapter.Radio?.Group || adapter.Radio

    case 'checkbox':
      return adapter.Checkbox

    // File types
    case 'file':
    case 'files':
    case 'image':
      return adapter.Upload

    // Special types
    case 'rate':
      return adapter.Rate

    case 'color':
      return adapter.ColorPicker

    case 'slider':
      return adapter.Slider

    case 'json':
      return adapter.TextArea // JSON is displayed as textarea

    // Default fallback
    default:
      return adapter.Input
  }
}

/**
 * FieldRenderer component
 * @param {Object} props
 * @param {FieldCore} props.fieldCore - Field core instance with business logic
 * @param {string} props.className - CSS class name
 * @param {Object} props.style - Inline styles
 */
export const FieldRenderer = ({ fieldCore, className, style }) => {
  const adapter = useUIAdapter()

  if (!adapter) {
    console.error('FieldRenderer: UIAdapter not found. Wrap your app in <UIProvider>')
    return null
  }

  const type = fieldCore.getFieldType()
  const componentProps = fieldCore.getComponentProps()
  const label = fieldCore.getLabel()
  const help = fieldCore.getHelp()
  const tooltip = fieldCore.getTooltip()
  const rules = fieldCore.getValidationRules()

  // Get UI component from adapter
  const UIComponent = getUIComponentForType(type, adapter)

  if (!UIComponent) {
    console.warn(`FieldRenderer: No UI component found for type "${type}" in adapter. Using fallback.`)
    return (
      <div className={className} style={style}>
        <input {...componentProps} />
      </div>
    )
  }

  // Render using adapter's FormItem
  const FormItem = adapter.Form?.Item || adapter.FormItem

  if (!FormItem) {
    // Fallback if no FormItem in adapter
    return (
      <div className={className} style={style}>
        {label && <label>{label}</label>}
        <UIComponent {...componentProps} />
        {help && <small>{help}</small>}
      </div>
    )
  }

  return (
    <FormItem
      label={label}
      help={help}
      tooltip={tooltip}
      rules={rules}
      className={className}
      style={style}
      required={fieldCore.isRequired()}
    >
      <UIComponent {...componentProps} />
    </FormItem>
  )
}

export default FieldRenderer
