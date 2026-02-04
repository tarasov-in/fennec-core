/**
 * FieldCore Tests
 *
 * Comprehensive tests for FieldCore business logic with edge cases
 */

import { FieldCore } from '../FieldCore'
import dayjs from 'dayjs'

describe('FieldCore', () => {
  let mockAdapter

  beforeEach(() => {
    mockAdapter = {
      DatePicker: jest.fn(),
      TimePicker: jest.fn(),
      InputNumber: jest.fn(),
      Input: jest.fn(),
      Switch: jest.fn()
    }
  })

  describe('Field Type Detection', () => {
    it('should detect string type by default', () => {
      const fieldCore = new FieldCore({}, {}, mockAdapter)
      expect(fieldCore.getFieldType()).toBe('string')
    })

    it('should detect type from metadata', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      expect(fieldCore.getFieldType()).toBe('integer')
    })
  })

  describe('String Types - formatValue', () => {
    it('should convert number to string', () => {
      const fieldCore = new FieldCore({}, { type: 'string' }, mockAdapter)
      expect(fieldCore.formatValue(123)).toBe('123')
    })

    it('should handle null/undefined', () => {
      const fieldCore = new FieldCore({}, { type: 'string' }, mockAdapter)
      expect(fieldCore.formatValue(null)).toBeUndefined()
      expect(fieldCore.formatValue(undefined)).toBeUndefined()
    })

    it('should handle empty string', () => {
      const fieldCore = new FieldCore({}, { type: 'string' }, mockAdapter)
      expect(fieldCore.formatValue('')).toBe('')
    })

    it('should preserve string value', () => {
      const fieldCore = new FieldCore({}, { type: 'email' }, mockAdapter)
      expect(fieldCore.formatValue('test@example.com')).toBe('test@example.com')
    })
  })

  describe('Integer Types - formatValue/parseValue', () => {
    it('should format integer from string', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      expect(fieldCore.formatValue('42')).toBe(42)
    })

    it('should format integer from number', () => {
      const fieldCore = new FieldCore({}, { type: 'int' }, mockAdapter)
      expect(fieldCore.formatValue(42)).toBe(42)
    })

    it('should handle decimal input by flooring', () => {
      const fieldCore = new FieldCore({}, { type: 'long' }, mockAdapter)
      expect(fieldCore.parseValue(42.7)).toBe(42)
    })

    it('should handle negative integers', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      expect(fieldCore.formatValue(-10)).toBe(-10)
    })

    it('should handle zero', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      expect(fieldCore.formatValue(0)).toBe(0)
    })

    it('should return undefined for empty string', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      expect(fieldCore.parseValue('')).toBeUndefined()
    })
  })

  describe('Float Types - formatValue/parseValue', () => {
    it('should format float from string', () => {
      const fieldCore = new FieldCore({}, { type: 'float' }, mockAdapter)
      expect(fieldCore.formatValue('3.14')).toBe(3.14)
    })

    it('should preserve float precision', () => {
      const fieldCore = new FieldCore({}, { type: 'double' }, mockAdapter)
      expect(fieldCore.formatValue(3.14159)).toBe(3.14159)
    })

    it('should handle bigdecimal', () => {
      const fieldCore = new FieldCore({}, { type: 'bigdecimal' }, mockAdapter)
      expect(fieldCore.formatValue('999.99')).toBe(999.99)
    })

    it('should handle scientific notation', () => {
      const fieldCore = new FieldCore({}, { type: 'float' }, mockAdapter)
      expect(fieldCore.formatValue(1.23e-4)).toBe(0.000123)
    })
  })

  describe('Boolean Types - formatValue/parseValue', () => {
    it('should format true boolean', () => {
      const fieldCore = new FieldCore({}, { type: 'boolean' }, mockAdapter)
      expect(fieldCore.formatValue(true)).toBe(true)
    })

    it('should format false boolean', () => {
      const fieldCore = new FieldCore({}, { type: 'bool' }, mockAdapter)
      expect(fieldCore.formatValue(false)).toBe(false)
    })

    it('should convert truthy values to true', () => {
      const fieldCore = new FieldCore({}, { type: 'boolean' }, mockAdapter)
      expect(fieldCore.formatValue(1)).toBe(true)
      expect(fieldCore.formatValue('yes')).toBe(true)
      expect(fieldCore.formatValue({})).toBe(true)
    })

    it('should convert falsy values to false', () => {
      const fieldCore = new FieldCore({}, { type: 'boolean' }, mockAdapter)
      expect(fieldCore.formatValue(0)).toBe(false)
      expect(fieldCore.formatValue('')).toBe(false)
    })

    it('should parse boolean correctly', () => {
      const fieldCore = new FieldCore({}, { type: 'boolean' }, mockAdapter)
      expect(fieldCore.parseValue(true)).toBe(true)
      expect(fieldCore.parseValue(false)).toBe(false)
    })
  })

  describe('Date Types - formatValue/parseValue', () => {
    it('should format date from ISO string', () => {
      const fieldCore = new FieldCore({}, { type: 'date' }, mockAdapter)
      const result = fieldCore.formatValue('2024-01-15')
      expect(dayjs.isDayjs(result)).toBe(true)
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-15')
    })

    it('should handle dayjs object', () => {
      const fieldCore = new FieldCore({}, { type: 'localdate' }, mockAdapter)
      const date = dayjs('2024-01-15')
      const result = fieldCore.formatValue(date)
      expect(result).toBe(date)
    })

    it('should return null for null/undefined date', () => {
      const fieldCore = new FieldCore({}, { type: 'date' }, mockAdapter)
      expect(fieldCore.formatValue(null)).toBeNull()
      expect(fieldCore.formatValue(undefined)).toBeUndefined()
    })

    it('should parse dayjs to YYYY-MM-DD string', () => {
      const fieldCore = new FieldCore({}, { type: 'date' }, mockAdapter)
      const date = dayjs('2024-01-15')
      expect(fieldCore.parseValue(date)).toBe('2024-01-15')
    })

    it('should handle invalid date', () => {
      const fieldCore = new FieldCore({}, { type: 'date' }, mockAdapter)
      const result = fieldCore.formatValue('invalid-date')
      expect(dayjs.isDayjs(result)).toBe(true)
      expect(result.isValid()).toBe(false)
    })
  })

  describe('Time Types - formatValue/parseValue', () => {
    it('should format time from HH:mm:ss string', () => {
      const fieldCore = new FieldCore({}, { type: 'time' }, mockAdapter)
      const result = fieldCore.formatValue('14:30:00')
      expect(dayjs.isDayjs(result)).toBe(true)
      expect(result.format('HH:mm:ss')).toBe('14:30:00')
    })

    it('should handle dayjs object', () => {
      const fieldCore = new FieldCore({}, { type: 'localtime' }, mockAdapter)
      const time = dayjs('14:30:00', 'HH:mm:ss')
      const result = fieldCore.formatValue(time)
      expect(result).toBe(time)
    })

    it('should parse dayjs to HH:mm:ss string', () => {
      const fieldCore = new FieldCore({}, { type: 'time' }, mockAdapter)
      const time = dayjs('14:30:00', 'HH:mm:ss')
      expect(fieldCore.parseValue(time)).toBe('14:30:00')
    })

    it('should handle edge time values', () => {
      const fieldCore = new FieldCore({}, { type: 'time' }, mockAdapter)
      expect(fieldCore.formatValue('00:00:00').format('HH:mm:ss')).toBe('00:00:00')
      expect(fieldCore.formatValue('23:59:59').format('HH:mm:ss')).toBe('23:59:59')
    })
  })

  describe('DateTime Types - formatValue/parseValue', () => {
    it('should format datetime from ISO string', () => {
      const fieldCore = new FieldCore({}, { type: 'datetime' }, mockAdapter)
      const result = fieldCore.formatValue('2024-01-15T14:30:00.000Z')
      expect(dayjs.isDayjs(result)).toBe(true)
    })

    it('should handle timestamp type', () => {
      const fieldCore = new FieldCore({}, { type: 'timestamp' }, mockAdapter)
      const date = new Date('2024-01-15T14:30:00.000Z')
      const result = fieldCore.formatValue(date.toISOString())
      expect(dayjs.isDayjs(result)).toBe(true)
    })

    it('should parse dayjs to ISO string', () => {
      const fieldCore = new FieldCore({}, { type: 'datetime' }, mockAdapter)
      const datetime = dayjs('2024-01-15T14:30:00.000Z')
      const result = fieldCore.parseValue(datetime)
      expect(result).toContain('2024-01-15')
      expect(result).toContain('T')
    })

    it('should handle localdatetime', () => {
      const fieldCore = new FieldCore({}, { type: 'localdatetime' }, mockAdapter)
      const result = fieldCore.formatValue('2024-01-15T14:30:00')
      expect(dayjs.isDayjs(result)).toBe(true)
    })
  })

  describe('Validation Rules', () => {
    it('should detect required field', () => {
      const fieldCore = new FieldCore(
        {},
        { validators: { required: true } },
        mockAdapter
      )
      expect(fieldCore.isRequired()).toBe(true)
    })

    it('should detect non-required field', () => {
      const fieldCore = new FieldCore({}, {}, mockAdapter)
      expect(fieldCore.isRequired()).toBe(false)
    })
  })

  describe('Placeholder Generation', () => {
    it('should use provided placeholder', () => {
      const fieldCore = new FieldCore(
        { placeholder: 'Custom placeholder' },
        {},
        mockAdapter
      )
      expect(fieldCore.getPlaceholder()).toBe('Custom placeholder')
    })

    it('should use meta placeholder', () => {
      const fieldCore = new FieldCore(
        {},
        { placeholder: 'Meta placeholder' },
        mockAdapter
      )
      expect(fieldCore.getPlaceholder()).toBe('Meta placeholder')
    })

    it('should generate placeholder for integer', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      expect(fieldCore.getPlaceholder()).toContain('Введите')
    })

    it('should generate placeholder for date', () => {
      const fieldCore = new FieldCore({}, { type: 'date', label: 'Дата' }, mockAdapter)
      expect(fieldCore.getPlaceholder()).toBe('Выберите Дата')
    })

    it('should return empty string for boolean', () => {
      const fieldCore = new FieldCore({}, { type: 'boolean' }, mockAdapter)
      expect(fieldCore.getPlaceholder()).toBe('')
    })
  })

  describe('Type-Specific Props', () => {
    it('should return min/max for integer', () => {
      const fieldCore = new FieldCore(
        {},
        {
          type: 'integer',
          validators: { min: 0, max: 100 }
        },
        mockAdapter
      )
      const props = fieldCore.getTypeSpecificProps('integer')
      expect(props.min).toBe(0)
      expect(props.max).toBe(100)
      expect(props.precision).toBe(0)
    })

    it('should return precision for float', () => {
      const fieldCore = new FieldCore({}, { type: 'float' }, mockAdapter)
      const props = fieldCore.getTypeSpecificProps('float')
      expect(props.precision).toBe(2)
      expect(props.step).toBe(0.01)
    })

    it('should return checked for boolean', () => {
      const fieldCore = new FieldCore(
        { value: true },
        { type: 'boolean' },
        mockAdapter
      )
      const props = fieldCore.getTypeSpecificProps('boolean')
      expect(props.checked).toBe(true)
    })

    it('should return format for date', () => {
      const fieldCore = new FieldCore({}, { type: 'date' }, mockAdapter)
      const props = fieldCore.getTypeSpecificProps('date')
      expect(props.format).toBe('DD.MM.YYYY')
    })

    it('should return showTime for datetime', () => {
      const fieldCore = new FieldCore({}, { type: 'datetime' }, mockAdapter)
      const props = fieldCore.getTypeSpecificProps('datetime')
      expect(props.showTime).toBe(true)
    })

    it('should use custom format if provided', () => {
      const fieldCore = new FieldCore(
        {},
        { type: 'date', format: 'YYYY/MM/DD' },
        mockAdapter
      )
      const props = fieldCore.getTypeSpecificProps('date')
      expect(props.format).toBe('YYYY/MM/DD')
    })
  })

  describe('Component Props Generation', () => {
    it('should generate props with value and onChange', () => {
      const onChange = jest.fn()
      const fieldCore = new FieldCore(
        { value: 'test', onChange },
        { type: 'string' },
        mockAdapter
      )
      const props = fieldCore.getComponentProps()

      expect(props.value).toBe('test')
      expect(props.onChange).toBeDefined()
      expect(props.disabled).toBe(false)
    })

    it('should handle disabled state', () => {
      const fieldCore = new FieldCore(
        { disabled: true },
        {},
        mockAdapter
      )
      const props = fieldCore.getComponentProps()
      expect(props.disabled).toBe(true)
    })

    it('should handle disabled from meta', () => {
      const fieldCore = new FieldCore(
        {},
        { disabled: true },
        mockAdapter
      )
      expect(fieldCore.isDisabled()).toBe(true)
    })

    it('should call onChange with parsed value', () => {
      const onChange = jest.fn()
      const fieldCore = new FieldCore(
        { value: 0, onChange },
        { type: 'integer' },
        mockAdapter
      )

      fieldCore.handleChange(42)
      expect(onChange).toHaveBeenCalledWith(42)
    })
  })

  describe('Label and Help Text', () => {
    it('should return label from props', () => {
      const fieldCore = new FieldCore(
        { label: 'Test Label' },
        {},
        mockAdapter
      )
      expect(fieldCore.getLabel()).toBe('Test Label')
    })

    it('should return label from meta', () => {
      const fieldCore = new FieldCore(
        {},
        { label: 'Meta Label' },
        mockAdapter
      )
      expect(fieldCore.getLabel()).toBe('Meta Label')
    })

    it('should return help text', () => {
      const fieldCore = new FieldCore(
        {},
        { help: 'Help text' },
        mockAdapter
      )
      expect(fieldCore.getHelp()).toBe('Help text')
    })

    it('should return tooltip', () => {
      const fieldCore = new FieldCore(
        {},
        { tooltip: 'Tooltip text' },
        mockAdapter
      )
      expect(fieldCore.getTooltip()).toBe('Tooltip text')
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined meta', () => {
      const fieldCore = new FieldCore({}, undefined, mockAdapter)
      expect(fieldCore.getFieldType()).toBe('string')
      expect(fieldCore.isRequired()).toBe(false)
    })

    it('should handle null value', () => {
      const fieldCore = new FieldCore(
        { value: null },
        { type: 'string' },
        mockAdapter
      )
      expect(fieldCore.formatValue(null)).toBeUndefined()
    })

    it('should handle empty object meta', () => {
      const fieldCore = new FieldCore({}, {}, mockAdapter)
      expect(fieldCore.getFieldType()).toBe('string')
      expect(fieldCore.getValidationRules()).toEqual([])
    })

    it('should handle missing onChange', () => {
      const fieldCore = new FieldCore(
        { value: 'test' },
        {},
        mockAdapter
      )
      expect(() => fieldCore.handleChange('new value')).not.toThrow()
    })

    it('should handle very large numbers', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      expect(fieldCore.formatValue(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('should handle NaN for integer', () => {
      const fieldCore = new FieldCore({}, { type: 'integer' }, mockAdapter)
      const result = fieldCore.formatValue('not-a-number')
      expect(isNaN(result)).toBe(true)
    })
  })
})
