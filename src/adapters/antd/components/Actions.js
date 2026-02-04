import React from 'react'
import {
  Button as AntButton,
  Dropdown as AntDropdown,
  Tooltip as AntTooltip
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
