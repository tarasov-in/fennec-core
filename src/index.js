import React from 'react'

import {
  AuthService,
  AuthProvider,
  useAuth,
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
} from './Context'

import {
  pushStateHistoryModal, 
  ycStorage,
  ycBucket,
  updateInPropertiesUUID,
  updateInProperties,
  deleteInPropertiesUUID,
  deleteInProperties,
  triggerInPropertiesUUID,
  triggerInProperties,
  foreachInProperties,
  updatePropertiesInProperties,
  deletePropertiesInProperties,
  triggerPropertiesInProperties,
} from './Tool'

// ==================== Context & Providers ====================
export {
  ycStorage,
  ycBucket,
  pushStateHistoryModal,
  updateInPropertiesUUID,
  updateInProperties,
  deleteInPropertiesUUID,
  deleteInProperties,
  triggerInPropertiesUUID,
  triggerInProperties,
  foreachInProperties,
  updatePropertiesInProperties,
  deletePropertiesInProperties,
  triggerPropertiesInProperties,

  AuthService,
  AuthProvider,
  UserConfigProvider,
  TranslateProvider,
  MetaProvider,
  useAuth,
  RequireAuth,

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
}


// ==================== Components ====================
export { Action, FooterButton } from './components/Action'
export { Collection, SortingFieldsUI, FiltersFieldsUI, collectionQueryParams } from './components/Collection'
export { Field } from './components/Field'
export { Model, CollectionByProperty } from './components/Model'

// ==================== UI Adapter System  ====================
export { UIProvider, useUIAdapter, useUIOptional } from './adapters/UIContext'
export { UIAdapter } from './adapters/UIAdapter'
// Adapters are not re-exported from main entry to avoid requiring optional UI libs.
// Import from subpaths when needed: fennec-core/adapters/antd, fennec-core/adapters/chakra-ui, etc.

// ==================== Core Modules  ====================
// Модульные экспорты для tree-shaking и лучшей организации кода
export * from './core/pubsub'
export * from './core/roles'
export * from './core/utils'
export * from './core/crud'
export * from './core/error'
export * from './core/query'
export * from './core/validation'
export * from './core/meta'

