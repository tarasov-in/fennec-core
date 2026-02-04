/**
 * CollectionMobileRenderer - Mobile UI Renderer for Collection Component
 *
 * Uses CollectionCore (Desktop) for ALL business logic
 * Only renders UI using AntdMobileAdapter
 *
 * KEY DIFFERENCE: Desktop uses Table, Mobile uses List
 *
 * @version 2.2.0
 */

import React, { useMemo } from 'react'
import { useUI } from '../../../adapters/UIContext'

/**
 * CollectionMobileRenderer
 *
 * @param {Object} props
 * @param {CollectionCore} props.collectionCore - Collection Core instance (Desktop logic)
 * @param {Array} props.items - Data items
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onItemClick - Item click handler
 * @param {Function} props.displayFunction - Custom display function
 */
export function CollectionMobileRenderer(props) {
  const {
    collectionCore,
    items = [],
    loading,
    onItemClick,
    displayFunction,
    itemStyle,
    itemClassName,
    itemContentClassName,
    itemArrowClassName
  } = props

  const ui = useUI() // AntdMobileAdapter

  // All logic delegated to CollectionCore (Desktop)
  const display = useMemo(
    () => displayFunction || collectionCore.getDisplayFunction?.(),
    [collectionCore, displayFunction]
  )

  /**
   * Render single item in list
   */
  const renderItem = (item) => {
    // Use display function from Core
    const displayText = display ? display(item) : item.name || item.title || item.ID

    return (
      <div
        className={itemClassName}
        onClick={() => onItemClick?.(item)}
        style={{ cursor: onItemClick ? 'pointer' : 'default', ...(itemStyle || {}) }}
      >
        <div className={itemContentClassName}>
          {displayText}
        </div>
        {onItemClick && (
          <div className={itemArrowClassName}>
            →
          </div>
        )}
      </div>
    )
  }

  // Mobile uses List instead of Table
  return ui.renderList({
    dataSource: items,
    loading,
    renderItem
  })
}

export default CollectionMobileRenderer
