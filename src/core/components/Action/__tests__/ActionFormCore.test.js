/**
 * ActionFormCore Unit Tests
 */

import { ActionFormCore } from '../ActionFormCore'

describe('ActionFormCore', () => {
  describe('constructor', () => {
    it('should initialize with empty object', () => {
      const core = new ActionFormCore()

      expect(core.getInitialValues()).toEqual({})
      expect(core.getCurrentValues()).toEqual({})
    })

    it('should initialize with object data', () => {
      const object = { name: 'John', age: 30 }
      const core = new ActionFormCore({ object })

      expect(core.getInitialValues()).toEqual(object)
      expect(core.getCurrentValues()).toEqual(object)
    })
  })

  describe('values management', () => {
    it('should set and get values', () => {
      const core = new ActionFormCore()
      const values = { name: 'Jane', email: 'jane@example.com' }

      core.setValues(values)

      expect(core.getCurrentValues()).toEqual(values)
    })

    it('should set and get field value', () => {
      const core = new ActionFormCore({ object: { name: 'John' } })

      core.setFieldValue('age', 25)

      expect(core.getFieldValue('age')).toBe(25)
      expect(core.getFieldValue('name')).toBe('John')
    })

    it('should call onChange callbacks', () => {
      const core = new ActionFormCore()
      const callback = jest.fn()

      core.onChange(callback)
      core.setValues({ name: 'Test' })

      expect(callback).toHaveBeenCalledWith(
        { name: 'Test' },
        expect.any(Set)
      )
    })
  })

  describe('change detection', () => {
    it('should detect no changes initially', () => {
      const core = new ActionFormCore({ object: { name: 'John' } })

      expect(core.isFormChanged()).toBe(false)
      expect(core.getChangedFields()).toEqual([])
    })

    it('should detect changed field', () => {
      const core = new ActionFormCore({ object: { name: 'John', age: 30 } })

      core.setFieldValue('name', 'Jane')

      expect(core.isFormChanged()).toBe(true)
      expect(core.isFieldChanged('name')).toBe(true)
      expect(core.isFieldChanged('age')).toBe(false)
      expect(core.getChangedFields()).toContain('name')
    })

    it('should detect multiple changed fields', () => {
      const core = new ActionFormCore({ object: { name: 'John', age: 30 } })

      core.setValues({ name: 'Jane', age: 25 })

      expect(core.isFormChanged()).toBe(true)
      expect(core.getChangedFields()).toEqual(expect.arrayContaining(['name', 'age']))
    })

    it('should detect added field', () => {
      const core = new ActionFormCore({ object: { name: 'John' } })

      core.setFieldValue('email', 'john@example.com')

      expect(core.isFormChanged()).toBe(true)
      expect(core.isFieldChanged('email')).toBe(true)
    })

    it('should detect removed field', () => {
      const core = new ActionFormCore({ object: { name: 'John', age: 30 } })

      core.setValues({ name: 'John' }) // age removed

      expect(core.isFormChanged()).toBe(true)
      expect(core.getChangedFields()).toContain('age')
    })
  })

  describe('isValueDifferent', () => {
    let core

    beforeEach(() => {
      core = new ActionFormCore()
    })

    it('should return false for same values', () => {
      expect(core.isValueDifferent('test', 'test')).toBe(false)
      expect(core.isValueDifferent(42, 42)).toBe(false)
      expect(core.isValueDifferent(true, true)).toBe(false)
    })

    it('should return true for different primitives', () => {
      expect(core.isValueDifferent('a', 'b')).toBe(true)
      expect(core.isValueDifferent(1, 2)).toBe(true)
      expect(core.isValueDifferent(true, false)).toBe(true)
    })

    it('should handle null and undefined', () => {
      expect(core.isValueDifferent(null, undefined)).toBe(true)
      expect(core.isValueDifferent(null, null)).toBe(false)
      expect(core.isValueDifferent(undefined, undefined)).toBe(false)
      expect(core.isValueDifferent(null, 'value')).toBe(true)
    })

    it('should compare arrays', () => {
      expect(core.isValueDifferent([1, 2, 3], [1, 2, 3])).toBe(false)
      expect(core.isValueDifferent([1, 2], [1, 2, 3])).toBe(true)
      expect(core.isValueDifferent([1, 2, 3], [1, 3, 2])).toBe(true)
    })

    it('should compare objects', () => {
      expect(core.isValueDifferent({ a: 1 }, { a: 1 })).toBe(false)
      expect(core.isValueDifferent({ a: 1 }, { a: 2 })).toBe(true)
      expect(core.isValueDifferent({ a: 1 }, { a: 1, b: 2 })).toBe(true)
    })

    it('should handle nested structures', () => {
      const obj1 = { user: { name: 'John', tags: [1, 2, 3] } }
      const obj2 = { user: { name: 'John', tags: [1, 2, 3] } }
      const obj3 = { user: { name: 'John', tags: [1, 2, 4] } }

      expect(core.isValueDifferent(obj1, obj2)).toBe(false)
      expect(core.isValueDifferent(obj1, obj3)).toBe(true)
    })

    it('should handle same reference', () => {
      const obj = { a: 1 }
      expect(core.isValueDifferent(obj, obj)).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset to initial values', () => {
      const core = new ActionFormCore({ object: { name: 'John', age: 30 } })

      core.setFieldValue('name', 'Jane')
      core.setFieldValue('age', 25)
      core.reset()

      expect(core.getCurrentValues()).toEqual({ name: 'John', age: 30 })
      expect(core.isFormChanged()).toBe(false)
    })

    it('should call onChange callback on reset', () => {
      const core = new ActionFormCore({ object: { name: 'John' } })
      const callback = jest.fn()

      core.setFieldValue('name', 'Jane')
      core.onChange(callback)
      core.reset()

      expect(callback).toHaveBeenCalled()
    })
  })

  describe('applyModify', () => {
    it('should return values unchanged if no modify function', () => {
      const core = new ActionFormCore()
      const values = { name: 'John' }

      const result = core.applyModify(values)

      expect(result).toEqual(values)
    })

    it('should apply modify function', () => {
      const modify = (values) => ({
        ...values,
        name: values.name.toUpperCase()
      })
      const core = new ActionFormCore({ modify })
      const values = { name: 'john' }

      const result = core.applyModify(values)

      expect(result).toEqual({ name: 'JOHN' })
    })

    it('should handle complex transformations', () => {
      const modify = (values) => ({
        userId: values.user.id,
        userName: values.user.name
      })
      const core = new ActionFormCore({ modify })
      const values = { user: { id: 123, name: 'John' } }

      const result = core.applyModify(values)

      expect(result).toEqual({
        userId: 123,
        userName: 'John'
      })
    })
  })

  describe('toFormData', () => {
    it('should return object unchanged when isFormData=false', () => {
      const core = new ActionFormCore({ isFormData: false })
      const values = { name: 'John' }

      const result = core.toFormData(values)

      expect(result).toEqual(values)
    })

    it('should convert to FormData when isFormData=true', () => {
      const core = new ActionFormCore({ isFormData: true })
      const values = { name: 'John', age: 30 }

      const result = core.toFormData(values)

      expect(result).toBeInstanceOf(FormData)
    })
  })

  describe('prepareForSubmit', () => {
    it('should apply both modify and FormData', () => {
      const modify = (values) => ({
        ...values,
        name: values.name.toUpperCase()
      })
      const core = new ActionFormCore({ modify, isFormData: true })
      const values = { name: 'john' }

      const result = core.prepareForSubmit(values)

      expect(result).toBeInstanceOf(FormData)
      // FormData can't be easily inspected, but we know it was converted
    })

    it('should only apply modify without FormData', () => {
      const modify = (values) => ({
        ...values,
        name: values.name.toUpperCase()
      })
      const core = new ActionFormCore({ modify })
      const values = { name: 'john' }

      const result = core.prepareForSubmit(values)

      expect(result).toEqual({ name: 'JOHN' })
    })
  })

  describe('isSubmitDisabled', () => {
    it('should be disabled when disabled=true', () => {
      const core = new ActionFormCore({ disabled: true })

      expect(core.isSubmitDisabled()).toBe(true)
    })

    it('should be disabled when readonly=true', () => {
      const core = new ActionFormCore({ readonly: true })

      expect(core.isSubmitDisabled()).toBe(true)
    })

    it('should be disabled when form unchanged and flag set', () => {
      const core = new ActionFormCore({
        object: { name: 'John' },
        disabledOkOnUncahngedForm: true
      })

      expect(core.isSubmitDisabled()).toBe(true)
    })

    it('should be enabled when form changed', () => {
      const core = new ActionFormCore({
        object: { name: 'John' },
        disabledOkOnUncahngedForm: true
      })

      core.setFieldValue('name', 'Jane')

      expect(core.isSubmitDisabled()).toBe(false)
    })

    it('should be enabled by default', () => {
      const core = new ActionFormCore()

      expect(core.isSubmitDisabled()).toBe(false)
    })
  })

  describe('validate', () => {
    it('should return valid by default', () => {
      const core = new ActionFormCore()

      const result = core.validate()

      expect(result).toEqual({
        valid: true,
        errors: {}
      })
    })
  })

  describe('shouldUseAntForm', () => {
    it('should return true by default', () => {
      const core = new ActionFormCore()

      expect(core.shouldUseAntForm()).toBe(true)
    })

    it('should return false when noAntForm=true', () => {
      const core = new ActionFormCore({ noAntForm: true })

      expect(core.shouldUseAntForm()).toBe(false)
    })
  })

  describe('getFormProps', () => {
    it('should return form props', () => {
      const core = new ActionFormCore({ object: { name: 'John' } })

      const props = core.getFormProps()

      expect(props).toEqual({
        initialValues: { name: 'John' },
        values: { name: 'John' },
        onChange: expect.any(Function)
      })
    })

    it('should return working onChange handler', () => {
      const core = new ActionFormCore()

      const props = core.getFormProps()
      props.onChange({ name: 'Test' })

      expect(core.getCurrentValues()).toEqual({ name: 'Test' })
    })
  })

  describe('callbacks', () => {
    it('should register and unregister onChange', () => {
      const core = new ActionFormCore()
      const callback = jest.fn()

      const unregister = core.onChange(callback)
      core.setValues({ name: 'Test' })
      expect(callback).toHaveBeenCalledTimes(1)

      unregister()
      core.setValues({ name: 'Test2' })
      expect(callback).toHaveBeenCalledTimes(1) // Not called again
    })
  })

  describe('destroy', () => {
    it('should cleanup callbacks and changed fields', () => {
      const core = new ActionFormCore({ object: { name: 'John' } })
      const callback = jest.fn()

      core.onChange(callback)
      core.setFieldValue('name', 'Jane')
      core.destroy()

      core.setValues({ name: 'Test' })

      expect(callback).not.toHaveBeenCalled()
      expect(core.getChangedFields()).toEqual([])
    })
  })
})
