import React from 'react';

/**
 * Fullscreen overlay wrapper. When open, renders children in a fullscreen layer.
 */
export function Overlay({ open, setOpen, children }) {
  if (!open) {
    return children;
  }
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#fff',
        overflow: 'auto',
      }}
    >
      {children}
    </div>
  );
}
