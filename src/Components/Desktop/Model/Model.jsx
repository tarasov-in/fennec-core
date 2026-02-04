/**
 * Model - New Model component using ModelCore and ModelRenderer
 *
 * Clean API for rendering model forms with metadata-driven fields.
 * Uses UI adapter for complete UI library independence.
 * Added responsive Desktop/Mobile automatic switching
 */

import React, { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { ModelRenderer } from '../../../core/components/Model/ModelRenderer'
import { ModelMobileRenderer } from './ModelMobileRenderer'
import { GetMeta } from '../../../core/utils'

/**
 * Model Component
 *
 * @param {Object} props - Component props
 * @param {Object} props.auth - Authentication context
 * @param {Object} props.form - Ant Design Form instance
 * @param {string} props.name - Model name (e.g., "User", "Product")
 * @param {Object} props.meta - Model metadata
 * @param {Object} props.options - Form options
 * @param {Object} props.object - Current object data (for edit mode)
 * @param {Object} props.data - Additional data
 * @param {string} props.locator - Data locator for testing
 * @param {Function} props.submit - Form submit handler
 * @param {Object} props.funcStat - Function statistics from backend
 * @param {Array} props.contextFilters - Context filters to exclude from form
 * @param {string|Object} props.links - Links configuration ('inline' or object)
 * @param {Array} props.scheme - Schema for filtering properties
 * @param {Function} props.linksCompareFunction - Custom compare function for links
 * @param {Object} props.contextObject - Context object for relations
 * @param {string} props.queryDetail - Query detail level
 * @param {Function} props.modelActions - Model actions generator
 * @param {Function} props.collectionActions - Collection actions generator
 * @param {React.ReactNode} props.subheader - Optional subheader component
 *
 * @example
 * // Basic usage
 * <Model
 *   form={form}
 *   name="User"
 *   meta={userMeta}
 *   object={user}
 *   submit={handleSubmit}
 * />
 *
 * @example
 * // With one-to-many relations
 * <Model
 *   form={form}
 *   name="Company"
 *   meta={companyMeta}
 *   object={company}
 *   links="inline"
 *   scheme={['employees', 'departments']}
 *   submit={handleSubmit}
 * />
 */
export function Model(props) {
  const { subheader, forceMobile } = props

  // Автоматическое определение Desktop/Mobile
  const isSystemMobile = useMediaQuery({ maxWidth: 768 })
  const isMobile = forceMobile !== undefined ? forceMobile : isSystemMobile

  // Validate metadata
  const xmeta = GetMeta(props.meta)
  if (!xmeta) {
    console.warn('Model: Invalid metadata provided')
    return null
  }

  // Выбор рендерера на основе Desktop/Mobile
  // ВАЖНО: ModelCore логика одинакова для Desktop и Mobile!
  const Renderer = useMemo(
    () => (isMobile ? ModelMobileRenderer : ModelRenderer),
    [isMobile]
  )

  return (
    <>
      {subheader || null}
      <Renderer {...props} />
    </>
  )
}
