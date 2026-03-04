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
  Modal,
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

import { UIAdapter } from '../UIAdapter'

/**
 * AntdMobileAdapter
 *
 * Maps UIAdapter contract to antd-mobile components
 * Normalizes API differences between antd and antd-mobile
 */
export class AntdMobileAdapter extends UIAdapter {
  constructor() {
    super()

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
    this.Spin = Loading
    this.Loading = Loading

    // Navigation Components
    this.Button = Button
    this.Pagination = this.wrapPagination()

    // Additional Mobile Components
    this.Picker = Picker
    this.CascadePicker = CascadePicker
    this.Form = Form
  }
  
  useFormInstance() {
    return Form.useForm()
  }
  /**
   * Хук создания экземпляра формы Ant Design (для использования в компонентах)
   */
  createFormInstance = useFormInstance

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
            // Normalize to antd API: onChange(e) where e.target.value
            if (onChange) {
              onChange({ target: { value } })
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
   * Wrap Modal to normalize API
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
        ...rest
      } = props

      return (
        <Modal
          {...rest}
          visible={visible}
          title={title}
          onClose={onCancel}
          content={children}
          closeOnAction
          actions={
            footer || [
              {
                key: 'cancel',
                text: 'Cancel',
                onClick: onCancel
              },
              {
                key: 'ok',
                text: 'OK',
                primary: true,
                onClick: onOk
              }
            ]
          }
        />
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

  // ========== Render Methods ==========
  // These methods provide functional API for rendering components

  /**
   * Render Input component
   */
  renderInput(props) {
    const InputComponent = this.Input
    return <InputComponent {...props} />
  }

  /**
   * Render TextArea component
   */
  renderTextArea(props) {
    return <TextArea {...props} />
  }

  /**
   * Render Select component
   */
  renderSelect(props) {
    const SelectComponent = this.Select
    return <SelectComponent {...props} />
  }

  /**
   * Render DatePicker component
   */
  renderDatePicker(props) {
    const DatePickerComponent = this.DatePicker
    return <DatePickerComponent {...props} />
  }

  /**
   * Render Button component
   */
  renderButton(props) {
    return <Button {...props} />
  }

  /**
   * Render Modal component
   */
  renderModal(props) {
    const ModalComponent = this.Modal
    return <ModalComponent {...props} />
  }

  /**
   * Render Popup component
   */
  renderPopup(props) {
    return <Popup {...props} />
  }

  /**
   * Render List component
   */
  renderList(props) {
    const ListComponent = this.Table // Uses wrapped List
    return <ListComponent {...props} />
  }

  /**
   * Render Loading component
   */
  renderLoading(props) {
    return <Loading {...props} />
  }

  /**
   * Show success message
   */
  showSuccess(content) {
    this.Message.success(content)
  }

  /**
   * Show error message
   */
  showError(content) {
    this.Message.error(content)
  }

  /**
   * Show info message
   */
  showInfo(content) {
    this.Message.info(content)
  }

  /**
   * Get adapter type
   */
  getType() {
    return 'antd-mobile'
  }

  /**
   * Check if mobile adapter
   */
  isMobile() {
    return true
  }
}

export default AntdMobileAdapter
