/**
 * Meta module
 * Functions for working with metadata structures
 */

// Metadata access
export { GetMeta } from './GetMeta'

// Properties manipulation
export {
  GetMetaProperties,
  SetMetaProperties,
  GetMetaPropertyByPath
} from './properties'

// Helpers
export {
  metaGetCloneObject,
  metaGetFieldByName,
  getSortingDisplayFields
} from './helpers'

// Table columns generation
export { MetaColumns } from './MetaColumns'
