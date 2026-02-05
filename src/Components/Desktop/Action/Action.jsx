/**
 * Action - Modern Action Component with UI-Agnostic Architecture
 *
 * Clean implementation using ActionCore for business logic
 * and ActionRenderer for UI rendering
 *
 * @version 2.2.0 - Added responsive Desktop/Mobile automatic switching
 */

import React, { useMemo, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { ActionCore } from '../../../core/components/Action/ActionCore'
import { ActionRenderer } from './ActionRenderer'
import { ActionMobileRenderer } from './ActionMobileRenderer'
import { subscribe, unsubscribe } from '../../../core/pubsub'

/**
 * Action Component
 *
 * @param {Object} props
 *
 * Core Props:
 * @param {Component} props.form - Form component for simple action
 * @param {Array<Step>} props.steps - Array of steps for wizard mode
 * @param {Object} props.object - Initial data object
 * @param {Function} props.action - Action callback (values, unlock, close) => void
 * @param {Function} props.modify - Transform values before submission
 * @param {Function} props.callback - Additional callback after action
 *
 * Modal Props:
 * @param {string} props.mode - 'default' | 'modal' | 'drawer'
 * @param {boolean} props.visible - Controlled visibility
 *
 * Text Props:
 * @param {Object} props.titles - { header, subheader }
 * @param {string} props.okText - OK button text
 * @param {string} props.dismissText - Cancel button text
 * @param {string} props.nextText - Next button text (wizard)
 * @param {string} props.backText - Back button text (wizard)
 * @param {string} props.placeholder - Trigger button text
 * @param {ReactNode} props.brief - Brief description
 *
 * Features:
 * @param {boolean} props.noAntForm - Don't use Ant Form wrapper
 * @param {boolean} props.isFormData - Convert to FormData (for file uploads)
 * @param {boolean} props.disabledOkOnUncahngedForm - Disable OK if form unchanged
 * @param {boolean} props.readonly - Readonly mode
 * @param {boolean} props.disabled - Disabled mode
 *
 * PubSub:
 * @param {string} props.fire - Event to open modal
 * @param {string} props.fireClose - Event to close modal
 *
 * Styling:
 * @param {Object} props.triggerStyle - Trigger button style
 * @param {Object} props.triggerOptions - Additional trigger button props
 * @param {Object} props.formWraperStyle - Form wrapper style
 *
 * Refs:
 * @param {Ref} props.actionRef - Ref to access core methods
 */
export function Action(props) {
  const {
    // Core
    form,
    steps,
    object,
    action,
    modify,
    callback,

    // Modal
    mode,
    visible,

    // Text
    titles,
    okText,
    dismissText,
    nextText,
    backText,
    placeholder,
    brief,

    // Features
    noAntForm,
    isFormData,
    disabledOkOnUncahngedForm,
    readonly,
    disabled,

    // PubSub
    fire,
    fireClose,

    // Styling
    triggerStyle,
    triggerOptions,
    formWraperStyle,

    // Refs
    actionRef,

    // Children
    children,

    // Force mobile rendering
    forceMobile,

    ...rendererProps
  } = props

  // Автоматическое определение Desktop/Mobile
  const isSystemMobile = useMediaQuery({ maxWidth: 768 })
  const isMobile = forceMobile !== undefined ? forceMobile : isSystemMobile

  // Create Core instance
  const core = useMemo(
    () => new ActionCore({
      form,
      steps,
      object,
      action,
      modify,
      callback,
      mode,
      visible,
      titles,
      okText,
      dismissText,
      nextText,
      backText,
      placeholder,
      brief,
      noAntForm,
      isFormData,
      disabledOkOnUncahngedForm,
      readonly,
      disabled,
      triggerStyle,
      triggerOptions,
      formWraperStyle
    }),
    [] // Create once
  )

  // State for re-renders on core changes
  const [, forceUpdate] = useState({})
  const triggerRerender = () => forceUpdate({})

  // Update core when props change
  useEffect(() => {
    core.updateProps({
      form,
      steps,
      object,
      action,
      modify,
      callback,
      mode,
      visible,
      titles,
      okText,
      dismissText,
      nextText,
      backText,
      placeholder,
      brief,
      noAntForm,
      isFormData,
      disabledOkOnUncahngedForm,
      readonly,
      disabled,
      triggerStyle,
      triggerOptions,
      formWraperStyle
    })
    triggerRerender()
  }, [
    core, form, steps, object, action, modify, callback, mode, visible,
    titles, okText, dismissText, nextText, backText, placeholder, brief,
    noAntForm, isFormData, disabledOkOnUncahngedForm, readonly, disabled,
    triggerStyle, triggerOptions, formWraperStyle
  ])

  // Subscribe to loading changes to trigger re-render
  useEffect(() => {
    return core.onLoadingChange(() => {
      triggerRerender()
    })
  }, [core])

  // Subscribe to wizard step changes to trigger re-render
  useEffect(() => {
    return core.wizard.onStepChange(() => {
      triggerRerender()
    })
  }, [core])

  // Subscribe to modal open/close to trigger re-render
  useEffect(() => {
    const unregisterOpen = core.modal.onOpen(() => triggerRerender())
    const unregisterClose = core.modal.onClose(() => triggerRerender())
    return () => {
      unregisterOpen()
      unregisterClose()
    }
  }, [core])

  // PubSub integration for fire (open)
  useEffect(() => {
    if (fire) {
      const token = subscribe(fire, (msg, data) => {
        core.modal.open()
        triggerRerender()
      })
      return () => unsubscribe(token)
    }
  }, [fire, core])

  // PubSub integration for fireClose
  useEffect(() => {
    if (fireClose) {
      const token = subscribe(fireClose, (msg, data) => {
        core.modal.close()
        triggerRerender()
      })
      return () => unsubscribe(token)
    }
  }, [fireClose, core])

  // Expose core methods via ref
  useEffect(() => {
    if (actionRef) {
      if (typeof actionRef === 'function') {
        actionRef(core)
      } else if (actionRef.current !== undefined) {
        actionRef.current = core
      }
    }
  }, [actionRef, core])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      core.destroy()
    }
  }, [core])

  // Get render props from core
  const renderProps = useMemo(
    () => core.getRenderProps(),
    [core, core.modal.opened, core.loading, core.wizard.currentStepIndex]
  )

  // Выбор рендерера на основе Desktop/Mobile
  // ВАЖНО: ActionCore логика одинакова для Desktop и Mobile!
  // Desktop использует Modal, Mobile использует CenterPopup
  const Renderer = useMemo(
    () => (isMobile ? ActionMobileRenderer : ActionRenderer),
    [isMobile]
  )

  // Render using selected renderer (rendererProps = style/className etc. passed through)
  return (
    <Renderer
      renderProps={renderProps}
      children={children}
      {...(rendererProps || {})}
    />
  )
}

export default Action
