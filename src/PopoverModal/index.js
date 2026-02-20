import React from 'react';
import { Popover } from 'antd';

/**
 * Popover with trigger and controlled open state.
 * Uses antd Popover for consistent styling with Collection/Field components.
 */
export function PopoverModal({ title, open, setOpen, trigger, children }) {
  return (
    <Popover
      title={title}
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      content={<div onClick={(e) => e.stopPropagation()}>{children}</div>}
    >
      {trigger}
    </Popover>
  );
}
