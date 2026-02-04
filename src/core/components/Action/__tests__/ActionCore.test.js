/**
 * ActionCore Unit Tests
 */

import { ActionCore } from '../ActionCore'

describe('ActionCore', () => {
  describe('constructor', () => {
    it('should initialize all sub-cores', () => {
      const core = new ActionCore()

      expect(core.modal).toBeDefined()
      expect(core.wizard).toBeDefined()
      expect(core.form).toBeDefined()
      expect(core.isLoading()).toBe(false)
    })

    it('should pass props to sub-cores', () => {
      const props = {
        visible: true,
        object: { name: 'John' },
        steps: [{ key: 'step1', form: 'Form1' }],
        disabled: true
      }

      const core = new ActionCore(props)

      expect(core.modal.isOpened()).toBe(true)
      expect(core.form.getInitialValues()).toEqual({ name: 'John' })
      expect(core.wizard.getTotalSteps()).toBe(1)
    })
  })

  describe('isWizard', () => {
    it('should return false for simple action', () => {
      const core = new ActionCore({ form: 'MyForm' })

      expect(core.isWizard()).toBe(false)
    })

    it('should return true for wizard with 2+ steps', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ]
      })

      expect(core.isWizard()).toBe(true)
    })
  })

  describe('state checks', () => {
    it('should check readonly state', () => {
      const core = new ActionCore({ readonly: true })

      expect(core.isReadonly()).toBe(true)
    })

    it('should check disabled state', () => {
      const core = new ActionCore({ disabled: true })

      expect(core.isDisabled()).toBe(true)
    })

    it('should check loading state', () => {
      const core = new ActionCore()

      expect(core.isLoading()).toBe(false)

      core.setLoading(true)
      expect(core.isLoading()).toBe(true)
    })
  })

  describe('getCurrentForm', () => {
    it('should return main form for simple action', () => {
      const MyForm = 'MyFormComponent'
      const core = new ActionCore({ form: MyForm })

      expect(core.getCurrentForm()).toBe(MyForm)
    })

    it('should return current step form for wizard', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ]
      })

      expect(core.getCurrentForm()).toBe('Form1')

      core.wizard.nextStep()
      expect(core.getCurrentForm()).toBe('Form2')
    })
  })

  describe('getCurrentObject', () => {
    it('should return main object for simple action', () => {
      const object = { name: 'John', age: 30 }
      const core = new ActionCore({ object })

      expect(core.getCurrentObject()).toEqual(object)
    })

    it('should return current step object for wizard', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1', object: { field1: 'value1' } },
          { key: 'step2', form: 'Form2', object: { field2: 'value2' } }
        ]
      })

      expect(core.getCurrentObject()).toEqual({ field1: 'value1' })

      core.wizard.nextStep()
      expect(core.getCurrentObject()).toEqual({ field2: 'value2' })
    })
  })

  describe('getCurrentTitles', () => {
    it('should return main titles for simple action', () => {
      const titles = { header: 'My Action', subheader: 'Description' }
      const core = new ActionCore({ titles })

      expect(core.getCurrentTitles()).toEqual(titles)
    })

    it('should return current step titles for wizard', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1', titles: { header: 'Step 1' } },
          { key: 'step2', form: 'Form2', titles: { header: 'Step 2' } }
        ]
      })

      expect(core.getCurrentTitles()).toEqual({ header: 'Step 1' })

      core.wizard.nextStep()
      expect(core.getCurrentTitles()).toEqual({ header: 'Step 2' })
    })
  })

  describe('getButtonText', () => {
    it('should return default text for simple action', () => {
      const core = new ActionCore()

      const text = core.getButtonText()

      expect(text).toEqual({
        ok: 'OK',
        dismiss: 'Отмена',
        back: null,
        showBack: false,
        placeholder: 'Открыть'
      })
    })

    it('should return custom text for simple action', () => {
      const core = new ActionCore({
        okText: 'Сохранить',
        dismissText: 'Закрыть',
        placeholder: 'Создать'
      })

      const text = core.getButtonText()

      expect(text).toEqual({
        ok: 'Сохранить',
        dismiss: 'Закрыть',
        back: null,
        showBack: false,
        placeholder: 'Создать'
      })
    })

    it('should return "Далее" for first wizard step', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ]
      })

      const text = core.getButtonText()

      expect(text.ok).toBe('Далее')
      expect(text.showBack).toBe(false)
    })

    it('should return "Завершить" for last wizard step', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ]
      })

      core.wizard.nextStep()
      const text = core.getButtonText()

      expect(text.ok).toBe('Завершить')
      expect(text.showBack).toBe(true)
      expect(text.back).toBe('Назад')
    })

    it('should use custom wizard text', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ],
        nextText: 'Next',
        backText: 'Previous',
        okText: 'Finish'
      })

      core.wizard.nextStep()
      const text = core.getButtonText()

      expect(text.ok).toBe('Finish')
      expect(text.back).toBe('Previous')
    })
  })

  describe('handleOk', () => {
    it('should execute action immediately for simple action', async () => {
      const action = jest.fn()
      const core = new ActionCore({ action })

      await core.handleOk({ name: 'John' })

      expect(action).toHaveBeenCalled()
    })

    it('should move to next step in wizard', async () => {
      const action = jest.fn()
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ],
        action
      })

      await core.handleOk({ field1: 'value1' })

      expect(core.wizard.getCurrentStepIndex()).toBe(1)
      expect(action).not.toHaveBeenCalled() // Not on last step
    })

    it('should execute action on last wizard step', async () => {
      const action = jest.fn()
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ],
        action
      })

      await core.handleOk({ field1: 'value1' })
      await core.handleOk({ field2: 'value2' })

      expect(action).toHaveBeenCalled()
    })

    it('should save wizard step data', async () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ]
      })

      await core.handleOk({ field1: 'value1' })

      expect(core.wizard.getStepData('step1')).toEqual({ field1: 'value1' })
    })
  })

  describe('handleBack', () => {
    it('should move to previous step in wizard', () => {
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ]
      })

      core.wizard.nextStep()
      core.handleBack()

      expect(core.wizard.getCurrentStepIndex()).toBe(0)
    })

    it('should do nothing for simple action', () => {
      const core = new ActionCore()

      core.handleBack()

      // No error, just no-op
      expect(core.isWizard()).toBe(false)
    })
  })

  describe('executeAction', () => {
    it('should call action with prepared values', async () => {
      const action = jest.fn()
      const core = new ActionCore({ action })

      await core.executeAction({ name: 'John' })

      expect(action).toHaveBeenCalledWith(
        { name: 'John' },
        expect.any(Function), // unlock
        expect.any(Function)  // close
      )
    })

    it('should apply modify function', async () => {
      const action = jest.fn()
      const modify = (values) => ({ ...values, modified: true })
      const core = new ActionCore({ action, modify })

      await core.executeAction({ name: 'John' })

      expect(action).toHaveBeenCalledWith(
        { name: 'John', modified: true },
        expect.any(Function),
        expect.any(Function)
      )
    })

    it('should set loading state during execution', async () => {
      const action = jest.fn((values, unlock) => {
        expect(core.isLoading()).toBe(true)
        unlock()
      })
      const core = new ActionCore({ action })

      await core.executeAction({ name: 'John' })

      expect(core.isLoading()).toBe(false)
    })

    it('should call callback after action', async () => {
      const action = jest.fn((v, unlock) => unlock())
      const callback = jest.fn()
      const core = new ActionCore({ action, callback })

      await core.executeAction({ name: 'John' })

      expect(callback).toHaveBeenCalledWith({ name: 'John' })
    })

    it('should unlock on error', async () => {
      const action = jest.fn(() => {
        throw new Error('Test error')
      })
      const core = new ActionCore({ action })

      await expect(core.executeAction({ name: 'John' })).rejects.toThrow('Test error')

      expect(core.isLoading()).toBe(false)
    })

    it('should reset wizard and form when closed', async () => {
      const action = jest.fn((values, unlock, close) => {
        unlock()
        close()
      })
      const core = new ActionCore({
        steps: [
          { key: 'step1', form: 'Form1' },
          { key: 'step2', form: 'Form2' }
        ],
        object: { name: 'John' },
        action
      })

      core.wizard.nextStep()
      core.form.setFieldValue('name', 'Jane')

      await core.executeAction({ field2: 'value2' })

      expect(core.wizard.getCurrentStepIndex()).toBe(0)
      expect(core.form.isFormChanged()).toBe(false)
    })
  })

  describe('isSubmitDisabled', () => {
    it('should be disabled when loading', () => {
      const core = new ActionCore()

      core.setLoading(true)

      expect(core.isSubmitDisabled()).toBe(true)
    })

    it('should delegate to form.isSubmitDisabled', () => {
      const core = new ActionCore({ disabled: true })

      expect(core.isSubmitDisabled()).toBe(true)
    })
  })

  describe('getRenderProps', () => {
    it('should return all render props', () => {
      const core = new ActionCore({
        form: 'MyForm',
        object: { name: 'John' },
        titles: { header: 'Test' },
        mode: 'modal'
      })

      const props = core.getRenderProps()

      expect(props).toMatchObject({
        currentForm: 'MyForm',
        currentObject: { name: 'John' },
        titles: { header: 'Test' },
        mode: 'modal',
        loading: false,
        isWizard: false,
        readonly: false,
        disabled: false
      })
      expect(props.onOk).toBeInstanceOf(Function)
      expect(props.onClose).toBeInstanceOf(Function)
    })
  })

  describe('updateProps', () => {
    it('should update props', () => {
      const core = new ActionCore({ visible: false })

      core.updateProps({ visible: true })

      expect(core.modal.isOpened()).toBe(true)
    })

    it('should update form initial values', () => {
      const core = new ActionCore({ object: { name: 'John' } })

      core.updateProps({ object: { name: 'Jane' } })

      expect(core.form.initialValues).toEqual({ name: 'Jane' })
    })

    it('should update wizard steps', () => {
      const core = new ActionCore({
        steps: [{ key: 'step1', form: 'Form1' }]
      })

      const newSteps = [
        { key: 'step1', form: 'Form1' },
        { key: 'step2', form: 'Form2' }
      ]
      core.updateProps({ steps: newSteps })

      expect(core.wizard.getTotalSteps()).toBe(2)
    })
  })

  describe('loading callbacks', () => {
    it('should notify loading change', () => {
      const core = new ActionCore()
      const callback = jest.fn()

      core.onLoadingChange(callback)
      core.setLoading(true)

      expect(callback).toHaveBeenCalledWith(true)
    })

    it('should unregister callback', () => {
      const core = new ActionCore()
      const callback = jest.fn()

      const unregister = core.onLoadingChange(callback)
      unregister()
      core.setLoading(true)

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('destroy', () => {
    it('should cleanup all sub-cores', () => {
      const core = new ActionCore()
      const callback = jest.fn()

      core.onLoadingChange(callback)
      core.destroy()

      core.setLoading(true)

      expect(callback).not.toHaveBeenCalled()
    })
  })
})
