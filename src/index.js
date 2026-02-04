import React from 'react'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'

import {
  getLocator,
  getAILocator,
  LOCATOR_TYPES,
  LOCATOR_ACTIONS,
  publish,
  subscribe,
  unsubscribe,
  HasRole,
  HasRoleID,
  unwrap,
  clean,
  If,
  IfElse,
  And,
  Or,
  uncapitalize,
  QueryParams,
  QueryFunc,
  QueryParam,
  ObjectToQueryParam,
  QueryOrder,
  QueryDetail,
  CREATE,
  READ,
  READWITH,
  UPDATE,
  DELETE,
  POST,
  POSTFormData,
  GETWITH,
  GET,
  CREATEP,
  READP,
  READWITHP,
  UPDATEP,
  DELETEP,
  POSTP,
  POSTFormDataP,
  GETWITHP,
  GETP,
  equals,
  contextFilterToObject,
  contextFilterToQueryFilters,
  ContextFiltersToQueryFilters,
  queryFiltersToContextFilter,
  QueryFiltersToContextFilters,

  ObjectToContextFilters,
  queryFilterByItem,
  filterByItem,
  FilterToQueryParameters,
  QueryParametersToFilters,
  FennecError,
  errorCatch,
  errorAlert,
  messageError,
  arrayUnpack,
  upgradeInArray,
  createInArray,
  updateInArray,
  deleteInArray,
  triggerInArray,
  emptyInArray,
  undefinedInArray,
  createArrayInArray,
  updateArrayInArray,
  deleteArrayInArray,
  triggerArrayInArray,
  makeFormData,
  unpackFormFields,
  preventDefault,
  eventExecution,
  detectMutation,
  Request,
  pushStateHistoryModal,
  ycStorage,
  JSX,
  JSXMap,
  JSXPathMap,
  JSXIndex,
  GetMetaPropertyByPath,
  GetMetaProperties,
  SetMetaProperties,
  GetMeta,

  updateInProperties,
  deleteInProperties,
  triggerInProperties,

  updateInPropertiesUUID,
  deleteInPropertiesUUID,
  triggerInPropertiesUUID,

  foreachInProperties,
  updatePropertiesInProperties,
  deletePropertiesInProperties,
  triggerPropertiesInProperties,

  getObjectValue,
  getObjectValueOrDefault,
  getObjectDisplay,
  getFieldDisplay,
  getDisplay,
  metaGetCloneObject,
  metaGetFieldByName,
  getSortingDisplayFields,
  typeIsNumber,
  getFormatFieldValueTableView,
  priceFormat,
  MetaColumns,
  isRequired,
  validator,
  formItemRules
} from './Tool'

import {
  AuthService,
  AuthProvider,
  useAuth,
  useNavigation,
  RequireAuth
} from './Auth'

import {
  UserConfigProvider
} from './UserConfig'

import {
  TranslateProvider
} from './Translate'

import {
  MetaProvider
} from './Meta'


import {
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
} from './Components/Context'

import { Field } from './Components/Desktop/Field/Field'

import {
  Model
} from './Components/Desktop/Model/Model'


import { Action } from './Components/Desktop/Action/Action'

// Mobile Renderers
import { FieldMobileRenderer } from './Components/Desktop/Field/FieldMobileRenderer'
import { ModelMobileRenderer } from './Components/Desktop/Model/ModelMobileRenderer'
import { CollectionMobileRenderer } from './Components/Desktop/Collection/CollectionMobileRenderer'
import { ActionMobileRenderer } from './Components/Desktop/Action/ActionMobileRenderer'

import { Overlay } from './Components/Overlay'


export {
  getLocator,
  getAILocator,
  LOCATOR_TYPES,
  LOCATOR_ACTIONS,
  publish,
  subscribe,
  unsubscribe,
  HasRole,
  HasRoleID,
  unwrap,
  clean,
  If,
  IfElse,
  And,
  Or,
  uncapitalize,
  QueryParams,
  QueryFunc,
  QueryParam,
  ObjectToQueryParam,
  QueryOrder,
  QueryDetail,
  CREATE,
  READ,
  READWITH,
  UPDATE,
  DELETE,
  POST,
  POSTFormData,
  GETWITH,
  GET,
  CREATEP,
  READP,
  READWITHP,
  UPDATEP,
  DELETEP,
  POSTP,
  POSTFormDataP,
  GETWITHP,
  GETP,
  equals,
  
  contextFilterToObject,
  contextFilterToQueryFilters,
  ContextFiltersToQueryFilters,
  queryFiltersToContextFilter,
  QueryFiltersToContextFilters,

  ObjectToContextFilters,
  queryFilterByItem,
  filterByItem,
  FilterToQueryParameters,
  QueryParametersToFilters,
  FennecError,
  errorCatch,
  errorAlert,
  messageError,
  arrayUnpack,
  upgradeInArray,
  createInArray,
  updateInArray,
  deleteInArray,
  triggerInArray,
  emptyInArray,
  undefinedInArray,
  createArrayInArray,
  updateArrayInArray,
  deleteArrayInArray,
  triggerArrayInArray,
  makeFormData,
  unpackFormFields,
  preventDefault,
  eventExecution,
  detectMutation,
  Request,
  pushStateHistoryModal,
  ycStorage,
  JSX,
  JSXMap,
  JSXPathMap,
  JSXIndex,
  GetMetaPropertyByPath,
  GetMetaProperties,
  SetMetaProperties,
  GetMeta,
  updateInProperties,
  deleteInProperties,
  triggerInProperties,
  updateInPropertiesUUID,
  deleteInPropertiesUUID,
  triggerInPropertiesUUID,
  foreachInProperties,
  updatePropertiesInProperties,
  deletePropertiesInProperties,
  triggerPropertiesInProperties,
  getObjectValue,
  getObjectValueOrDefault,
  getObjectDisplay,
  getFieldDisplay,
  getDisplay,
  metaGetCloneObject,
  metaGetFieldByName,
  getSortingDisplayFields,
  typeIsNumber,
  getFormatFieldValueTableView,
  priceFormat,
  MetaColumns,
  isRequired,
  validator,
  formItemRules
}
export {
  AuthService,
  AuthProvider,
  UserConfigProvider,
  TranslateProvider,
  MetaProvider,
  useAuth,
  useNavigation,
  RequireAuth,

  Action,

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
  useClipboardContext,

  Field,
  Model,
  Overlay
}


// ==================== UI Adapter System  ====================
export { UIProvider, useUI, useUIOptional } from './adapters/UIContext'
export { UIAdapter } from './adapters/UIAdapter'
// Adapters are not re-exported from main entry to avoid requiring optional UI libs.
// Import from subpaths when needed: fennec-core/adapters/antd, fennec-core/adapters/chakra-ui, etc.

// ==================== Core Modules  ====================
// Модульные экспорты для tree-shaking и лучшей организации кода
// Также доступны через старый Tool экспорт для обратной совместимости
export * as PubSub from './core/pubsub'
export * as Roles from './core/roles'
export * as UtilsCore from './core/utils'
export * as CRUD from './core/crud'
export * as ErrorHandling from './core/error'
export * as Query from './core/query'
export * as Validation from './core/validation'
export * as Meta from './core/meta'

// ==================== Core Component Logic  ====================
// UI-Agnostic классы бизнес-логики компонентов
export {
  ActionCore,
  ActionModalCore,
  ActionWizardCore,
  ActionFormCore
} from './core/components/Action/ActionCore'

// ==================== Components ====================
// Field, Model, Action уже экспортируются в блоке выше; Collection — только здесь
export { Collection } from './Components/Desktop/Collection/Collection'

// ==================== Mobile Components  ====================
// Mobile Renderers - используют Desktop Core логику + Mobile UI
export { FieldMobileRenderer } from './Components/Desktop/Field/FieldMobileRenderer'
export { ModelMobileRenderer } from './Components/Desktop/Model/ModelMobileRenderer'
export { CollectionMobileRenderer } from './Components/Desktop/Collection/CollectionMobileRenderer'
export { ActionMobileRenderer } from './Components/Desktop/Action/ActionMobileRenderer'
