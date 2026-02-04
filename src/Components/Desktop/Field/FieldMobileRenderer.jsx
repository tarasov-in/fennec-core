/**
 * FieldMobileRenderer - Mobile UI Renderer for Field Component
 *
 * Uses FieldCore (Desktop) for ALL business logic
 * Only renders UI using AntdMobileAdapter
 *
 * KEY PRINCIPLE: Desktop Core + Mobile UI = Correct Mobile Component
 *
 * @version 2.2.0
 */

import React, { useMemo } from 'react'
import { useUI } from '../../../adapters/UIContext'

/**
 * FieldMobileRenderer
 *
 * @param {Object} props
 * @param {FieldCore} props.fieldCore - Field Core instance (Desktop logic)
 * @param {Object} props.item - Field metadata
 * @param {*} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.readonly - Readonly state
 * @param {boolean} props.disabled - Disabled state
 * @param {Object} props.object - Parent object (for context)
 */
export function FieldMobileRenderer(props) {
  const {
    fieldCore,
    item = {},
    value,
    onChange,
    readonly,
    disabled,
    object
  } = props

  const ui = useUI() // AntdMobileAdapter

  // All logic delegated to FieldCore (Desktop)
  const fieldType = useMemo(() => fieldCore.getFieldType(), [fieldCore])
  const placeholder = useMemo(() => fieldCore.getPlaceholder(), [fieldCore])
  const label = useMemo(() => fieldCore.getLabel(), [fieldCore])
  const required = useMemo(() => fieldCore.isRequired(), [fieldCore])
  const options = useMemo(() => fieldCore.getSelectOptions?.() || [], [fieldCore])

  /**
   * Render field based on type
   * Uses Mobile UI components from AntdMobileAdapter
   */
  const renderField = () => {
    // String type
    if (fieldType === 'string') {
      return ui.renderInput({
        value,
        onChange,
        placeholder,
        disabled,
        readOnly: readonly
      })
    }

    // Email type
    if (fieldType === 'email') {
      return ui.renderInput({
        type: 'email',
        value,
        onChange,
        placeholder,
        disabled,
        readOnly: readonly
      })
    }

    // Phone type
    if (fieldType === 'phone') {
      return ui.renderInput({
        type: 'tel',
        value,
        onChange,
        placeholder,
        disabled,
        readOnly: readonly
      })
    }

    // URL type
    if (fieldType === 'url') {
      return ui.renderInput({
        type: 'url',
        value,
        onChange,
        placeholder,
        disabled,
        readOnly: readonly
      })
    }

    // Password type
    if (fieldType === 'password') {
      return ui.renderInput({
        type: 'password',
        value,
        onChange,
        placeholder,
        disabled,
        readOnly: readonly
      })
    }

    // Number type
    if (fieldType === 'number') {
      return (
        <ui.InputNumber
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
        />
      )
    }

    // TextArea type
    if (fieldType === 'textarea') {
      return ui.renderTextArea({
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        disabled,
        readOnly: readonly,
        rows: item.rows || 4
      })
    }

    // Date type
    if (fieldType === 'date') {
      return ui.renderDatePicker({
        value: fieldCore.parseDate?.(value),
        onChange: (date) => onChange(fieldCore.formatDate?.(date) || date),
        disabled,
        readOnly: readonly
      })
    }

    // Time type
    if (fieldType === 'time') {
      return (
        <ui.TimePicker
          value={fieldCore.parseTime?.(value)}
          onChange={(time) => onChange(fieldCore.formatTime?.(time) || time)}
          disabled={disabled}
          readOnly={readonly}
        />
      )
    }

    // DateTime type
    if (fieldType === 'datetime') {
      return ui.renderDatePicker({
        value: fieldCore.parseDateTime?.(value),
        onChange: (dateTime) => onChange(fieldCore.formatDateTime?.(dateTime) || dateTime),
        disabled,
        readOnly: readonly,
        showTime: true
      })
    }

    // Select type
    if (fieldType === 'select') {
      return ui.renderSelect({
        value,
        onChange,
        options,
        placeholder,
        disabled,
        readOnly: readonly
      })
    }

    // MultiSelect type
    if (fieldType === 'multiselect') {
      return ui.renderSelect({
        value,
        onChange,
        options,
        placeholder,
        disabled,
        readOnly: readonly,
        mode: 'multiple'
      })
    }

    // Checkbox type
    if (fieldType === 'checkbox') {
      return (
        <ui.Checkbox
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        >
          {label}
        </ui.Checkbox>
      )
    }

    // Radio type
    if (fieldType === 'radio') {
      return (
        <ui.Radio.Group
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {options.map((opt) => (
            <ui.Radio key={opt.value} value={opt.value}>
              {opt.label}
            </ui.Radio>
          ))}
        </ui.Radio.Group>
      )
    }

    // Switch type
    if (fieldType === 'switch') {
      return (
        <ui.Switch
          checked={value}
          onChange={(checked) => onChange(checked)}
          disabled={disabled}
        />
      )
    }

    // Slider type
    if (fieldType === 'slider') {
      return (
        <ui.Slider
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={item.min || 0}
          max={item.max || 100}
        />
      )
    }

    // Rate type
    if (fieldType === 'rate') {
      return (
        <ui.Rate
          value={value}
          onChange={onChange}
          disabled={disabled}
          count={item.count || 5}
        />
      )
    }

    // Color type
    if (fieldType === 'color') {
      return ui.renderInput({
        type: 'color',
        value,
        onChange,
        disabled,
        readOnly: readonly
      })
    }

    // File/Upload type
    if (fieldType === 'file' || fieldType === 'image') {
      return (
        <ui.Upload
          fileList={value || []}
          onChange={(info) => onChange(info.fileList)}
          disabled={disabled}
          maxCount={item.maxCount || 1}
        />
      )
    }

    // JSON type
    if (fieldType === 'json') {
      return ui.renderTextArea({
        value: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
        onChange: (e) => {
          try {
            const parsed = JSON.parse(e.target.value)
            onChange(parsed)
          } catch (err) {
            onChange(e.target.value)
          }
        },
        placeholder: placeholder || '{}',
        disabled,
        readOnly: readonly,
        rows: item.rows || 6
      })
    }

    // Code type
    if (fieldType === 'code') {
      return ui.renderTextArea({
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        disabled,
        readOnly: readonly,
        rows: item.rows || 10,
        style: { fontFamily: 'monospace', fontSize: '12px' }
      })
    }

    // Tag type
    if (fieldType === 'tag') {
      const tags = Array.isArray(value) ? value : []

      return (
        <div className="fennec-mobile-tag-field">
          {tags.map((tag, index) => (
            <ui.Tag
              key={index}
              closeable={!disabled && !readonly}
              onClose={() => {
                const newTags = tags.filter((_, i) => i !== index)
                onChange(newTags)
              }}
            >
              {tag}
            </ui.Tag>
          ))}
          {!disabled && !readonly && (
            <ui.SearchBar
              placeholder="Add tag"
              onSearch={(val) => {
                if (val) {
                  onChange([...tags, val])
                }
              }}
            />
          )}
        </div>
      )
    }

    // Default fallback
    return ui.renderInput({
      value: value?.toString() || '',
      onChange,
      placeholder,
      disabled,
      readOnly: readonly
    })
  }

  // Render field with label
  return (
    <div className="fennec-field-mobile">
      {label && (
        <div className="fennec-field-mobile-label">
          {label}
          {required && <span className="fennec-required">*</span>}
        </div>
      )}
      <div className="fennec-field-mobile-control">
        {renderField()}
      </div>
    </div>
  )
}

export default FieldMobileRenderer
