import React from 'react'

const DatePickerCustom = ({ value, onChange, disabled, placeholder = 'Select date', ...props }) => {
  return (
    <input
      type="date"
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed sm:text-sm sm:leading-6"
      {...props}
    />
  )
}

export default DatePickerCustom
