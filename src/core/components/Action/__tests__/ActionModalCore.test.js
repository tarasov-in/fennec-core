/**
 * ActionModalCore Unit Tests
 */

import { ActionModalCore } from '../ActionModalCore'

describe('ActionModalCore', () => {
  describe('constructor', () => {
    it('should initialize with default state', () => {
      const core = new ActionModalCore()

      expect(core.isOpened()).toBe(false)
      expect(core.isControlled()).toBe(false)
    })

    it('should initialize with controlled visible=true', () => {
      const core = new ActionModalCore({ visible: true })

      expect(core.isOpened()).toBe(true)
      expect(core.isControlled()).toBe(true)
    })

    it('should initialize with controlled visible=false', () => {
      const core = new ActionModalCore({ visible: false })

      expect(core.isOpened()).toBe(false)
      expect(core.isControlled()).toBe(true)
    })
  })

  describe('open', () => {
    it('should open modal in uncontrolled mode', () => {
      const core = new ActionModalCore()

      const result = core.open()

      expect(result).toBe(true)
      expect(core.isOpened()).toBe(true)
    })

    it('should call onOpen callbacks', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      core.onOpen(callback)
      core.open()

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should not open in controlled mode', () => {
      const core = new ActionModalCore({ visible: false })

      const result = core.open()

      expect(result).toBe(false)
      expect(core.isOpened()).toBe(false)
    })

    it('should not open if already opened', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      core.onOpen(callback)
      core.open()
      const result = core.open() // Second call

      expect(result).toBe(false)
      expect(callback).toHaveBeenCalledTimes(1) // Only once
    })
  })

  describe('close', () => {
    it('should close modal in uncontrolled mode', () => {
      const core = new ActionModalCore()
      core.open()

      const result = core.close()

      expect(result).toBe(true)
      expect(core.isOpened()).toBe(false)
    })

    it('should call onClose callbacks', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      core.onClose(callback)
      core.open()
      core.close()

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose callbacks when skipCallback=true', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      core.onClose(callback)
      core.open()
      core.close({ skipCallback: true })

      expect(callback).not.toHaveBeenCalled()
    })

    it('should not close in controlled mode', () => {
      const core = new ActionModalCore({ visible: true })

      const result = core.close()

      expect(result).toBe(false)
      expect(core.isOpened()).toBe(true)
    })

    it('should not close if already closed', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      core.onClose(callback)
      const result = core.close() // Already closed

      expect(result).toBe(false)
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('toggle', () => {
    it('should toggle from closed to open', () => {
      const core = new ActionModalCore()

      const result = core.toggle()

      expect(result).toBe(true)
      expect(core.isOpened()).toBe(true)
    })

    it('should toggle from open to closed', () => {
      const core = new ActionModalCore()
      core.open()

      const result = core.toggle()

      expect(result).toBe(false)
      expect(core.isOpened()).toBe(false)
    })
  })

  describe('updateControlledState', () => {
    it('should update state in controlled mode', () => {
      const core = new ActionModalCore({ visible: false })

      core.updateControlledState(true)

      expect(core.isOpened()).toBe(true)
    })

    it('should not update state in uncontrolled mode', () => {
      const core = new ActionModalCore()

      core.updateControlledState(true)

      expect(core.isOpened()).toBe(false) // Still initial state
    })
  })

  describe('callbacks', () => {
    it('should register and unregister onOpen callback', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      const unregister = core.onOpen(callback)
      core.open()
      expect(callback).toHaveBeenCalledTimes(1)

      unregister()
      core.close()
      core.open()
      expect(callback).toHaveBeenCalledTimes(1) // Not called again
    })

    it('should register and unregister onClose callback', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      const unregister = core.onClose(callback)
      core.open()
      core.close()
      expect(callback).toHaveBeenCalledTimes(1)

      unregister()
      core.open()
      core.close()
      expect(callback).toHaveBeenCalledTimes(1) // Not called again
    })
  })

  describe('getModalProps', () => {
    it('should return correct modal props', () => {
      const core = new ActionModalCore()
      core.open()

      const props = core.getModalProps()

      expect(props).toEqual({
        visible: true,
        onClose: expect.any(Function),
        onCancel: expect.any(Function)
      })
    })

    it('should return working onClose handler', () => {
      const core = new ActionModalCore()
      core.open()

      const props = core.getModalProps()
      props.onClose()

      expect(core.isOpened()).toBe(false)
    })
  })

  describe('getTriggerProps', () => {
    it('should return trigger props with onClick handler', () => {
      const core = new ActionModalCore()

      const props = core.getTriggerProps()

      expect(props).toEqual({
        onClick: expect.any(Function),
        disabled: false
      })
    })

    it('should open modal when onClick is called', () => {
      const core = new ActionModalCore()

      const props = core.getTriggerProps()
      props.onClick()

      expect(core.isOpened()).toBe(true)
    })

    it('should be disabled when disabled=true', () => {
      const core = new ActionModalCore({ disabled: true })

      const props = core.getTriggerProps()

      expect(props.disabled).toBe(true)
    })

    it('should be disabled when readonly=true', () => {
      const core = new ActionModalCore({ readonly: true })

      const props = core.getTriggerProps()

      expect(props.disabled).toBe(true)
    })

    it('should not open when disabled', () => {
      const core = new ActionModalCore({ disabled: true })

      const props = core.getTriggerProps()
      props.onClick()

      expect(core.isOpened()).toBe(false)
    })

    it('should merge custom props', () => {
      const core = new ActionModalCore()
      const customProps = { className: 'custom', 'data-test': 'trigger' }

      const props = core.getTriggerProps(customProps)

      expect(props).toEqual({
        onClick: expect.any(Function),
        disabled: false,
        className: 'custom',
        'data-test': 'trigger'
      })
    })
  })

  describe('destroy', () => {
    it('should cleanup callbacks', () => {
      const core = new ActionModalCore()
      const callback = jest.fn()

      core.onOpen(callback)
      core.onClose(callback)
      core.destroy()

      core.open()
      core.close()

      expect(callback).not.toHaveBeenCalled()
    })
  })
})
