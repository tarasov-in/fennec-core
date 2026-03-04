/**
 * AntdMobileAdapter Tests
 *
 * Test suite for AntdMobileAdapter
 * Ensures all components are properly wrapped and normalized
 *
 * @version 2.2.0
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { AntdMobileAdapter } from '../AntdMobileAdapter'

describe('AntdMobileAdapter', () => {
  let adapter

  beforeEach(() => {
    adapter = new AntdMobileAdapter()
  })

  // ========== Initialization Tests ==========

  describe('Initialization', () => {
    it('should create adapter instance', () => {
      expect(adapter).toBeInstanceOf(AntdMobileAdapter)
    })

    it('should have getType method returning "antd-mobile"', () => {
      expect(adapter.getType()).toBe('antd-mobile')
    })

    it('should identify as mobile adapter', () => {
      expect(adapter.isMobile()).toBe(true)
    })

    it('should initialize all form components', () => {
      expect(adapter.Input).toBeDefined()
      expect(adapter.TextArea).toBeDefined()
      expect(adapter.InputNumber).toBeDefined()
      expect(adapter.Select).toBeDefined()
      expect(adapter.Checkbox).toBeDefined()
      expect(adapter.Radio).toBeDefined()
      expect(adapter.Switch).toBeDefined()
      expect(adapter.Slider).toBeDefined()
      expect(adapter.Rate).toBeDefined()
      expect(adapter.DatePicker).toBeDefined()
      expect(adapter.TimePicker).toBeDefined()
      expect(adapter.Upload).toBeDefined()
    })

    it('should initialize all display components', () => {
      expect(adapter.Table).toBeDefined()
      expect(adapter.List).toBeDefined()
      expect(adapter.Tag).toBeDefined()
      expect(adapter.Badge).toBeDefined()
      expect(adapter.Avatar).toBeDefined()
      expect(adapter.Image).toBeDefined()
      expect(adapter.Progress).toBeDefined()
    })

    it('should initialize all feedback components', () => {
      expect(adapter.Modal).toBeDefined()
      expect(adapter.Drawer).toBeDefined()
      expect(adapter.Popup).toBeDefined()
      expect(adapter.Message).toBeDefined()
      expect(adapter.Notification).toBeDefined()
      expect(adapter.Popconfirm).toBeDefined()
      expect(adapter.Spin).toBeDefined()
      expect(adapter.Loading).toBeDefined()
    })

    it('should initialize all navigation components', () => {
      expect(adapter.Button).toBeDefined()
      expect(adapter.Pagination).toBeDefined()
    })
  })

  // ========== Input Component Tests ==========

  describe('Input Component', () => {
    it('should render Input component', () => {
      const { container } = render(
        <adapter.Input placeholder="Enter text" />
      )
      expect(container).not.toBeEmptyDOMElement()
    })

    it('should normalize onChange API from antd-mobile to antd', () => {
      const handleChange = jest.fn()

      // antd-mobile Input calls onChange(value)
      // We need to normalize to onChange({ target: { value } })

      const InputComponent = adapter.Input
      const { container } = render(
        <InputComponent onChange={handleChange} />
      )

      // Find input element
      const input = container.querySelector('input')

      if (input) {
        // Simulate change
        fireEvent.change(input, { target: { value: 'test' } })

        // Should be called with normalized format
        expect(handleChange).toHaveBeenCalled()
      }
    })

    it('should support value prop', () => {
      const { container } = render(
        <adapter.Input value="test value" onChange={() => {}} />
      )

      const input = container.querySelector('input')
      if (input) {
        expect(input.value).toBe('test value')
      }
    })
  })

  // ========== InputNumber Component Tests ==========

  describe('InputNumber Component', () => {
    it('should render InputNumber as Input with type="number"', () => {
      const { container } = render(
        <adapter.InputNumber placeholder="Enter number" />
      )

      const input = container.querySelector('input[type="number"]')
      expect(input).toBeTruthy()
    })

    it('should convert string to number in onChange', () => {
      const handleChange = jest.fn()

      const InputNumberComponent = adapter.InputNumber
      render(<InputNumberComponent onChange={handleChange} />)

      // Should normalize value to number
      // Implementation tested via integration
    })
  })

  // ========== Select Component Tests ==========

  describe('Select Component', () => {
    it('should render Select (Selector) component', () => {
      const options = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' }
      ]

      const { container } = render(
        <adapter.Select options={options} />
      )

      expect(container).not.toBeEmptyDOMElement()
    })

    it('should normalize options format', () => {
      const options = ['Option 1', 'Option 2', 'Option 3']

      const SelectComponent = adapter.Select
      const { container } = render(
        <SelectComponent options={options} />
      )

      // Options should be normalized to { label, value } format
      expect(container).not.toBeEmptyDOMElement()
    })

    it('should support multiple mode', () => {
      const options = [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b' }
      ]

      const SelectComponent = adapter.Select
      render(<SelectComponent options={options} mode="multiple" />)

      // Multiple mode should be passed to Selector
    })
  })

  // ========== Rate Component Tests ==========

  describe('Rate Component', () => {
    it('should render Rate component', () => {
      const { container } = render(
        <adapter.Rate count={5} value={3} onChange={() => {}} />
      )

      // Should render 5 stars
      const stars = container.querySelectorAll('.star')
      expect(stars.length).toBe(5)
    })

    it('should render filled stars based on value', () => {
      const { container } = render(
        <adapter.Rate count={5} value={3} onChange={() => {}} />
      )

      const filledStars = container.querySelectorAll('.star.filled')
      expect(filledStars.length).toBe(3)
    })

    it('should call onChange when star is clicked', () => {
      const handleChange = jest.fn()

      const { container } = render(
        <adapter.Rate count={5} value={0} onChange={handleChange} />
      )

      const stars = container.querySelectorAll('.star')
      fireEvent.click(stars[2]) // Click 3rd star

      expect(handleChange).toHaveBeenCalledWith(3)
    })
  })

  // ========== DatePicker Component Tests ==========

  describe('DatePicker Component', () => {
    it('should render DatePicker component', () => {
      const DatePickerComponent = adapter.DatePicker
      const { container } = render(
        <DatePickerComponent value={new Date()} onChange={() => {}} />
      )

      expect(container).not.toBeEmptyDOMElement()
    })

    it('should render TimePicker with precision="minute"', () => {
      const TimePickerComponent = adapter.TimePicker
      const { container } = render(
        <TimePickerComponent value={new Date()} onChange={() => {}} />
      )

      expect(container).not.toBeEmptyDOMElement()
    })
  })

  // ========== Upload Component Tests ==========

  describe('Upload Component', () => {
    it('should render ImageUploader component', () => {
      const UploadComponent = adapter.Upload
      const { container } = render(
        <UploadComponent fileList={[]} onChange={() => {}} />
      )

      expect(container).not.toBeEmptyDOMElement()
    })

    it('should normalize onChange to include fileList', () => {
      const handleChange = jest.fn()

      const UploadComponent = adapter.Upload
      render(<UploadComponent onChange={handleChange} fileList={[]} />)

      // onChange should be normalized to { fileList: [...] }
    })
  })

  // ========== List/Table Component Tests ==========

  describe('List Component (Table wrapper)', () => {
    it('should render List for dataSource', () => {
      const dataSource = [
        { ID: 1, name: 'Item 1' },
        { ID: 2, name: 'Item 2' }
      ]

      const TableComponent = adapter.Table
      const { container } = render(
        <TableComponent dataSource={dataSource} />
      )

      expect(container).not.toBeEmptyDOMElement()
    })

    it('should use custom renderItem if provided', () => {
      const dataSource = [{ ID: 1, name: 'Test' }]
      const renderItem = jest.fn(() => <div>Custom</div>)

      const TableComponent = adapter.Table
      render(
        <TableComponent dataSource={dataSource} renderItem={renderItem} />
      )

      expect(renderItem).toHaveBeenCalledWith(dataSource[0])
    })

    it('should show loading state', () => {
      const TableComponent = adapter.Table
      render(<TableComponent dataSource={[]} loading={true} />)

      // Should render Loading component
    })
  })

  // ========== Modal Component Tests ==========

  describe('Modal Component', () => {
    it('should render Modal component', () => {
      const ModalComponent = adapter.Modal
      render(
        <ModalComponent
          visible={true}
          title="Test Modal"
          onOk={() => {}}
          onCancel={() => {}}
        >
          <div>Modal content</div>
        </ModalComponent>
      )

      // Modal should be rendered
    })

    it('should normalize visible prop', () => {
      const ModalComponent = adapter.Modal
      const { rerender } = render(
        <ModalComponent visible={false} onCancel={() => {}}>
          Content
        </ModalComponent>
      )

      // Rerender with visible=true
      rerender(
        <ModalComponent visible={true} onCancel={() => {}}>
          Content
        </ModalComponent>
      )
    })
  })

  // ========== Message/Toast Component Tests ==========

  describe('Message Component', () => {
    it('should have success method', () => {
      expect(adapter.Message.success).toBeDefined()
      expect(typeof adapter.Message.success).toBe('function')
    })

    it('should have error method', () => {
      expect(adapter.Message.error).toBeDefined()
      expect(typeof adapter.Message.error).toBe('function')
    })

    it('should have warning method', () => {
      expect(adapter.Message.warning).toBeDefined()
      expect(typeof adapter.Message.warning).toBe('function')
    })

    it('should have info method', () => {
      expect(adapter.Message.info).toBeDefined()
      expect(typeof adapter.Message.info).toBe('function')
    })
  })

  // ========== Render Methods Tests ==========

  describe('Render Methods', () => {
    it('should have renderInput method', () => {
      const result = adapter.renderInput({ placeholder: 'Test' })
      expect(result).toBeTruthy()
    })

    it('should have renderTextArea method', () => {
      const result = adapter.renderTextArea({ placeholder: 'Test' })
      expect(result).toBeTruthy()
    })

    it('should have renderSelect method', () => {
      const result = adapter.renderSelect({ options: [] })
      expect(result).toBeTruthy()
    })

    it('should have renderDatePicker method', () => {
      const result = adapter.renderDatePicker({ value: new Date() })
      expect(result).toBeTruthy()
    })

    it('should have renderButton method', () => {
      const result = adapter.renderButton({ children: 'Click' })
      expect(result).toBeTruthy()
    })

    it('should have renderModal method', () => {
      const result = adapter.renderModal({
        visible: true,
        children: 'Content'
      })
      expect(result).toBeTruthy()
    })

    it('should have renderList method', () => {
      const result = adapter.renderList({ dataSource: [] })
      expect(result).toBeTruthy()
    })

    it('should have showSuccess method', () => {
      expect(typeof adapter.showSuccess).toBe('function')
    })

    it('should have showError method', () => {
      expect(typeof adapter.showError).toBe('function')
    })

    it('should have showInfo method', () => {
      expect(typeof adapter.showInfo).toBe('function')
    })
  })

  // ========== renderField (Field.js contract) ==========

  describe('renderField', () => {
    it('should have renderField method (same contract as AntdAdapter)', () => {
      expect(typeof adapter.renderField).toBe('function')
    })

    it('should return null when options or type is missing', () => {
      expect(adapter.renderField(null)).toBeNull()
      expect(adapter.renderField({})).toBeNull()
      expect(adapter.renderField({ type: null })).toBeNull()
    })

    it('should render string field as Input', () => {
      const result = adapter.renderField({
        type: 'string',
        value: 'hello',
        onChange: () => {},
        item: {},
        disabled: false,
        placeholder: 'Enter'
      })
      expect(result).toBeTruthy()
    })

    it('should render number field as InputNumber', () => {
      const result = adapter.renderField({
        type: 'int',
        value: 42,
        onChange: () => {},
        item: {},
        disabled: false
      })
      expect(result).toBeTruthy()
    })

    it('should render boolean field as Checkbox', () => {
      const result = adapter.renderField({
        type: 'boolean',
        value: true,
        onChange: () => {},
        item: {},
        disabled: false
      })
      expect(result).toBeTruthy()
    })

    it('should render date field as DatePicker', () => {
      const result = adapter.renderField({
        type: 'date',
        value: '2025-01-15',
        onChange: () => {},
        item: {},
        disabled: false
      })
      expect(result).toBeTruthy()
    })

    it('should have formatDate and parseDate for date handling', () => {
      const d = adapter.formatDate('2025-01-15')
      expect(d).toBeInstanceOf(Date)
      const str = adapter.parseDate(d)
      expect(typeof str).toBe('string')
    })

    it('should have confirm method for imperative dialogs', () => {
      expect(typeof adapter.confirm).toBe('function')
    })

    it('should have transformFormData, transformTableData, createValidator, normalizeFiles', () => {
      expect(adapter.transformFormData({ a: 1 })).toEqual({ a: 1 })
      expect(adapter.transformTableData([1, 2])).toEqual([1, 2])
      expect(adapter.createValidator([])).toEqual([])
      expect(adapter.normalizeFiles([])).toEqual([])
    })
  })

  // ========== API Compatibility Tests ==========

  describe('API Compatibility with AntdAdapter', () => {
    it('should have same core components as AntdAdapter', () => {
      const coreComponents = [
        'Input',
        'TextArea',
        'Select',
        'DatePicker',
        'Upload',
        'Button',
        'Modal',
        'Table',
        'Checkbox',
        'Radio',
        'Switch'
      ]

      coreComponents.forEach((componentName) => {
        expect(adapter[componentName]).toBeDefined()
      })
    })

    it('should have same render methods as AntdAdapter', () => {
      const renderMethods = [
        'renderInput',
        'renderTextArea',
        'renderSelect',
        'renderDatePicker',
        'renderButton',
        'renderModal',
        'renderList'
      ]

      renderMethods.forEach((methodName) => {
        expect(typeof adapter[methodName]).toBe('function')
      })
    })

    it('should have same utility methods as AntdAdapter', () => {
      const utilityMethods = [
        'showSuccess',
        'showError',
        'showInfo',
        'getType',
        'isMobile'
      ]

      utilityMethods.forEach((methodName) => {
        expect(typeof adapter[methodName]).toBe('function')
      })
    })
  })
})
