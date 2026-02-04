/**
 * Tailwind UI Adapter for Fennec Core
 *
 * Uses Tailwind CSS + Headless UI for accessible, customizable components
 *
 * @requires tailwindcss ^3.0.0
 * @requires @headlessui/react ^1.7.0
 * @requires @heroicons/react ^2.0.0
 */

import React, { Fragment } from 'react'
import { Dialog, Transition, Listbox, Tab, Menu, Disclosure, Switch as HeadlessSwitch } from '@headlessui/react'
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'

// Import custom components
import Rate from './components/Rate'
import Pagination from './components/Pagination'
import DatePickerCustom from './components/DatePicker'

/**
 * TailwindUIAdapter - Tailwind CSS + Headless UI implementation
 */
class TailwindUIAdapter {
  constructor() {
    this.name = 'TailwindUI'
    this.version = '1.0.0'
  }

  // Base input styles
  getInputClasses = (error, disabled) => {
    const base = 'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
    const normal = 'ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600'
    const errorClass = 'ring-red-300 text-red-900 placeholder:text-red-300 focus:ring-red-500'
    const disabledClass = 'bg-gray-50 text-gray-500 cursor-not-allowed'

    return `${base} ${error ? errorClass : normal} ${disabled ? disabledClass : ''}`
  }

  // Label component
  Label = ({ children, required, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium leading-6 text-gray-900">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )

  // Error message component
  ErrorMessage = ({ children }) => (
    <p className="mt-2 text-sm text-red-600">{children}</p>
  )

  // Input Components
  Input = ({ value, onChange, placeholder, disabled, error, type = 'text', label, required, ...props }) => {
    const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div>
        {label && <this.Label htmlFor={id} required={required}>{label}</this.Label>}
        <div className={label ? 'mt-2' : ''}>
          <input
            id={id}
            type={type}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={this.getInputClasses(error, disabled)}
            {...props}
          />
        </div>
        {error && <this.ErrorMessage>{error}</this.ErrorMessage>}
      </div>
    )
  }

  InputNumber = ({ value, onChange, min, max, step = 1, disabled, error, label, required, ...props }) => {
    const id = props.id || `number-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div>
        {label && <this.Label htmlFor={id} required={required}>{label}</this.Label>}
        <div className={label ? 'mt-2' : ''}>
          <input
            id={id}
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange?.(parseFloat(e.target.value))}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={this.getInputClasses(error, disabled)}
            {...props}
          />
        </div>
        {error && <this.ErrorMessage>{error}</this.ErrorMessage>}
      </div>
    )
  }

  Password = ({ value, onChange, placeholder, disabled, error, label, required, ...props }) => {
    return (
      <this.Input
        type="password"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        label={label}
        required={required}
        {...props}
      />
    )
  }

  Textarea = ({ value, onChange, placeholder, disabled, error, rows = 4, label, required, ...props }) => {
    const id = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div>
        {label && <this.Label htmlFor={id} required={required}>{label}</this.Label>}
        <div className={label ? 'mt-2' : ''}>
          <textarea
            id={id}
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={this.getInputClasses(error, disabled)}
            {...props}
          />
        </div>
        {error && <this.ErrorMessage>{error}</this.ErrorMessage>}
      </div>
    )
  }

  // Select using Headless UI Listbox
  Select = ({ value, onChange, options = [], placeholder = 'Select option', disabled, error, label, required, ...props }) => {
    const selected = options.find(opt => opt.value === value)

    return (
      <div>
        {label && <this.Label required={required}>{label}</this.Label>}
        <Listbox value={value} onChange={onChange} disabled={disabled}>
          <div className="relative mt-2">
            <Listbox.Button className={this.getInputClasses(error, disabled) + ' text-left relative pr-10'}>
              <span className="block truncate">
                {selected ? selected.label : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        {error && <this.ErrorMessage>{error}</this.ErrorMessage>}
      </div>
    )
  }

  // Boolean Components
  Checkbox = ({ checked, onChange, label, disabled, children }) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            type="checkbox"
            checked={checked || false}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
        {(label || children) && (
          <div className="ml-3 text-sm leading-6">
            <label className="font-medium text-gray-900">{label || children}</label>
          </div>
        )}
      </div>
    )
  }

  Switch = ({ checked, onChange, label, disabled, children }) => {
    return (
      <HeadlessSwitch.Group as="div" className="flex items-center">
        <HeadlessSwitch
          checked={checked || false}
          onChange={onChange}
          disabled={disabled}
          className={`${
            checked ? 'bg-indigo-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <span
            className={`${
              checked ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </HeadlessSwitch>
        {(label || children) && (
          <HeadlessSwitch.Label as="span" className="ml-3 text-sm">
            <span className="font-medium text-gray-900">{label || children}</span>
          </HeadlessSwitch.Label>
        )}
      </HeadlessSwitch.Group>
    )
  }

  RadioGroup = ({ value, onChange, options = [], label }) => {
    return (
      <fieldset>
        {label && <legend className="text-sm font-semibold leading-6 text-gray-900">{label}</legend>}
        <div className="mt-2 space-y-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    )
  }

  // Date/Time Components (HTML5)
  DatePicker = ({ value, onChange, disabled, error, label, required, ...props }) => {
    return (
      <this.Input
        type="date"
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        label={label}
        required={required}
        {...props}
      />
    )
  }

  TimePicker = ({ value, onChange, disabled, error, label, required, ...props }) => {
    return (
      <this.Input
        type="time"
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        label={label}
        required={required}
        {...props}
      />
    )
  }

  DateTimePicker = ({ value, onChange, disabled, error, label, required, ...props }) => {
    return (
      <this.Input
        type="datetime-local"
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        label={label}
        required={required}
        {...props}
      />
    )
  }

  // Other Input Components
  Slider = ({ value, onChange, min = 0, max = 100, step = 1, disabled, label }) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
            {label}: {value}
          </label>
        )}
        <input
          type="range"
          value={value ?? min}
          onChange={(e) => onChange?.(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    )
  }

  Rate = Rate

  Autocomplete = ({ value, onChange, options = [], label, placeholder, ...props }) => {
    return <this.Select value={value} onChange={onChange} options={options} label={label} placeholder={placeholder} {...props} />
  }

  // Display Components
  Tag = ({ children, color = 'gray', closable, onClose, ...props }) => {
    const colorClasses = {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    }

    return (
      <span className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${colorClasses[color] || colorClasses.gray}`}>
        {children}
        {closable && (
          <button type="button" onClick={onClose} className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20">
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    )
  }

  Badge = ({ count, children, ...props }) => {
    return (
      <span className="relative inline-block">
        {children}
        {count > 0 && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
    )
  }

  Tooltip = ({ title, children, ...props }) => {
    return (
      <div className="group relative inline-block">
        {children}
        <div className="invisible group-hover:visible absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-sm whitespace-nowrap">
          {title}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    )
  }

  Progress = ({ percent = 0, status, ...props }) => {
    const colorClass = status === 'success' ? 'bg-green-600' : status === 'error' ? 'bg-red-600' : 'bg-indigo-600'

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full transition-all duration-300`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
      </div>
    )
  }

  Alert = ({ message, type = 'info', closable, onClose, children, ...props }) => {
    const icons = {
      info: <InformationCircleIcon className="h-5 w-5" />,
      success: <CheckCircleIcon className="h-5 w-5" />,
      warning: <ExclamationTriangleIcon className="h-5 w-5" />,
      error: <XCircleIcon className="h-5 w-5" />
    }

    const colorClasses = {
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      success: 'bg-green-50 text-green-800 border-green-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      error: 'bg-red-50 text-red-800 border-red-200'
    }

    return (
      <div className={`rounded-md border p-4 ${colorClasses[type]}`}>
        <div className="flex">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message || children}</p>
          </div>
          {closable && (
            <div className="ml-auto pl-3">
              <button onClick={onClose} className="inline-flex rounded-md p-1.5 hover:bg-black/5">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  Spin = ({ size = 'default', ...props }) => {
    const sizeClasses = {
      small: 'h-4 w-4',
      default: 'h-8 w-8',
      large: 'h-12 w-12'
    }

    return (
      <div className="flex justify-center items-center">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-indigo-600`}></div>
      </div>
    )
  }

  Avatar = ({ src, alt, size = 'default', children, ...props }) => {
    const sizeClasses = {
      small: 'h-8 w-8',
      default: 'h-10 w-10',
      large: 'h-12 w-12'
    }

    if (src) {
      return <img src={src} alt={alt} className={`${sizeClasses[size]} rounded-full`} {...props} />
    }

    return (
      <span className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full bg-gray-500`}>
        <span className="text-sm font-medium leading-none text-white">{children}</span>
      </span>
    )
  }

  Empty = ({ description = 'No data', ...props }) => {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    )
  }

  // Layout Components
  Card = ({ title, extra, children, ...props }) => {
    return (
      <div className="bg-white shadow rounded-lg">
        {(title || extra) && (
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
              {extra && <div className="ml-4 flex-shrink-0">{extra}</div>}
            </div>
          </div>
        )}
        <div className="px-4 py-5 sm:p-6">{children}</div>
      </div>
    )
  }

  Collapse = Disclosure

  Tabs = Tab

  Modal = Dialog

  Drawer = ({ open, onClose, title, children, placement = 'right', ...props }) => {
    const positionClasses = {
      left: 'left-0',
      right: 'right-0',
      top: 'top-0',
      bottom: 'bottom-0'
    }

    return (
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className={`pointer-events-none fixed inset-y-0 flex max-w-full ${positionClasses[placement] || positionClasses.right}`}>
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom={placement === 'right' ? 'translate-x-full' : '-translate-x-full'}
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo={placement === 'right' ? 'translate-x-full' : '-translate-x-full'}
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">{title}</Dialog.Title>
                          <button onClick={onClose} className="rounded-md text-gray-400 hover:text-gray-500">
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                      <div className="relative flex-1 px-4 sm:px-6">{children}</div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  }

  Divider = () => <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div></div>

  // Action Components
  Button = ({ children, type = 'default', size = 'default', loading, disabled, danger, onClick, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors'

    const sizeClasses = {
      small: 'px-2.5 py-1.5 text-xs',
      default: 'px-3 py-2 text-sm',
      large: 'px-4 py-2.5 text-base'
    }

    const typeClasses = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
      default: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
      dashed: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 ring-dashed hover:bg-gray-50',
      text: 'text-indigo-600 hover:text-indigo-500',
      link: 'text-indigo-600 underline hover:text-indigo-500'
    }

    const dangerClasses = 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600'

    return (
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${sizeClasses[size]} ${danger ? dangerClasses : typeClasses[type]} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {loading && <this.Spin size="small" />}
        {!loading && children}
      </button>
    )
  }

  Dropdown = Menu

  Pagination = Pagination

  Upload = ({ onChange, children, ...props }) => {
    return (
      <div>
        <input
          type="file"
          onChange={(e) => onChange?.(e.target.files?.[0])}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          {...props}
        />
        {children}
      </div>
    )
  }

  // Table Component
  Table = ({ dataSource = [], columns = [], ...props }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dataSource.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default TailwindUIAdapter
export { TailwindUIAdapter }
