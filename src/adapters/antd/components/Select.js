import React from 'react'
import { Select as AntSelect } from 'antd'

const { Option } = AntSelect

/**
 * Select компонент - обертка над Ant Design Select
 *
 * Нормализует API для использования в fennec-core
 */
export function Select({
  value,
  onChange,
  options,
  multiple,
  searchable = true,
  loading,
  onSearch,
  ...rest
}) {
  // Ant Design использует mode="multiple" вместо multiple prop
  const mode = multiple ? 'multiple' : undefined

  // Ant Design использует showSearch вместо searchable
  const showSearch = searchable

  // Ant Design использует filterOption по умолчанию, мы можем его настроить
  const filterOption = rest.filterOption !== undefined
    ? rest.filterOption
    : ((input, option) => {
      if (option?.children) {
        return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      return false
    })

  return (
    <AntSelect
      value={value}
      onChange={onChange}
      mode={mode}
      showSearch={showSearch}
      loading={loading}
      onSearch={onSearch}
      filterOption={filterOption}
      optionFilterProp="children"
      {...rest}
    >
      {options?.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </AntSelect>
  )
}
