/**
 * Fennec Core - TypeScript Definitions
 *
 * Modern React UI library with UI-agnostic architecture
 *
 * @version 2.3.0 - TypeScript definitions
 * @author tarasovin
 * @license MIT
 */

/// <reference types="react" />

import { ComponentType, ReactNode } from 'react';
import { Dayjs } from 'dayjs';

// ==================== UI Adapter System ====================
export * from './adapters/UIAdapter';
export { UIProvider, useUI, useUIOptional } from './adapters/UIContext';
export { UIAdapter } from './adapters/UIAdapter';
export { AntdAdapter } from './adapters/antd/AntdAdapter';
export { AntdMobileAdapter } from './adapters/antd-mobile/AntdMobileAdapter';
export { MaterialUIAdapter } from './adapters/material-ui/MaterialUIAdapter';
export { ChakraUIAdapter } from './adapters/chakra-ui/ChakraUIAdapter';

// ==================== Core Component Logic ====================
export { FieldCore } from './core/components/Field/FieldCore';
export type { FieldMeta, FieldCoreProps } from './core/components/Field/FieldCore';

export { ModelCore } from './core/components/Model/ModelCore';
export type {
  ModelMeta,
  MetaProperty,
  ContextFilter,
  ModelCoreProps
} from './core/components/Model/ModelCore';

export { CollectionCore } from './core/components/Collection/CollectionCore';
export type {
  FilterDefinition,
  SortingState,
  QueryParameter,
  CollectionCoreProps
} from './core/components/Collection/CollectionCore';

export {
  ActionCore,
  ActionModalCore,
  ActionWizardCore,
  ActionFormCore
} from './core/components/Action/ActionCore';
export type { ActionStep, ActionCoreProps } from './core/components/Action/ActionCore';

// ==================== Components ====================
export { Field } from './Components/Desktop/Field/Field';
export type { FieldProps } from './Components/Desktop/Field/Field';

export { Model } from './Components/Desktop/Model/Model';
export type { ModelProps } from './Components/Desktop/Model/Model';

export { Collection } from './Components/Desktop/Collection/Collection';
export type { CollectionProps } from './Components/Desktop/Collection/Collection';

export { Action } from './Components/Desktop/Action/Action';
export type { ActionProps } from './Components/Desktop/Action/Action';

// ==================== Mobile Renderers (v2.2.0) ====================
export { FieldMobileRenderer } from './Components/Desktop/Field/FieldMobileRenderer';
export { ModelMobileRenderer } from './Components/Desktop/Model/ModelMobileRenderer';
export { CollectionMobileRenderer } from './Components/Desktop/Collection/CollectionMobileRenderer';
export { ActionMobileRenderer } from './Components/Desktop/Action/ActionMobileRenderer';

// ==================== Context & Providers ====================
export { AuthService, AuthProvider, useAuth, useNavigation, RequireAuth } from './Auth';
export { UserConfigProvider } from './UserConfig';
export { TranslateProvider } from './Translate';
export { MetaProvider } from './Meta';

export {
  UserContext,
  useUserContext,
  UserConfigContext,
  useUserConfigContext,
  TranslateContext,
  useTranslateContext,
  MetaContext,
  useMetaContext,
  useCollectionRef,
  useActionRef,
  FormObserverContext,
  useFormObserverContext,
  ClipboardContext,
  useClipboardContext
} from './Components/Context';

// ==================== Utility Functions ====================

// PubSub
export function publish(event: string, data?: any): void;
export function subscribe(event: string, callback: (msg: string, data: any) => void): string;
export function unsubscribe(token: string | ((msg: string, data: any) => void)): void;

// Roles
export function HasRole(roles: string[], requiredRoles: string[]): boolean;
export function HasRoleID(roles: number[], requiredRoleIDs: number[]): boolean;

// Utils
export function unwrap<T>(value: T | (() => T)): T;
export function clean(obj: any): any;
export function If(condition: boolean, ifTrue: any, ifFalse?: any): any;
export function IfElse(condition: boolean, ifTrue: any, ifFalse: any): any;
export function And(...conditions: boolean[]): boolean;
export function Or(...conditions: boolean[]): boolean;
export function uncapitalize(str: string): string;

// Query
export function QueryParams(params: any[]): string;
export function QueryFunc(func: string, params?: any[]): string;
export function QueryParam(name: string, value: any): any;
export function ObjectToQueryParam(obj: any): any;
export function QueryOrder(field: string, order: 'ASC' | 'DESC'): any;
export function QueryDetail(level: 'SIMPLE' | 'NORMAL' | 'DETAIL'): any;

// CRUD Operations
export function CREATE(endpoint: string, data: any): Promise<any>;
export function READ(endpoint: string, id: any): Promise<any>;
export function READWITH(endpoint: string, id: any, params: any[]): Promise<any>;
export function UPDATE(endpoint: string, id: any, data: any): Promise<any>;
export function DELETE(endpoint: string, id: any): Promise<any>;
export function POST(endpoint: string, data: any): Promise<any>;
export function POSTFormData(endpoint: string, formData: FormData): Promise<any>;
export function GET(endpoint: string): Promise<any>;
export function GETWITH(endpoint: string, params: any[]): Promise<any>;

// CRUD Operations with Promises
export function CREATEP(endpoint: string, data: any): Promise<any>;
export function READP(endpoint: string, id: any): Promise<any>;
export function READWITHP(endpoint: string, id: any, params: any[]): Promise<any>;
export function UPDATEP(endpoint: string, id: any, data: any): Promise<any>;
export function DELETEP(endpoint: string, id: any): Promise<any>;
export function POSTP(endpoint: string, data: any): Promise<any>;
export function POSTFormDataP(endpoint: string, formData: FormData): Promise<any>;
export function GETP(endpoint: string): Promise<any>;
export function GETWITHP(endpoint: string, params: any[]): Promise<any>;

// Comparison
export function equals(a: any, b: any): boolean;

// Filters
export function contextFilterToObject(filters: any[]): any;
export function contextFilterToQueryFilters(filters: any[]): any[];
export function ContextFiltersToQueryFilters(filters: any[]): any[];
export function queryFiltersToContextFilter(filters: any[]): any[];
export function QueryFiltersToContextFilters(filters: any[]): any[];
export function ObjectToContextFilters(obj: any): any[];
export function queryFilterByItem(item: any, filter: any): boolean;
export function filterByItem(item: any, filter: any): boolean;
export function FilterToQueryParameters(filter: any): any[];
export function QueryParametersToFilters(params: any[]): any;

// Error Handling
export class FennecError extends Error {
  constructor(message: string, code?: string, details?: any);
  code?: string;
  details?: any;
}

export function errorCatch(error: any): void;
export function errorAlert(error: any): void;
export function messageError(error: any): void;

// Array Operations
export function arrayUnpack(array: any[]): any[];
export function upgradeInArray(array: any[], item: any, idField?: string): any[];
export function createInArray(array: any[], item: any): any[];
export function updateInArray(array: any[], item: any, idField?: string): any[];
export function deleteInArray(array: any[], item: any, idField?: string): any[];
export function triggerInArray(callback: Function, array: any[], item: any, idField?: string): any[];
export function emptyInArray(array: any[]): any[];
export function undefinedInArray(array: any[]): any[];
export function createArrayInArray(array: any[], items: any[]): any[];
export function updateArrayInArray(array: any[], items: any[], idField?: string): any[];
export function deleteArrayInArray(array: any[], items: any[], idField?: string): any[];
export function triggerArrayInArray(callback: Function, array: any[], items: any[], idField?: string): any[];

// Form Data
export function makeFormData(obj: any): FormData;
export function unpackFormFields(formData: FormData): any;

// Event Handling
export function preventDefault(event: Event): void;
export function eventExecution(callback: Function): (event: Event) => void;
export function detectMutation(obj: any): boolean;

// Request
export function Request(config: any): Promise<any>;

// History
export function pushStateHistoryModal(state: any, title: string, url: string): void;

// Storage
export const ycStorage: {
  get(key: string): any;
  set(key: string, value: any): void;
  remove(key: string): void;
  clear(): void;
};

// JSX Utilities
export function JSX(component: ComponentType<any>, props?: any): ReactNode;
export function JSXMap(items: any[], renderFn: (item: any, index: number) => ReactNode): ReactNode[];
export function JSXPathMap(obj: any, path: string, renderFn: (item: any, index: number) => ReactNode): ReactNode[];
export function JSXIndex(index: number, items: ReactNode[]): ReactNode;

// Meta Utilities
export function GetMetaPropertyByPath(meta: any, path: string): any;
export function GetMetaProperties(meta: any): any[];
export function SetMetaProperties(meta: any, properties: any[]): any;
export function GetMeta(meta: any | (() => any)): any;

export function updateInProperties(properties: any[], property: any): any[];
export function deleteInProperties(properties: any[], property: any): any[];
export function triggerInProperties(callback: Function, properties: any[], property: any): any[];

export function updateInPropertiesUUID(properties: any[], property: any): any[];
export function deleteInPropertiesUUID(properties: any[], property: any): any[];
export function triggerInPropertiesUUID(callback: Function, properties: any[], property: any): any[];

export function foreachInProperties(properties: any[], callback: Function): void;
export function updatePropertiesInProperties(properties: any[], updates: any[]): any[];
export function deletePropertiesInProperties(properties: any[], toDelete: any[]): any[];
export function triggerPropertiesInProperties(callback: Function, properties: any[], updates: any[]): any[];

// Display Utilities
export function getObjectValue(obj: any, field: string): any;
export function getObjectValueOrDefault(obj: any, field: string, defaultValue: any): any;
export function getObjectDisplay(obj: any, meta: any): string;
export function getFieldDisplay(value: any, field: any): string;
export function getDisplay(value: any, field: any): string;
export function metaGetCloneObject(meta: any): any;
export function metaGetFieldByName(meta: any, name: string): any;
export function getSortingDisplayFields(meta: any): any[];
export function typeIsNumber(type: string): boolean;
export function getFormatFieldValueTableView(value: any, field: any): any;
export function priceFormat(value: number): string;

// Validation
export function MetaColumns(meta: any): any[];
export function isRequired(meta: any): boolean;
export function validator(rule: any, value: any, callback: Function): void;
export function formItemRules(meta: any): any[];

// Locator Constants
export const LOCATOR_TYPES: {
  INPUT: string;
  BUTTON: string;
  LINK: string;
  SELECT: string;
  CHECKBOX: string;
  RADIO: string;
  TEXTAREA: string;
  [key: string]: string;
};

export const LOCATOR_ACTIONS: {
  CLICK: string;
  CHANGE: string;
  SUBMIT: string;
  FOCUS: string;
  BLUR: string;
  [key: string]: string;
};

export function getLocator(type: string, name: string, action?: string): string;
export function getAILocator(description: string): string;

// ==================== Module Namespaces ====================
// Modular exports for tree-shaking and better code organization

export * as PubSub from './core/pubsub';
export * as Roles from './core/roles';
export * as UtilsCore from './core/utils';
export * as CRUD from './core/crud';
export * as ErrorHandling from './core/error';
export * as Query from './core/query';
export * as Validation from './core/validation';
export * as Meta from './core/meta';
