/**
 * ModelMobileRenderer - Mobile UI Renderer for Model Component
 *
 * Uses ModelCore (Desktop) for ALL business logic
 * Only renders UI using AntdMobileAdapter
 *
 * KEY PRINCIPLE: Desktop Core + Mobile UI = Correct Mobile Component
 *
 * @version 2.2.0
 */

import React, { useMemo } from 'react'
import { useUI } from '../../../adapters/UIContext'
import { FieldMobileRenderer } from '../Field/FieldMobileRenderer'
import { FieldCore } from '../../../core/components/Field/FieldCore'

/**
 * ModelMobileRenderer
 *
 * @param {Object} props
 * @param {ModelCore} props.modelCore - Model Core instance (Desktop logic)
 * @param {Object} props.object - Current object/data
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.readonly - Readonly state
 * @param {boolean} props.disabled - Disabled state
 */
export function ModelMobileRenderer(props) {
  const {
    modelCore,
    object,
    onChange,
    readonly,
    disabled
  } = props

  const ui = useUI() // AntdMobileAdapter

  // All logic delegated to ModelCore (Desktop)
  const fields = useMemo(() => modelCore.getFields(), [modelCore])
  const layout = useMemo(() => modelCore.getLayout?.() || 'vertical', [modelCore])

  /**
   * Render single field
   */
  const renderField = (item) => {
    // Create FieldCore instance for this field
    const fieldCore = new FieldCore({ item, object })

    return (
      <div key={item.name} className="fennec-model-mobile-field">
        <FieldMobileRenderer
          fieldCore={fieldCore}
          item={item}
          value={object?.[item.name]}
          onChange={(e) => {
            // Normalize value from event or direct value
            const newValue = e?.target?.value ?? e

            // Update object with new value
            const updatedObject = {
              ...object,
              [item.name]: newValue
            }

            onChange?.(updatedObject)
          }}
          readonly={readonly}
          disabled={disabled}
          object={object}
        />
      </div>
    )
  }

  /**
   * Render fields based on layout
   */
  const renderFields = () => {
    // Vertical layout (default for mobile)
    if (layout === 'vertical') {
      return (
        <div className="fennec-model-mobile-vertical">
          {fields.map(renderField)}
        </div>
      )
    }

    // Horizontal layout (rarely used on mobile)
    if (layout === 'horizontal') {
      return (
        <div className="fennec-model-mobile-horizontal">
          {fields.map(renderField)}
        </div>
      )
    }

    // Grid layout (responsive grid for mobile)
    if (layout === 'grid') {
      return (
        <div className="fennec-model-mobile-grid">
          {fields.map(renderField)}
        </div>
      )
    }

    // Default: vertical
    return (
      <div className="fennec-model-mobile-vertical">
        {fields.map(renderField)}
      </div>
    )
  }

  return (
    <div className="fennec-model-mobile">
      {renderFields()}
    </div>
  )
}

export default ModelMobileRenderer
