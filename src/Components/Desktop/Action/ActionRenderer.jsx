/**
 * ActionRenderer - Desktop UI Renderer for Action Component
 *
 * Uses UIAdapter for UI library independence
 * Renders modal, form, and navigation controls
 *
 * @version 2.1.0
 */

import React, { useCallback } from 'react'
import { useUI } from '../../../adapters/UIContext'

/**
 * ActionRenderer - Renders Action UI using UIAdapter
 *
 * @param {Object} props
 * @param {Object} props.renderProps - Props from ActionCore.getRenderProps()
 * @param {ReactNode} props.children - Optional custom content
 */
export function ActionRenderer({ renderProps, children, wizardNavStyle, wizardNavProgressStyle, wizardNavStepStyle, briefStyle }) {
  const ui = useUI()

  const {
    // Modal
    modalProps,
    triggerProps,

    // Form
    currentForm: FormComponent,
    currentObject,
    useAntForm,

    // State
    loading,
    submitDisabled,
    isWizard,
    wizardProps,

    // Titles & Text
    titles,
    buttonText,

    // Handlers
    onOk,
    onBack,
    onClose,

    // Mode
    mode,
    brief,
    formWraperStyle,
    triggerStyle
  } = renderProps

  // Handle form submit
  const handleSubmit = useCallback((values) => {
    onOk(values)
  }, [onOk])

  // Render trigger button
  const renderTrigger = () => {
    if (mode === 'modal' && modalProps.visible) {
      // Don't show trigger in controlled visible mode
      return null
    }

    return ui.renderButton({
      ...triggerProps,
      style: triggerStyle,
      children: buttonText.placeholder
    })
  }

  // Render wizard navigation
  const renderWizardNavigation = () => {
    if (!isWizard) {
      return null
    }

    return (
      <div style={wizardNavStyle}>
        {/* Progress */}
        <div style={wizardNavProgressStyle}>
          {ui.renderProgress({
            percent: wizardProps.currentStep / wizardProps.totalSteps * 100,
            showInfo: true,
            format: () => `${wizardProps.currentStep + 1} / ${wizardProps.totalSteps}`
          })}
        </div>

        {/* Step indicator */}
        <div style={wizardNavStepStyle}>
          Шаг {wizardProps.currentStep + 1} из {wizardProps.totalSteps}
        </div>
      </div>
    )
  }

  // Render form content
  const renderFormContent = () => {
    if (!FormComponent) {
      return brief || children || null
    }

    return (
      <div style={formWraperStyle}>
        {brief && <div style={briefStyle}>{brief}</div>}

        {useAntForm ? (
          // Use Ant Design Form wrapper
          ui.renderForm({
            initialValues: currentObject,
            onFinish: handleSubmit,
            children: <FormComponent object={currentObject} />
          })
        ) : (
          // Direct form component without wrapper
          <FormComponent object={currentObject} onSubmit={handleSubmit} />
        )}

        {children}
      </div>
    )
  }

  // Render footer buttons
  const renderFooter = () => {
    const buttons = []

    // Back button (wizard only)
    if (isWizard && buttonText.showBack) {
      buttons.push(
        ui.renderButton({
          key: 'back',
          onClick: onBack,
          disabled: loading,
          children: buttonText.back
        })
      )
    }

    // Cancel button
    buttons.push(
      ui.renderButton({
        key: 'cancel',
        onClick: onClose,
        disabled: loading,
        children: buttonText.dismiss
      })
    )

    // OK/Next/Finish button
    buttons.push(
      ui.renderButton({
        key: 'ok',
        type: 'primary',
        htmlType: 'submit',
        loading: loading,
        disabled: submitDisabled,
        onClick: () => {
          // Form submit will be triggered by htmlType="submit"
          // For non-form actions, we need to call onOk manually
          if (!useAntForm) {
            handleSubmit(currentObject)
          }
        },
        children: buttonText.ok
      })
    )

    return buttons
  }

  // Render modal
  return (
    <>
      {/* Trigger */}
      {renderTrigger()}

      {/* Modal */}
      {ui.renderModal({
        ...modalProps,
        title: titles?.header,
        subTitle: titles?.subheader,
        footer: renderFooter(),
        width: 600,
        destroyOnClose: true,
        children: (
          <>
            {renderWizardNavigation()}
            {renderFormContent()}
          </>
        )
      })}
    </>
  )
}

export default ActionRenderer
