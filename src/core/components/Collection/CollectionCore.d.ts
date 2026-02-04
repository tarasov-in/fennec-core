/**
 * CollectionCore - Business logic for Collection component
 *
 * Handles data loading, filtering, sorting, pagination,
 * and CRUD operations without any UI dependencies.
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { ModelMeta, ContextFilter } from '../Model/ModelCore';

export interface FilterDefinition {
  name: string;
  label?: string;
  type?: string;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
  filtered?: any;
  sorted?: 'ASC' | 'DESC';
  options?: Array<{ label: string; value: any }>;
}

export interface SortingState {
  name: string;
  order: 'ASC' | 'DESC';
}

export interface QueryParameter {
  name: string;
  value: any;
}

export interface CollectionCoreProps {
  name?: string;
  meta: ModelMeta | (() => ModelMeta);
  filters?: FilterDefinition[];
  contextFilters?: ContextFilter[];
  queryDetail?: 'SIMPLE' | 'NORMAL' | 'DETAIL';
}

/**
 * CollectionCore class - Pure business logic for Collection component
 */
export class CollectionCore {
  props: CollectionCoreProps;
  name?: string;
  meta: ModelMeta;
  filters?: FilterDefinition[];
  contextFilters?: ContextFilter[];
  queryDetail?: string;

  constructor(props: CollectionCoreProps);

  /**
   * Generates default filters from filter definitions
   * @returns Object with field names as keys
   */
  getDefaultFilters(filters: FilterDefinition[]): Record<string, any>;

  /**
   * Generates default sorting from filter definitions
   */
  getDefaultSorting(filters: FilterDefinition[]): SortingState;

  /**
   * Builds query parameters for server request
   */
  buildQueryParams(
    filters: FilterDefinition[],
    contextFilters: ContextFilter[],
    filter: Record<string, any>,
    sorting: SortingState,
    current: number,
    count: number,
    queryDetail?: string
  ): QueryParameter[];

  /**
   * Updates item in data array
   */
  updateItem(data: any[], item: any, idField?: string): any[];

  /**
   * Deletes item from data array
   */
  deleteItem(data: any[], item: any, idField?: string): any[];

  /**
   * Gets total count from server response
   */
  getTotalCount(response: any): number;

  /**
   * Gets data array from server response
   */
  getData(response: any): any[];

  /**
   * Validates filter values
   */
  validateFilters(filters: Record<string, any>): boolean;
}
