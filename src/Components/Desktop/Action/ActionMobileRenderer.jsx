/**
 * ActionMobileRenderer - Mobile UI Renderer for Action Component
 *
 * Uses ActionCore (Desktop) for ALL business logic
 * Only renders UI using AntdMobileAdapter
 *
 * KEY DIFFERENCE: Desktop uses Modal, Mobile uses Popup/CenterPopup
 *
 * @version 2.2.0
 */

import React from 'react'
import { useUI } from '../../../adapters/UIContext'

/**
 * ActionMobileRenderer
 *
 * @param {Object} props
 * @param {Object} props.renderProps - Render props from ActionCore.getRenderProps()
 */
export function ActionMobileRenderer({ renderProps, footerStyle, footerClassName, backButtonStyle, wizardProgressStyle, wizardProgressStepStyle, wizardProgressBarStyle, contentStyle, contentClassName, popupStyle, headerStyle, headerClassName }) {
  const ui = useUI() // AntdMobileAdapter

  const {
    modalProps,
    currentForm: FormComponent,
    currentObject,
    loading,
    isWizard,
    wizardProps,
    buttonText,
    onOk,
    onBack,
    onClose,
    triggerElement
  } = renderProps

  /**
   * Render footer with action buttons
   */
  const renderFooter = () => {
    const buttons = []

    // Back button for wizard
    if (isWizard && buttonText.showBack) {
      buttons.push(
        ui.renderButton({
          key: 'back',
          onClick: onBack,
          children: buttonText.back,
          style: backButtonStyle
        })
      )
    }

    // OK/Next/Finish button
    buttons.push(
      ui.renderButton({
        key: 'ok',
        type: 'primary',
        loading,
        onClick: onOk,
        children: buttonText.ok
      })
    )

    return (
      <div
        className={footerClassName}
        style={footerStyle}
      >
        {buttons}
      </div>
    )
  }

  /**
   * Render wizard progress indicator
   */
  const renderWizardProgress = () => {
    if (!isWizard || !wizardProps) return null

    const { currentStep, totalSteps, progress } = wizardProps

    return (
      <div
        className="fennec-action-mobile-wizard-progress"
        style={wizardProgressStyle}
      >
        <div style={wizardProgressStepStyle}>
          Step {currentStep + 1} of {totalSteps}
        </div>
        <ui.Progress
          percent={progress}
          style={wizardProgressBarStyle}
        />
      </div>
    )
  }

  /**
   * Render form content
   */
  const renderContent = () => {
    if (!FormComponent) return null

    return (
      <div className={contentClassName} style={contentStyle}>
        <FormComponent object={currentObject} />
      </div>
    )
  }

  // Mobile uses Popup instead of Modal
  // Use CenterPopup for better mobile UX
  return (
    <>
      {/* Trigger element (button) */}
      {triggerElement}

      {/* Mobile Popup */}
      <ui.CenterPopup
        visible={modalProps.visible}
        onClose={onClose}
        showCloseButton
        style={popupStyle}
      >
        <div className="fennec-action-mobile">
          {/* Header */}
          {modalProps.title && (
            <div
              className={headerClassName}
              style={headerStyle}
            >
              {modalProps.title}
            </div>
          )}

          {/* Wizard Progress */}
          {renderWizardProgress()}

          {/* Content */}
          {renderContent()}

          {/* Footer */}
          {renderFooter()}
        </div>
      </ui.CenterPopup>
    </>
  )
}

export default ActionMobileRenderer
