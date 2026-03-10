import React from 'react'
import { UIAdapter } from '../UIAdapter'
import { setNotifier } from '../../core/error'
import { message } from 'antd'
import {
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { Modal as AntModal } from 'antd'
import { Input, TextArea } from './components/Input'
import { Select } from './components/Select'
import { DatePicker, TimePicker, RangePicker } from './components/DatePicker'
import { Form, FormItem, useFormInstance } from './components/Form'
import { Table, List } from './components/Table'
import { Modal, Drawer, Tabs, TabPane, Divider, Space, Card } from './components/Layout'
import { Button, Dropdown, Tooltip, Popover } from './components/Actions'
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
import {dayjs} from '../../core/utils'
import { Boolean, Date, DateTime, Float, FloatSlider, GroupObj, Integer, IntegerSlider, Obj, Password, RangeDate, RangeFloat, RangeInteger, String, Time, Unknown, UploadItem, UploadItems } from './components/fields'

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
  Popover = Popover

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

  // ==================== Imperative API ====================
  confirm = (options) => {
    AntModal.confirm({
      ...options,
      icon: options.icon ?? React.createElement(ExclamationCircleOutlined)
    })
  }

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
  renderField(props) {
    if (!props?.item || !props?.item?.type) return null

    const { auth, item, value, onChange } = props;
    switch (item.filterType) {
      case "group":
        switch (item.type) {
          case "func":
            return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, props) : undefined;
          case "object":
          case "document":
            return (<GroupObj {...props}></GroupObj>)
          default:
            return (<Unknown {...props}></Unknown>)
        }
      case "range":
        switch (item.type) {
          case "func":
            return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, props) : undefined;
          case "int":
          case "uint":
          case "integer":
          case "int64":
          case "int32":
          case "uint64":
          case "uint32":
            return (<RangeInteger {...props}></RangeInteger>)
          case "double":
          case "float":
          case "float64":
          case "float32":
            return (<RangeFloat {...props}></RangeFloat>)
          case "date":
          case "time":
          case "datetime":
          case "time.Time":
            return (<RangeDate {...props}></RangeDate>)
          default:
            return (<Unknown {...props}></Unknown>)
        }
      case "slider":
        switch (item.type) {
          case "func":
            return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, props) : undefined;
          case "int":
          case "uint":
          case "integer":
          case "int64":
          case "int32":
          case "uint64":
          case "uint32":
            return (<IntegerSlider {...props}></IntegerSlider>)
          case "double":
          case "float":
          case "float64":
          case "float32":
            return (<FloatSlider {...props}></FloatSlider>)
          default:
            return (<Unknown {...props}></Unknown>)
        }
      default:
        switch (item.type) {
          case "func":
            return (props?.item?.render) ? props?.item?.render(auth, item, value, onChange, props) : undefined;
          case "string":
            return (<String {...props}></String>)
          case "password":
            return (<Password {...props}></Password>)
          case "int":
          case "uint":
          case "integer":
          case "int64":
          case "int32":
          case "uint64":
          case "uint32":
            return (<Integer {...props}></Integer>)
          case "double":
          case "float":
          case "float64":
          case "float32":
            return (<Float {...props}></Float>)
          case "boolean":
          case "bool":
            return (<Boolean {...props}></Boolean>)
          case "time":
            return (<Time {...props}></Time>)
          case "date":
            return (<Date {...props}></Date>)
          case "datetime":
          case "time.Time":
            return (<DateTime {...props}></DateTime>)
          case "object":
          case "document":
            return (<Obj {...props} changed={changed}></Obj>)
          // case "action":
          //   return (<ActionItem {...props}></ActionItem>)
          case "file":
            return (<UploadItem {...props}></UploadItem>)
          case "files":
            return (<UploadItems {...props}></UploadItems>)
          // case "image":
          //   return (<Image {...props}></Image>)
          default:
            return (<Unknown {...props}></Unknown>)
        }
    }
  }
}
