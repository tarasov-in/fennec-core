/**
 * ModelCore - Business logic for Model component
 *
 * Handles model properties extraction, filtering, validation,
 * and form operations without any UI dependencies.
 *
 * @version 2.3.0 - TypeScript definitions
 */

import { FieldMeta } from '../Field/FieldCore';

export interface MetaProperty extends FieldMeta {
  name: string;
  relation?: {
    type: 'one-many' | 'many-one' | 'one-one' | 'many-many';
    target?: string;
    mappedBy?: string;
    fetch?: 'LAZY' | 'EAGER';
  };
  embedded?: boolean;
  transient?: boolean;
}

export interface ModelMeta {
  name?: string;
  label?: string;
  properties?: MetaProperty[];
  endpoints?: {
    create?: string;
    read?: string;
    update?: string;
    delete?: string;
    list?: string;
  };
  [key: string]: any;
}

export interface ContextFilter {
  name: string;
  value: any;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'between';
}

export interface ModelCoreProps {
  meta: ModelMeta | (() => ModelMeta);
  object?: Record<string, any>;
  contextFilters?: ContextFilter[];
  scheme?: string[];
  linksCompareFunction?: (property: MetaProperty) => string | undefined;
}

/**
 * ModelCore class - Pure business logic for Model component
 */
export class ModelCore {
  props: ModelCoreProps;
  meta: ModelMeta;
  object?: Record<string, any>;
  contextFilters?: ContextFilter[];
  scheme?: string[];
  linksCompareFunction?: (property: MetaProperty) => string | undefined;

  constructor(props: ModelCoreProps);

  /**
   * Gets all properties from metadata
   */
  getProperties(): MetaProperty[];

  /**
   * Gets filtered properties (excluding ID and one-to-many relations)
   * @returns Properties suitable for form fields
   */
  getFilteredProperties(): MetaProperty[];

  /**
   * Gets one-to-many relation properties
   * @returns Relations suitable for tabs/collections
   */
  getOneToManyRelations(): MetaProperty[];

  /**
   * Gets validation rules for all properties
   */
  getValidationRules(): Record<string, any[]>;

  /**
   * Gets initial values from object
   */
  getInitialValues(): Record<string, any>;

  /**
   * Validates object against metadata
   */
  validate(object: Record<string, any>): Promise<Record<string, any>>;

  /**
   * Gets property by name
   */
  getProperty(name: string): MetaProperty | undefined;

  /**
   * Checks if property is required
   */
  isPropertyRequired(name: string): boolean;
}
