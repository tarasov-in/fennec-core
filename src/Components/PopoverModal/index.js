/**
 * PopoverModal - модальное окно/попап с контентом и триггером.
 * Реализация на базе Overlay.
 */
import React, { useState } from 'react'
import { Overlay } from '../Overlay'

const defaultOverlayStyle = { position: 'fixed', inset: 0, zIndex: 100 }
const defaultOverlayBackdropStyle = { padding: '5px', backgroundColor: 'rgba(0,0,0,0.4)', height: '100%', width: '100%' }

export function PopoverModal({ open, setOpen, bounding, content, children, overlayStyle, overlayBackdropStyle, contentStyle, contentClassName }) {
  return (
    <>
      {children}
      <Overlay
        open={open}
        setOpen={setOpen}
        overlayStyle={overlayStyle ?? defaultOverlayStyle}
        overlayBackdropStyle={overlayBackdropStyle ?? defaultOverlayBackdropStyle}
        contentStyle={contentStyle ?? { maxWidth: '90vw' }}
        contentClassName={contentClassName}
      >
        {content}
      </Overlay>
    </>
  )
}

export default PopoverModal
