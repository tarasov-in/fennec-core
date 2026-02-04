/**
 * Field - Новая версия Field компонента
 *
 * Использует FieldCore (логика) + FieldRenderer (UI через UIAdapter)
 * v2.2.0: Добавлена автоматическая поддержка Desktop/Mobile с responsive переключением
 * v2.3.0: Performance optimization with React.memo
 * Поддерживает 26 типов полей
 */

import React, { useMemo, memo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { FieldCore, FieldRenderer } from '../../../core/components/Field'
import { FieldMobileRenderer } from './FieldMobileRenderer'
import { useUIAdapter } from '../../../adapters/UIProvider'
import { GetMeta } from '../../../core/meta'

/**
 * Field component - версия 2.0
 *
 * @param {Object} props
 * @param {Object|Function} props.meta - Metadata объект или функция
 * @param {any} props.value - Текущее значение поля
 * @param {Function} props.onChange - Обработчик изменения значения
 * @param {boolean} props.disabled - Заблокировано ли поле
 * @param {boolean} props.readOnly - Только для чтения
 * @param {string} props.placeholder - Placeholder текст
 * @param {string} props.label - Метка поля
 * @param {string} props.help - Текст помощи
 * @param {string} props.tooltip - Всплывающая подсказка
 * @param {string} props.className - CSS класс
 * @param {Object} props.style - Inline стили
 */
// v2.3.0: Memoized component for performance
const FieldComponent = (props) => {
  const {
    meta,
    value,
    onChange,
    disabled,
    readOnly,
    placeholder,
    label,
    help,
    tooltip,
    className,
    style,
    forceMobile, // NEW v2.2: Force mobile rendering
    ...restProps
  } = props

  const adapter = useUIAdapter()

  // NEW v2.2: Автоматическое определение Desktop/Mobile
  const isSystemMobile = useMediaQuery({ maxWidth: 768 })
  const isMobile = forceMobile !== undefined ? forceMobile : isSystemMobile

  // Разворачиваем метаданные если это функция
  const resolvedMeta = GetMeta(meta)

  // Создаем экземпляр FieldCore с бизнес-логикой
  // ВАЖНО: Одна и та же логика для Desktop и Mobile!
  const fieldCore = useMemo(
    () =>
      new FieldCore(
        {
          value,
          onChange,
          disabled,
          readOnly,
          placeholder,
          ...restProps
        },
        resolvedMeta,
        adapter
      ),
    [value, onChange, disabled, readOnly, placeholder, resolvedMeta, adapter, restProps]
  )

  // NEW v2.2: Выбор рендерера на основе Desktop/Mobile
  const Renderer = isMobile ? FieldMobileRenderer : FieldRenderer

  // Рендерим поле через выбранный рендерер
  return (
    <Renderer
      fieldCore={fieldCore}
      className={className}
      style={style}
      {...props}
    />
  )
}

// v2.3.0: Custom comparison function for memo
const arePropsEqual = (prevProps, nextProps) => {
  // Check if value changed
  if (prevProps.value !== nextProps.value) return false

  // Check if onChange changed (function reference)
  if (prevProps.onChange !== nextProps.onChange) return false

  // Check if disabled/readOnly changed
  if (prevProps.disabled !== nextProps.disabled) return false
  if (prevProps.readOnly !== nextProps.readOnly) return false

  // Check if forceMobile changed
  if (prevProps.forceMobile !== nextProps.forceMobile) return false

  // Check if meta changed (shallow comparison)
  if (prevProps.meta !== nextProps.meta) {
    // If both are objects, do deep comparison
    if (typeof prevProps.meta === 'object' && typeof nextProps.meta === 'object') {
      const prevType = prevProps.meta?.type
      const nextType = nextProps.meta?.type
      const prevRequired = prevProps.meta?.required
      const nextRequired = nextProps.meta?.required

      if (prevType !== nextType || prevRequired !== nextRequired) return false
    } else {
      return false
    }
  }

  return true
}

// Export memoized component
export const Field = memo(FieldComponent, arePropsEqual)

export default Field
