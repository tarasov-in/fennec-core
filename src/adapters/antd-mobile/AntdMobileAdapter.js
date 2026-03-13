/**
 * AntdMobileAdapter - UI Adapter for Ant Design Mobile
 *
 * Provides the same contract as AntdAdapter but uses antd-mobile components
 * Mobile-first design with touch-optimized interactions
 *
 * @version 2.2.0
 */

import React from 'react'
import {
  Input,
  TextArea,
  Selector,
  Checkbox,
  Radio,
  Switch,
  Slider,
  DatePicker,
  ImageUploader,
  List,
  Tag,
  Badge,
  Image,
  ProgressBar,
  Popup,
  Toast,
  Dialog,
  Loading,
  Button,
  Picker,
  CascadePicker,
  Form,
  SearchBar,
  Stepper,
  Rate as AntdRate,
  CenterPopup,
  InfiniteScroll
} from 'antd-mobile'

// import {
//   FilterOutlined,
//   SortAscendingOutlined,
//   SortDescendingOutlined,
//   FullscreenOutlined,
//   FullscreenExitOutlined,
//   ExclamationCircleOutlined
// } from '@ant-design/icons'


import { UIAdapter } from '../UIAdapter'
import { setNotifier } from '../../core/error'
import { Boolean, Date, DateTime, Float, FloatSlider, GroupObj, Integer, IntegerSlider, Obj, Password, RangeDate, RangeFloat, RangeInteger, String, Time, Unknown, UploadItem, UploadItems } from './components/fields'

/**
 * AntdMobileAdapter
 *
 * Maps UIAdapter contract to antd-mobile components
 * Normalizes API differences between antd and antd-mobile
 */
export class AntdMobileAdapter extends UIAdapter {
  constructor() {
    super()
    setNotifier({ error: (msg) => Toast.show({ icon: 'fail', content: msg }) })

    // Initialize component mappings
    this.initializeComponents()
  }

  /**
   * Initialize all component mappings
   * @private
   */
  initializeComponents() {
    // Form Components
    this.Input = this.wrapInput()
    this.TextArea = TextArea
    this.InputNumber = this.wrapInputNumber()
    this.Select = this.wrapSelector()
    this.Checkbox = Checkbox
    this.Radio = Radio
    this.Switch = Switch
    this.Slider = Slider
    this.Rate = this.wrapRate()
    this.DatePicker = this.wrapDatePicker()
    this.TimePicker = this.wrapTimePicker()
    this.Upload = this.wrapImageUploader()
    this.SearchBar = SearchBar
    this.Stepper = Stepper

    // Display Components
    this.Table = this.wrapList() // Mobile uses List instead of Table
    this.List = List
    this.Tag = Tag
    this.Badge = Badge
    this.Avatar = Image
    this.Image = Image
    this.Progress = ProgressBar

    // Feedback Components
    this.Modal = this.wrapModal()
    this.Drawer = Popup
    this.Popup = Popup
    this.CenterPopup = CenterPopup
    this.Message = this.wrapToast()
    this.Notification = this.wrapToast()
    this.Popconfirm = this.wrapDialog()
    this.Spin = this.wrapSpin()
    this.Loading = this.wrapSpin()

    // Navigation Components
    this.Button = Button
    this.Pagination = this.wrapPagination()

    // Additional Mobile Components
    this.Picker = Picker
    this.CascadePicker = CascadePicker
    this.Form = Form
    // ==================== Icons (optional, for CollectionRenderer) ====================
    // this.Icons = {
    //   Filter: FilterOutline,
    //   SortAscending: SortAscendingOutlined,
    //   SortDescending: SortDescendingOutlined,
    //   Fullscreen: FullscreenOutlined,
    //   FullscreenExit: FullscreenExitOutlined
    // }
  }

  useFormInstance() {
    return Form.useForm()
  }
  /**
   * Хук создания экземпляра формы Ant Design (для использования в компонентах)
   */
  createFormInstance = this.useFormInstance

  /**
   * Wrap Input to normalize onChange API
   * antd: onChange(e) where e.target.value
   * antd-mobile: onChange(value)
   */
  wrapInput() {
    return (props) => {
      const { onChange, ...rest } = props

      return (
        <Input
          {...rest}
          onChange={(value) => {
            // console.log(value)
            // Normalize to antd API: onChange(e) where e.target.value
            if (onChange) {
              // onChange({ target: { value } })
              onChange(value)
            }
          }}
        />
      )
    }
  }

  /**
   * Wrap InputNumber (using Input with type="number")
   */
  wrapInputNumber() {
    return (props) => {
      const { onChange, ...rest } = props

      return (
        <Input
          {...rest}
          type="number"
          onChange={(value) => {
            const numValue = value ? Number(value) : undefined
            if (onChange) {
              onChange(numValue)
            }
          }}
        />
      )
    }
  }

  /**
   * Wrap Selector to match Select API
   * antd: Select with options prop
   * antd-mobile: Selector with options prop
   */
  wrapSelector() {
    return (props) => {
      const { options = [], onChange, value, mode, ...rest } = props

      // Convert options format if needed
      const normalizedOptions = options.map((opt) => {
        if (typeof opt === 'object' && opt.value !== undefined) {
          return {
            label: opt.label || opt.title || opt.value,
            value: opt.value
          }
        }
        return { label: opt, value: opt }
      })

      const multiple = mode === 'multiple' || mode === 'tags'

      return (
        <Selector
          {...rest}
          options={normalizedOptions}
          value={value}
          onChange={(val) => {
            if (onChange) {
              onChange(val)
            }
          }}
          multiple={multiple}
        />
      )
    }
  }

  /**
   * Wrap Rate component
   * antd-mobile doesn't have Rate, using custom implementation
   */
  wrapRate() {
    return (props) => {
      const { count = 5, value = 0, onChange, ...rest } = props

      return (
        <div className="fennec-mobile-rate" {...rest}>
          {Array.from({ length: count }).map((_, index) => (
            <span
              key={index}
              className={index < value ? 'star filled' : 'star'}
              onClick={() => onChange && onChange(index + 1)}
              style={{
                fontSize: '24px',
                color: index < value ? '#ffd21e' : '#ccc',
                cursor: 'pointer',
                marginRight: '4px'
              }}
            >
              ★
            </span>
          ))}
        </div>
      )
    }
  }

  /**
   * Wrap DatePicker to normalize API
   */
  wrapDatePicker() {
    return (props) => {
      const { onChange, value, ...rest } = props

      return (
        <DatePicker
          {...rest}
          value={value}
          onConfirm={(val) => {
            if (onChange) {
              onChange(val)
            }
          }}
        >
          {(value) => value?.toLocaleDateString() || 'Select date'}
        </DatePicker>
      )
    }
  }

  /**
   * Wrap TimePicker (DatePicker with precision="minute")
   */
  wrapTimePicker() {
    return (props) => {
      const { onChange, value, ...rest } = props

      return (
        <DatePicker
          {...rest}
          value={value}
          precision="minute"
          onConfirm={(val) => {
            if (onChange) {
              onChange(val)
            }
          }}
        >
          {(value) => value?.toLocaleTimeString() || 'Select time'}
        </DatePicker>
      )
    }
  }

  /**
   * Wrap ImageUploader to match Upload API
   */
  wrapImageUploader() {
    return (props) => {
      const { onChange, fileList = [], maxCount = 1, ...rest } = props

      return (
        <ImageUploader
          {...rest}
          value={fileList}
          maxCount={maxCount}
          onChange={(files) => {
            if (onChange) {
              onChange({ fileList: files })
            }
          }}
        />
      )
    }
  }

  /**
   * Wrap List to provide Table-like API
   * Desktop uses Table, Mobile uses List
   */
  wrapList() {
    return (props) => {
      const {
        dataSource = [],
        columns = [],
        renderItem,
        loading,
        onItemClick,
        ...rest
      } = props

      // If custom renderItem provided, use it
      if (renderItem) {
        return (
          <List {...rest}>
            {dataSource.map((item, index) => (
              <List.Item key={item.ID || item.id || index}>
                {renderItem(item)}
              </List.Item>
            ))}
          </List>
        )
      }

      // Otherwise, use columns to build default renderItem
      const defaultRenderItem = (item) => {
        // Use first column as main content
        const mainColumn = columns[0]
        const mainContent = mainColumn?.render
          ? mainColumn.render(item[mainColumn.dataIndex], item)
          : item[mainColumn?.dataIndex]

        return (
          <div onClick={() => onItemClick?.(item)}>
            {mainContent}
          </div>
        )
      }

      return (
        <List {...rest}>
          {loading && <Loading />}
          {!loading &&
            dataSource.map((item, index) => (
              <List.Item key={item.ID || item.id || index}>
                {defaultRenderItem(item)}
              </List.Item>
            ))}
        </List>
      )
    }
  }

  /**
   * Spin/Loading: antd-mobile Loading (DotLoading) не принимает children и spinning.
   * Обёртка с контрактом как у antd Spin: spinning + children; при spinning=true — оверлей с индикатором, контент виден под ним.
   */
  wrapSpin() {
    return (props) => {
      const { spinning = false, children, ...rest } = props
      if (!spinning) {
        return <>{children}</>
      }
      return (
        <div style={{ position: 'relative', minHeight: 40 }} {...rest}>
          {children}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.6)',
              zIndex: 10
            }}
          >
            <Loading />
          </div>
        </div>
      )
    }
  }

  /**
   * Wrap Modal as Popup: открывается снизу вверх на всю высоту (antd-mobile Popup).
   * Контракт как у Modal: visible, onCancel/onClose, title, children, footer (кнопки или массив actions).
   */
  wrapModal() {
    return (props) => {
      const {
        visible,
        onOk,
        onCancel,
        title,
        children,
        footer,
        destroyOnClose,
        ...rest
      } = props

      const onClose = onCancel || rest.onClose
      const isFooterArrayOfObjects =
        Array.isArray(footer) &&
        footer.length > 0 &&
        typeof footer[0] === 'object' &&
        footer[0] !== null &&
        !React.isValidElement(footer[0]) &&
        'key' in footer[0]

      const actions = isFooterArrayOfObjects
        ? footer
        : [
          { key: 'cancel', text: 'Отмена', onClick: onClose },
          { key: 'ok', text: 'OK', primary: true, onClick: onOk }
        ]

      return (
        <Popup
          {...rest}
          visible={visible}
          onMaskClick={onClose}
          onClose={onClose}
          position="bottom"
          destroyOnClose={destroyOnClose !== false}
          bodyStyle={{
            height: '100%',
            maxHeight: '100vh',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--adm-border-color, #eee)',
              fontSize: 16,
              fontWeight: 600
            }}
          >
            <span>{title ?? ''}</span>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: 4,
                fontSize: 18,
                cursor: 'pointer',
                color: 'var(--adm-color-weak, #999)'
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ flex: '1 1 auto', overflow: 'auto', padding: 16 }}>
            {children}
          </div>
          {actions && actions.length > 0 && (
            <div
              style={{
                flex: '0 0 auto',
                display: 'flex',
                gap: 8,
                padding: 12,
                borderTop: '1px solid var(--adm-border-color, #eee)',
                background: 'var(--adm-color-background, #fff)'
              }}
            >
              {isFooterArrayOfObjects
                ? actions.map((a) => (
                  <Button
                    key={a.key}
                    color={a.primary ? 'primary' : 'default'}
                    onClick={a.onClick}
                    block
                  >
                    {a.text}
                  </Button>
                ))
                : footer}
            </div>
          )}
        </Popup>
      )
    }
  }

  /**
   * Wrap Toast for Message/Notification API
   */
  wrapToast() {
    return {
      success: (content) => Toast.show({ icon: 'success', content }),
      error: (content) => Toast.show({ icon: 'fail', content }),
      warning: (content) => Toast.show({ icon: 'loading', content }),
      info: (content) => Toast.show({ content }),
      loading: (content) => Toast.show({ icon: 'loading', content })
    }
  }

  /**
   * Wrap Dialog for Popconfirm API
   */
  wrapDialog() {
    return (props) => {
      const { title, onConfirm, onCancel, children } = props

      const handleClick = () => {
        Dialog.confirm({
          content: title,
          onConfirm,
          onCancel
        })
      }

      return <div onClick={handleClick}>{children}</div>
    }
  }

  /**
   * Wrap Pagination (using InfiniteScroll for mobile)
   */
  wrapPagination() {
    return (props) => {
      const { current, total, pageSize, onChange, ...rest } = props

      const hasMore = current * pageSize < total

      return (
        <InfiniteScroll
          {...rest}
          hasMore={hasMore}
          loadMore={async () => {
            if (onChange && hasMore) {
              onChange(current + 1, pageSize)
            }
          }}
        />
      )
    }
  }

  // ==================== Utility Methods (contract parity with AntdAdapter) ====================

  /**
   * Императивный диалог подтверждения (как AntdAdapter.confirm)
   */
  confirm = (options) => {
    Dialog.confirm({
      content: options.content ?? options.title,
      confirmText: options.okText ?? 'OK',
      cancelText: options.cancelText ?? 'Отмена',
      onConfirm: options.onOk,
      onCancel: options.onCancel
    })
  }

  transformFormData(data) {
    return data
  }

  transformTableData(data) {
    return data
  }

  createValidator(rules) {
    return rules
  }

  /**
   * Форматирование даты для antd-mobile DatePicker (ожидает Date)
   */
  formatDate(value, format) {
    if (!value) return null
    if (value instanceof Date) return value
    if (typeof value === 'string') return new Date(value)
    return new Date(value)
  }

  /**
   * Парсинг даты из antd-mobile DatePicker (возвращает ISO string для хранения)
   */
  parseDate(value, format) {
    if (!value) return null
    if (value instanceof Date) return value.toISOString()
    return value
  }

  normalizeFiles(fileList) {
    if (!fileList) return []
    return fileList.map((file) => ({
      uid: file.uid,
      name: file.name,
      status: file.status,
      url: file.url || file.response?.url,
      response: file.response
    }))
  }

  /**
   * Рендер контрола по типу поля (тот же контракт, что и AntdAdapter.renderField).
   * Используется в Field.js для построения полей без привязки к десктопу/мобиле.
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
          // case "imageeditor":
          //     return (<ImageEditor {...props}></ImageEditor>)
          // case "image":
          //     return (<Image {...props}></Image>)
          default:
            return (<Unknown {...props}></Unknown>)
        }
    }
  }
}

export default AntdMobileAdapter
