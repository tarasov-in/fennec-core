import React from 'react'
import { Input as AntInput } from 'antd'

const { TextArea: AntTextArea } = AntInput

/**
 * Input компонент - обертка над Ant Design Input
 *
 * Нормализует API для использования в fennec-core
 */
export function Input({ value, onChange, ...rest }) {
  // Ant Design Input передает event в onChange, нам нужно только value
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <AntInput
      value={value}
      onChange={handleChange}
      {...rest}
    />
  )
}

/**
 * TextArea компонент - обертка над Ant Design TextArea
 */
export function TextArea({ value, onChange, ...rest }) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <AntTextArea
      value={value}
      onChange={handleChange}
      {...rest}
    />
  )
}
