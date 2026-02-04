/**
 * Table columns generation from metadata
 * Migrated from Tool/index.js
 *
 * NOTE: This function has dependencies on display utility functions
 * (getDisplay, getFormatFieldValueTableView, getObjectValue)
 * These will be migrated in the next iteration when creating core/utils/display module
 */

import React from 'react'

/**
 * Generates table columns configuration from metadata properties
 * @param {Array} properties - Metadata properties array
 * @param {Object} meta - Full metadata registry
 * @param {Object} onColumnClick - Column click handlers { columnName: actionName }
 * @returns {Function} Function that returns columns array
 */
export function MetaColumns(properties, meta, onColumnClick) {
  return ({ request, auth, collection, setCollection }) => {
    const click = (record, item) => {
      if (onColumnClick && item && onColumnClick[item.name]) {
        request(record, { action: onColumnClick[item.name] })
      }
    }

    return properties?.map((item, idx) => {
      // For object/document types - use related metadata
      if (item.type === "object" || item.type === "document") {
        // Dependencies from core/utils (will be available after migration):
        // - getObjectValue
        // - getDisplay
        // - uncapitalize

        // Temporary import from Tool for backward compatibility
        const { getObjectValue, getDisplay, uncapitalize } = require('../../Tool')

        let fieldMeta = meta[getObjectValue(item, "relation.reference.object")]
        const display = (display) => {
          if (display.fields) {
            return display
          }
        }

        return ({
          title: item.label,
          render: (text, record, index) => {
            return (
              <div
                style={(onColumnClick && onColumnClick[item.name]) ? { cursor: "pointer", color: "#1890ff" } : {}}
                onClick={() => click(record, item)}
              >
                {getDisplay(record[uncapitalize(item.name)], display(item.relation.display) || display(fieldMeta.display), fieldMeta, meta)}
              </div>
            )
          }
        })
      }

      // For primitive types - use field formatter
      // Dependency: getFormatFieldValueTableView (from core/utils/display)
      const { getFormatFieldValueTableView } = require('../../Tool')

      return ({
        title: item.label,
        render: (text, record, index) => {
          return (
            <div
              style={(onColumnClick && onColumnClick[item.name]) ? { cursor: "pointer", color: "#1890ff" } : {}}
              onClick={() => click(record, item)}
            >
              {getFormatFieldValueTableView(record[item.name.charAt(0).toLowerCase() + item.name.slice(1)], item.type, item)}
            </div>
          )
        }
      })
    })
  }
}
