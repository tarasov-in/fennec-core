import React from 'react'
import {
  Button as AntButton,
  Dropdown as AntDropdown,
  Tooltip as AntTooltip,
  Popover as AntPopover
} from 'antd'

/**
 * Button компонент - обертка над Ant Design Button
 */
export function Button({
  onClick,
  type = 'default',
  disabled,
  loading,
  icon,
  children,
  ...rest
}) {
  return (
    <AntButton
      onClick={onClick}
      type={type}
      disabled={disabled}
      loading={loading}
      icon={icon}
      {...rest}
    >
      {children}
    </AntButton>
  )
}

/**
 * Dropdown компонент - обертка над Ant Design Dropdown
 */
export function Dropdown({
  menu,
  trigger = 'click',
  children,
  ...rest
}) {
  return (
    <AntDropdown
      menu={menu}
      trigger={[trigger]}
      {...rest}
    >
      {children}
    </AntDropdown>
  )
}

/**
 * Tooltip компонент - обертка над Ant Design Tooltip
 */
export function Tooltip({
  title,
  placement = 'top',
  children,
  ...rest
}) {
  return (
    <AntTooltip
      title={title}
      placement={placement}
      {...rest}
    >
      {children}
    </AntTooltip>
  )
}

/**
 * Popover компонент - обертка над Ant Design Popover
 */
export function Popover({
  content,
  title,
  trigger = 'click',
  open,
  onOpenChange,
  children,
  ...rest
}) {
  return (
    <AntPopover
      content={content}
      title={title}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      {...rest}
    >
      {children}
    </AntPopover>
  )
}
