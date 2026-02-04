import React from 'react'
import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/ru_RU'

const { RangePicker: AntRangePicker } = AntDatePicker

/**
 * DatePicker компонент - обертка над Ant Design DatePicker
 */
export function DatePicker({
  value,
  onChange,
  format = 'YYYY-MM-DD',
  showTime,
  ...rest
}) {
  return (
    <AntDatePicker
      value={value}
      onChange={onChange}
      format={format}
      showTime={showTime}
      locale={locale}
      {...rest}
    />
  )
}

/**
 * TimePicker компонент - обертка над Ant Design TimePicker
 */
export function TimePicker({
  value,
  onChange,
  format = 'HH:mm:ss',
  ...rest
}) {
  return (
    <AntTimePicker
      value={value}
      onChange={onChange}
      format={format}
      locale={locale}
      {...rest}
    />
  )
}

/**
 * RangePicker компонент - обертка над Ant Design RangePicker
 */
export function RangePicker({
  value,
  onChange,
  format = 'YYYY-MM-DD',
  ...rest
}) {
  return (
    <AntRangePicker
      value={value}
      onChange={onChange}
      format={format}
      locale={locale}
      {...rest}
    />
  )
}
