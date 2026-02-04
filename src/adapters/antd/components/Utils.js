import React from 'react'
import {
  Pagination as AntPagination,
  Spin as AntSpin,
  Empty as AntEmpty,
  Tag as AntTag,
  Badge as AntBadge,
  InputNumber as AntInputNumber,
  Slider as AntSlider,
  Upload as AntUpload,
  Checkbox as AntCheckbox,
  Radio as AntRadio,
  Image as AntImage,
  Switch as AntSwitch,
  Rate as AntRate,
  ColorPicker as AntColorPicker
} from 'antd'

const { Dragger: AntDragger } = AntUpload

/**
 * Pagination компонент - обертка над Ant Design Pagination
 */
export function Pagination({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = true,
  ...rest
}) {
  return (
    <AntPagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      showSizeChanger={showSizeChanger}
      {...rest}
    />
  )
}

/**
 * Spin компонент - обертка над Ant Design Spin
 */
export function Spin({
  spinning = true,
  size = 'default',
  children,
  ...rest
}) {
  return (
    <AntSpin
      spinning={spinning}
      size={size}
      {...rest}
    >
      {children}
    </AntSpin>
  )
}

/**
 * Empty компонент - обертка над Ant Design Empty
 */
export function Empty({
  description,
  image,
  ...rest
}) {
  return (
    <AntEmpty
      description={description}
      image={image}
      {...rest}
    />
  )
}

/**
 * Tag компонент - обертка над Ant Design Tag
 */
export function Tag({
  color,
  onClose,
  closable,
  children,
  ...rest
}) {
  return (
    <AntTag
      color={color}
      onClose={onClose}
      closable={closable}
      {...rest}
    >
      {children}
    </AntTag>
  )
}

/**
 * Badge компонент - обертка над Ant Design Badge
 */
export function Badge({
  count,
  dot,
  children,
  ...rest
}) {
  return (
    <AntBadge
      count={count}
      dot={dot}
      {...rest}
    >
      {children}
    </AntBadge>
  )
}

/**
 * InputNumber компонент - обертка над Ant Design InputNumber
 */
export function InputNumber({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  ...rest
}) {
  return (
    <AntInputNumber
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      {...rest}
    />
  )
}

/**
 * Slider компонент - обертка над Ant Design Slider
 */
export function Slider({
  value,
  onChange,
  min,
  max,
  step,
  disabled,
  ...rest
}) {
  return (
    <AntSlider
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      {...rest}
    />
  )
}

/**
 * Upload компонент - обертка над Ant Design Upload
 */
export function Upload({
  value,
  onChange,
  accept,
  multiple,
  maxSize,
  onUpload,
  ...rest
}) {
  // Нормализация для Ant Design Upload
  const fileList = value || []

  const handleChange = (info) => {
    if (onChange) {
      onChange(info.fileList)
    }
  }

  const customRequest = async (options) => {
    if (onUpload) {
      try {
        await onUpload(options.file)
        options.onSuccess()
      } catch (error) {
        options.onError(error)
      }
    } else {
      options.onSuccess()
    }
  }

  return (
    <AntUpload
      fileList={fileList}
      onChange={handleChange}
      accept={accept}
      multiple={multiple}
      customRequest={customRequest}
      {...rest}
    />
  )
}

/**
 * Dragger компонент - обертка над Ant Design Upload.Dragger
 */
export function Dragger({
  value,
  onChange,
  accept,
  multiple,
  ...rest
}) {
  const fileList = value || []

  const handleChange = (info) => {
    if (onChange) {
      onChange(info.fileList)
    }
  }

  return (
    <AntDragger
      fileList={fileList}
      onChange={handleChange}
      accept={accept}
      multiple={multiple}
      {...rest}
    />
  )
}

/**
 * Checkbox компонент - обертка над Ant Design Checkbox
 */
export function Checkbox({
  checked,
  onChange,
  disabled,
  label,
  children,
  ...rest
}) {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked)
    }
  }

  return (
    <AntCheckbox
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      {...rest}
    >
      {label || children}
    </AntCheckbox>
  )
}

/**
 * Radio компонент - обертка над Ant Design Radio
 */
export function Radio({
  value,
  onChange,
  options,
  disabled,
  ...rest
}) {
  return (
    <AntRadio.Group
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      {...rest}
    >
      {options?.map((opt) => (
        <AntRadio key={opt.value} value={opt.value}>
          {opt.label}
        </AntRadio>
      ))}
    </AntRadio.Group>
  )
}

/**
 * Image компонент - обертка над Ant Design Image
 */
export function Image({
  src,
  alt,
  width,
  height,
  preview = true,
  ...rest
}) {
  return (
    <AntImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      preview={preview}
      {...rest}
    />
  )
}

/**
 * Switch компонент - обертка над Ant Design Switch
 */
export function Switch({
  checked,
  onChange,
  disabled,
  ...rest
}) {
  const handleChange = (checked) => {
    if (onChange) {
      onChange(checked)
    }
  }

  return (
    <AntSwitch
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      {...rest}
    />
  )
}

/**
 * Rate компонент - обертка над Ant Design Rate
 */
export function Rate({
  value,
  onChange,
  count = 5,
  disabled,
  allowHalf = false,
  ...rest
}) {
  const handleChange = (rating) => {
    if (onChange) {
      onChange(rating)
    }
  }

  return (
    <AntRate
      value={value}
      onChange={handleChange}
      count={count}
      disabled={disabled}
      allowHalf={allowHalf}
      {...rest}
    />
  )
}

/**
 * ColorPicker компонент - обертка над Ant Design ColorPicker
 */
export function ColorPicker({
  value,
  onChange,
  disabled,
  showText = false,
  ...rest
}) {
  const handleChange = (color) => {
    if (onChange) {
      // color is Color object from Ant Design, extract hex value
      const hexValue = color?.toHexString?.() || color
      onChange(hexValue)
    }
  }

  return (
    <AntColorPicker
      value={value}
      onChange={handleChange}
      disabled={disabled}
      showText={showText}
      {...rest}
    />
  )
}
