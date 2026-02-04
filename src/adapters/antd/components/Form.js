import React from 'react'
import { Form as AntForm } from 'antd'

const { Item: AntFormItem } = AntForm

/**
 * Form компонент - обертка над Ant Design Form
 */
export function Form({
  onFinish,
  initialValues,
  form,
  layout = 'vertical',
  ...rest
}) {
  return (
    <AntForm
      onFinish={onFinish}
      initialValues={initialValues}
      form={form}
      layout={layout}
      {...rest}
    />
  )
}

/**
 * FormItem компонент - обертка над Ant Design Form.Item
 */
export function FormItem({
  label,
  name,
  rules,
  required,
  children,
  ...rest
}) {
  // Если required=true, добавляем к rules
  const normalizedRules = rules || []
  if (required && !normalizedRules.some(r => r.required)) {
    normalizedRules.push({ required: true, message: `${label} обязательно для заполнения` })
  }

  return (
    <AntFormItem
      label={label}
      name={name}
      rules={normalizedRules}
      {...rest}
    >
      {children}
    </AntFormItem>
  )
}

/**
 * Создание экземпляра формы
 */
export function useFormInstance() {
  return AntForm.useForm()
}
