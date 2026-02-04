/**
 * Collection - Clean API component for Collection
 *
 * Отображает коллекцию через единственный проп render(items, context).
 * Пользователь задаёт разметку в render; фильтры, пагинация и действия в шапке — из коробки.
 */

import React from 'react'
import { CollectionRenderer } from '../../../core/components/Collection'

/**
 * Collection component
 *
 * @param {Object} props
 * @param {Object} props.auth - Authentication object
 * @param {string} props.name - Collection name (model name from metadata)
 * @param {string} props.fieldName - Alternative field name
 * @param {Object} props.meta - Metadata object
 * @param {Function} props.filters - Function that returns filter definitions array
 * @param {Array} props.contextFilters - Context filters array
 * @param {string|Function} props.source - Data source (URL or function)
 * @param {string} props.queryDetail - Query detail level (default: 'model')
 * @param {Function} props.render - (items, context) => JSX. context: { collection, setCollection, setCollectionItem, removeCollectionItem, collectionActions, modelActions, update, lastFuncStat, lock, unlock, loading }
 * @param {Function} [props.renderShell] - ({ children, ...shellContext }) => JSX. Defines entire layout; toolbar, filters, pagination are optional. When set, default header/footer are not rendered.
 * @param {Array} props.collectionActions - Actions for entire collection
 * @param {Array} props.modelActions - Actions for individual items
 * @param {Function} props.onCollectionChange - Callback when collection changes
 * @param {Function} props.onSetCollection - Transform collection before setting
 * @param {string} props.locator - Data locator for testing
 * @param {boolean} props.pagination - Enable pagination (default: true)
 * @param {boolean} props.allowFullscreen - Enable fullscreen mode (default: false)
 * @param {Function} props.onApplyFilter - Callback when filter is applied
 * @param {boolean} props.disableScrollTo - Disable scroll to top on page change
 *
 * @example
 * ```jsx
 * <Collection
 *   auth={auth}
 *   name="User"
 *   source="/api/users"
 *   filters={() => [
 *     { name: 'name', label: 'Name', type: 'string', filter: true, sort: true },
 *     { name: 'email', label: 'Email', type: 'string', filter: true },
 *     { name: 'age', label: 'Age', type: 'integer', filter: true, sort: true }
 *   ]}
 *   render={(items, { loading }) => <Spin spinning={loading}>{JSXMap(items, (item, i) => <div key={i}>{item.name}</div>)}</Spin>}
 * />
 * ```
 */
export function Collection(props) {
  return <CollectionRenderer {...props} />
}
