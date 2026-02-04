/**
 * Collection - Modern Collection/Table component with UI-agnostic architecture
 *
 * Uses CollectionCore (business logic) + CollectionRenderer (UI via UIAdapter)
 * v2.2.0: Added automatic Desktop/Mobile responsive switching
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { ComponentType, ReactNode } from 'react';
import {
  FilterDefinition,
  SortingState,
  CollectionCoreProps
} from '../../../core/components/Collection/CollectionCore';
import { ModelMeta, ContextFilter } from '../../../core/components/Model/ModelCore';
import { ColumnDef, PaginationConfig } from '../../../adapters/UIAdapter';

/**
 * Context passed to Collection render(items, context)
 */
export interface CollectionRenderContext {
  collection: any[];
  setCollection: (items: any[] | ((prev: any[]) => any[])) => void;
  setCollectionItem: (item: any) => void;
  removeCollectionItem: (item: any) => void;
  collectionActions?: any[];
  modelActions?: any[];
  update: (filter?: Record<string, any>) => void;
  lastFuncStat?: any;
  lock: () => void;
  unlock: () => void;
  loading: boolean;
}

/**
 * Context passed to renderShell({ children, ...shellContext }).
 * User builds the entire layout; toolbar, filters, pagination, fullscreen are optional.
 */
export interface CollectionShellContext extends CollectionRenderContext {
  hasFilters: boolean;
  filters?: any[];
  sorting: any;
  setSorting: (s: any) => void;
  state: Record<string, any>;
  filtered: boolean;
  setFiltered: (v: boolean | ((prev: boolean) => boolean)) => void;
  _onFilterChange: (newFilter: Record<string, any>) => void;
  applyFilter: () => void;
  clearFilter: () => void;
  setBounding: (rect: DOMRect) => void;
  bounding?: DOMRect;
  pagination: {
    enabled: boolean;
    current: number;
    total: number;
    count: number;
    totalPages: number;
    setCurrent: (v: number) => void;
    setCount: (v: number) => void;
  };
  fullscreen: {
    allowed: boolean;
    fullscreen: boolean;
    setFullscreen: (v: boolean | ((prev: boolean) => boolean)) => void;
  };
  auth?: any;
  locator?: string;
  object?: any;
  name?: string;
  fieldName?: string;
  getLocator: (base: string, object?: any) => string;
  adapter: any;
}

export interface CollectionProps {
  /**
   * Render function: (items, context) => JSX. Defines how collection items are displayed.
   */
  render: (items: any[], context: CollectionRenderContext) => ReactNode;

  /**
   * Optional. When provided, defines the entire layout (toolbar, filters, pagination are optional).
   * Receives { children, ...shellContext }; children = result of render(items, context).
   */
  renderShell?: (props: { children: ReactNode } & CollectionShellContext) => ReactNode;

  /**
   * Collection name
   */
  name?: string;

  /**
   * Metadata object or function that returns metadata
   */
  meta: ModelMeta | (() => ModelMeta);

  /**
   * Data source (array of objects)
   */
  dataSource?: any[];

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Filter definitions
   */
  filters?: FilterDefinition[];

  /**
   * Context filters for related data
   */
  contextFilters?: ContextFilter[];

  /**
   * Query detail level
   * @default 'NORMAL'
   */
  queryDetail?: 'SIMPLE' | 'NORMAL' | 'DETAIL';

  /**
   * Current page number
   * @default 1
   */
  current?: number;

  /**
   * Items per page
   * @default 10
   */
  pageSize?: number;

  /**
   * Total number of items
   */
  total?: number;

  /**
   * Pagination configuration
   */
  pagination?: false | PaginationConfig;

  /**
   * Current sorting state
   */
  sorting?: SortingState;

  /**
   * Change handler for pagination, filters, sorting
   */
  onChange?: (
    pagination: PaginationConfig,
    filters: Record<string, any>,
    sorter: SortingState
  ) => void;

  /**
   * Row click handler
   */
  onRowClick?: (record: any) => void;

  /**
   * Row double click handler
   */
  onRowDoubleClick?: (record: any) => void;

  /**
   * Custom columns configuration
   */
  columns?: ColumnDef[];

  /**
   * Row selection configuration
   */
  rowSelection?: {
    selectedRowKeys?: string[];
    onChange?: (selectedRowKeys: string[], selectedRows: any[]) => void;
    type?: 'checkbox' | 'radio';
  };

  /**
   * Row key field name
   * @default 'id'
   */
  rowKey?: string | ((record: any) => string);

  /**
   * Expandable row configuration
   */
  expandable?: {
    expandedRowRender?: (record: any) => ReactNode;
    rowExpandable?: (record: any) => boolean;
  };

  /**
   * CSS class name
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: React.CSSProperties;

  /**
   * Show/hide filter UI
   * @default true
   */
  showFilters?: boolean;

  /**
   * Show/hide sorting UI
   * @default true
   */
  showSorting?: boolean;

  /**
   * Custom toolbar actions
   */
  toolbarActions?: ReactNode;

  /**
   * Enable virtual scrolling for large datasets
   * @default false
   */
  virtual?: boolean;

  /**
   * Additional props passed to underlying Table component
   */
  [key: string]: any;
}

/**
 * Collection Component
 *
 * @example
 * ```tsx
 * // Simple table
 * <Collection
 *   meta={userMeta}
 *   dataSource={users}
 *   loading={loading}
 * />
 *
 * // Table with server-side pagination
 * <Collection
 *   meta={orderMeta}
 *   dataSource={orders}
 *   loading={loading}
 *   current={page}
 *   pageSize={20}
 *   total={totalCount}
 *   onChange={(pagination, filters, sorter) => {
 *     loadOrders(pagination.current, pagination.pageSize, filters, sorter);
 *   }}
 * />
 *
 * // Table with filters
 * <Collection
 *   meta={productMeta}
 *   dataSource={products}
 *   filters={[
 *     { name: 'name', type: 'string', operator: 'like' },
 *     { name: 'category', type: 'select', options: categories },
 *     { name: 'price', type: 'integer', operator: 'gte' }
 *   ]}
 *   contextFilters={[
 *     { name: 'active', value: true, operator: 'eq' }
 *   ]}
 * />
 *
 * // Mobile list
 * <Collection
 *   forceMobile={true}
 *   meta={productMeta}
 *   dataSource={products}
 * />
 *
 * // Table with row selection
 * <Collection
 *   meta={taskMeta}
 *   dataSource={tasks}
 *   rowSelection={{
 *     selectedRowKeys: selectedIds,
 *     onChange: setSelectedIds
 *   }}
 * />
 * ```
 */
export const Collection: ComponentType<CollectionProps>;

export default Collection;
