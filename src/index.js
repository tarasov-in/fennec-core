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


// ==================== Context & Providers ====================
export {
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


// ==================== Mobile Components  ====================
// Mobile Renderers - используют Desktop Core логику + Mobile UI
export { FieldMobileRenderer } from './Components/Desktop/Field/FieldMobileRenderer'
export { ModelMobileRenderer } from './Components/Desktop/Model/ModelMobileRenderer'
export { CollectionMobileRenderer } from './Components/Desktop/Collection/CollectionMobileRenderer'
export { ActionMobileRenderer } from './Components/Desktop/Action/ActionMobileRenderer'
