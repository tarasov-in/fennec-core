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
   * Создание экземпляра формы Ant Design
   */
  createFormInstance() {
    return useFormInstance()
  }

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
}
