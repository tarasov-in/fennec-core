import React from 'react'

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
import { Model } from './Components/Desktop/Model/Model'
import { Action } from './Components/Desktop/Action/Action'
import { Collection } from './Components/Desktop/Collection/Collection'
import { Overlay } from './Components/Overlay'

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
  useNavigation,
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

  Action,
  Collection,
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
export * from './core/pubsub'
export * from './core/roles'
export * from './core/utils'
export * from './core/crud'
export * from './core/error'
export * from './core/query'
export * from './core/validation'
export * from './core/meta'


// ==================== Core Component Logic  ====================
// UI-Agnostic классы бизнес-логики компонентов
export {
  ActionCore,
  ActionModalCore,
  ActionWizardCore,
  ActionFormCore
} from './core/components/Action/ActionCore'


// ==================== Mobile Components  ====================
// Mobile Renderers - используют Desktop Core логику + Mobile UI
export { FieldMobileRenderer } from './Components/Desktop/Field/FieldMobileRenderer'
export { ModelMobileRenderer } from './Components/Desktop/Model/ModelMobileRenderer'
export { CollectionMobileRenderer } from './Components/Desktop/Collection/CollectionMobileRenderer'
export { ActionMobileRenderer } from './Components/Desktop/Action/ActionMobileRenderer'
