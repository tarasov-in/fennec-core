import React from 'react'
import {
  Modal as AntModal,
  Drawer as AntDrawer,
  Tabs as AntTabs,
  Divider as AntDivider,
  Space as AntSpace,
  Card as AntCard
} from 'antd'

const { TabPane: AntTabPane } = AntTabs

/**
 * Modal компонент - обертка над Ant Design Modal
 */
export function Modal({
  visible,
  onClose,
  title,
  footer,
  width,
  children,
  ...rest
}) {
  return (
    <AntModal
      open={visible}
      onCancel={onClose}
      title={title}
      footer={footer}
      width={width}
      {...rest}
    >
      {children}
    </AntModal>
  )
}

/**
 * Drawer компонент - обертка над Ant Design Drawer
 */
export function Drawer({
  visible,
  onClose,
  title,
  placement = 'right',
  width,
  children,
  ...rest
}) {
  return (
    <AntDrawer
      open={visible}
      onClose={onClose}
      title={title}
      placement={placement}
      width={width}
      {...rest}
    >
      {children}
    </AntDrawer>
  )
}

/**
 * Tabs компонент - обертка над Ant Design Tabs
 */
export function Tabs({
  activeKey,
  onChange,
  items,
  children,
  ...rest
}) {
  return (
    <AntTabs
      activeKey={activeKey}
      onChange={onChange}
      items={items}
      {...rest}
    >
      {children}
    </AntTabs>
  )
}

/**
 * TabPane компонент - обертка над Ant Design TabPane
 */
export function TabPane({ tab, children, ...rest }) {
  return (
    <AntTabPane tab={tab} {...rest}>
      {children}
    </AntTabPane>
  )
}

/**
 * Divider компонент - обертка над Ant Design Divider
 */
export function Divider({
  type = 'horizontal',
  orientation,
  children,
  ...rest
}) {
  return (
    <AntDivider
      type={type}
      orientation={orientation}
      {...rest}
    >
      {children}
    </AntDivider>
  )
}

/**
 * Space компонент - обертка над Ant Design Space
 */
export function Space({
  direction = 'horizontal',
  size = 'small',
  children,
  ...rest
}) {
  return (
    <AntSpace
      direction={direction}
      size={size}
      {...rest}
    >
      {children}
    </AntSpace>
  )
}

/**
 * Card компонент - обертка над Ant Design Card
 */
export function Card({
  title,
  extra,
  children,
  ...rest
}) {
  return (
    <AntCard
      title={title}
      extra={extra}
      {...rest}
    >
      {children}
    </AntCard>
  )
}
