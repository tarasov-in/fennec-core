import React from 'react'
import { UIAdapter } from '../UIAdapter'
import { setNotifier } from '../../core/error'
import { message } from 'antd'
import {
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons'
import { Input, TextArea } from './components/Input'
import { Select } from './components/Select'
import { DatePicker, TimePicker, RangePicker } from './components/DatePicker'
import { Form, FormItem, useFormInstance } from './components/Form'
import { Table, List } from './components/Table'
import { Modal, Drawer, Tabs, TabPane, Divider, Space, Card } from './components/Layout'
import { Button, Dropdown, Tooltip } from './components/Actions'
import {
  Pagination,
  Spin,
  Empty,
  Tag,
  Badge,
  InputNumber,
  Slider,
  Upload,
  Dragger,
  Checkbox,
  Radio,
  Image,
  Switch,
  Rate,
  ColorPicker
} from './components/Utils'
import dayjs from 'dayjs'

/**
 * AntdAdapter - адаптер для Ant Design
 *
 * Предоставляет все UI компоненты на основе Ant Design.
 * Является адаптером по умолчанию для fennec-core для обеспечения обратной совместимости.
 *
 * @class AntdAdapter
 * @extends UIAdapter
 */
export class AntdAdapter extends UIAdapter {
  constructor() {
    super()
    setNotifier({ error: (msg) => message.error(msg) })
  }

  // ==================== Input Components ====================
  Input = Input
  TextArea = TextArea
  InputNumber = InputNumber

  // ==================== Selection Components ====================
  Select = Select
  Checkbox = Checkbox
  Radio = Radio
  Switch = Switch

  // ==================== Date/Time Components ====================
  DatePicker = DatePicker
  TimePicker = TimePicker
  RangePicker = RangePicker

  // ==================== Other Input Components ====================
  Slider = Slider
  Upload = Upload
  Dragger = Dragger
  Rate = Rate
  ColorPicker = ColorPicker

  // ==================== Display Components ====================
  Table = Table
  List = List
  Card = Card
  Image = Image

  // ==================== Form Components ====================
  Form = Form
  FormItem = FormItem

  // ==================== Layout Components ====================
  Modal = Modal
  Drawer = Drawer
  Tabs = Tabs
  TabPane = TabPane
  Divider = Divider
  Space = Space

  // ==================== Action Components ====================
  Button = Button
  Dropdown = Dropdown
  Tooltip = Tooltip

  // ==================== Icons (optional, for CollectionRenderer) ====================
  Icons = {
    Filter: FilterOutlined,
    SortAscending: SortAscendingOutlined,
    SortDescending: SortDescendingOutlined,
    Fullscreen: FullscreenOutlined,
    FullscreenExit: FullscreenExitOutlined
  }

  // ==================== Utility Components ====================
  Pagination = Pagination
  Spin = Spin
  Empty = Empty
  Tag = Tag
  Badge = Badge

  // ==================== Utility Methods ====================

  /**
   * Преобразование данных формы для Ant Design
   */
  transformFormData(data) {
    // Ant Design Form обрабатывает данные как есть
    return data
  }

  /**
   * Преобразование данных таблицы для Ant Design
   */
  transformTableData(data) {
    // Ant Design Table ожидает массив объектов
    return data
  }

  /**
   * Создание валидатора для Ant Design Form
   */
  createValidator(rules) {
    // Ant Design использует массив правил валидации
    // rules уже в правильном формате для Ant Design
    return rules
  }

  /**
   * Форматирование даты для Ant Design DatePicker
   */
  formatDate(value, format) {
    if (!value) return null

    // Ant Design DatePicker работает с dayjs objects
    if (typeof value === 'string') {
      return dayjs(value)
    }

    if (dayjs.isDayjs(value)) {
      return value
    }

    return dayjs(value)
  }

  /**
   * Парсинг даты из Ant Design DatePicker
   */
  parseDate(value, format) {
    if (!value) return null

    // Возвращаем ISO string для сохранения на сервере
    if (dayjs.isDayjs(value)) {
      return value.toISOString()
    }

    return value
  }

  /**
   * Хук создания экземпляра формы Ant Design (для использования в компонентах)
   */
  createFormInstance = useFormInstance

  /**
   * Нормализация файлов для Ant Design Upload
   */
  normalizeFiles(fileList) {
    if (!fileList) return []

    // Ant Design Upload возвращает fileList в формате:
    // [{ uid, name, status, url, response, ... }]
    return fileList.map(file => ({
      uid: file.uid,
      name: file.name,
      status: file.status,
      url: file.url || file.response?.url,
      response: file.response
    }))
  }

  /**
   * Рендер контрола по типу поля для Ant Design
   */
  renderField(options) {
    if (!options || !options.type) return null

    const { type, value, onChange, mode, item = {}, disabled, placeholder } = options
    const t = (type || '').toLowerCase()
    const label = item.label
    const place = placeholder ?? (mode === 'filter' ? label : undefined)

    // string
    if (t === 'string') {
      return (
        <this.Input
          value={value ?? ''}
          onChange={onChange}
          placeholder={place}
          disabled={disabled}
        />
      )
    }

    if (t === 'password') {
      return (
        <this.Input
          type="password"
          value={value ?? ''}
          onChange={onChange}
          placeholder={place}
          disabled={disabled}
        />
      )
    }

    if (t === 'text') {
      return (
        <this.TextArea
          value={value ?? ''}
          onChange={onChange}
          placeholder={place}
          disabled={disabled}
          rows={3}
        />
      )
    }

    // number
    const numTypes = ['int', 'uint', 'integer', 'int64', 'int32', 'uint64', 'uint32']
    if (numTypes.includes(t)) {
      return (
        <this.InputNumber
          value={value != null ? Number(value) : undefined}
          onChange={onChange}
          disabled={disabled}
          min={item.min}
          max={item.max}
          step={1}
          style={{ width: '100%' }}
        />
      )
    }

    const floatTypes = ['double', 'float', 'float64', 'float32']
    if (floatTypes.includes(t)) {
      return (
        <this.InputNumber
          value={value != null ? Number(value) : undefined}
          onChange={onChange}
          disabled={disabled}
          min={item.min}
          max={item.max}
          step={0.01}
          style={{ width: '100%' }}
        />
      )
    }

    // boolean
    if (t === 'boolean' || t === 'bool') {
      return (
        <this.Checkbox
          checked={!!value}
          onChange={onChange}
          disabled={disabled}
        />
      )
    }

    // date
    if (t === 'date') {
      const format = item.format || 'YYYY-MM-DD'
      const dayjsValue = value != null && value !== '' ? this.formatDate(value, format) : null
      return (
        <this.DatePicker
          value={dayjsValue}
          onChange={(v) => onChange(v ? this.parseDate(v, format) : null)}
          format={format}
          disabled={disabled}
          style={{ width: '100%' }}
        />
      )
    }

    if (t === 'datetime' || t === 'time.time') {
      const format = item.format || 'YYYY-MM-DD HH:mm:ss'
      const dayjsValue = value != null && value !== '' ? this.formatDate(value, format) : null
      return (
        <this.DatePicker
          showTime
          value={dayjsValue}
          onChange={(v) => onChange(v ? this.parseDate(v, format) : null)}
          format={format}
          disabled={disabled}
          style={{ width: '100%' }}
        />
      )
    }

    if (t === 'time') {
      const format = item.format || 'HH:mm:ss'
      const dayjsValue = value != null && value !== '' ? this.formatDate(value, format) : null
      return (
        <this.TimePicker
          value={dayjsValue}
          onChange={(v) => onChange(v ? this.parseDate(v, format) : null)}
          format={format}
          disabled={disabled}
          style={{ width: '100%' }}
        />
      )
    }

    // fallback: string input
    return (
      <this.Input
        value={value != null ? String(value) : ''}
        onChange={onChange}
        placeholder={place}
        disabled={disabled}
      />
    )
  }
}
