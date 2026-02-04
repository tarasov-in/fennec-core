/**
 * Utils модуль
 *
 * Предоставляет утилитарные функции общего назначения
 */

export * from './locator'
export * from './comparison'
export * from './functional'
export * from './array'
export * from './object'
export * from './display'
export * from './form'
export * from './jsx'

// Реэкспорт для ModelCore (meta + validation)
export { GetMeta, GetMetaProperties, GetMetaPropertyByPath } from '../meta'
export { formItemRules, isRequired } from '../validation'

// Реэкспорт для CollectionCore (query)
export {
  ContextFiltersToQueryFilters,
  contextFilterToObject,
  QueryParam,
  QueryFunc,
  QueryDetail
} from '../query'

// Реэкспорт для CollectionRenderer (crud + error + pubsub)
export { GET, GETWITH, READWITH } from '../crud'
export { errorCatch } from '../error'
export { subscribe, unsubscribe } from '../pubsub'

// Будут добавлены в следующих итерациях:
// export * from './string'
// export * from './jsx'
// export * from './history'
// export * from './storage'
// export * from './events'
