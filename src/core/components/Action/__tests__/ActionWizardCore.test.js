/**
 * ActionWizardCore Unit Tests
 */

import { ActionWizardCore } from '../ActionWizardCore'

const mockSteps = [
  {
    key: 'step1',
    form: 'Step1Form',
    object: { field1: 'value1' },
    meta: { meta1: 'data1' },
    titles: { header: 'Step 1' },
    options: { opt1: true }
  },
  {
    key: 'step2',
    form: 'Step2Form',
    object: { field2: 'value2' },
    titles: { header: 'Step 2' }
  },
  {
    key: 'step3',
    form: 'Step3Form',
    object: { field3: 'value3' },
    noAntForm: true
  }
]

describe('ActionWizardCore', () => {
  describe('constructor', () => {
    it('should initialize with empty steps', () => {
      const core = new ActionWizardCore()

      expect(core.getTotalSteps()).toBe(0)
      expect(core.getCurrentStepIndex()).toBe(0)
    })

    it('should initialize with steps', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getTotalSteps()).toBe(3)
      expect(core.getCurrentStepIndex()).toBe(0)
    })
  })

  describe('isWizard', () => {
    it('should return false for 0 steps', () => {
      const core = new ActionWizardCore([])

      expect(core.isWizard()).toBe(false)
    })

    it('should return false for 1 step', () => {
      const core = new ActionWizardCore([mockSteps[0]])

      expect(core.isWizard()).toBe(false)
    })

    it('should return true for 2+ steps', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.isWizard()).toBe(true)
    })
  })

  describe('navigation', () => {
    it('should get current step', () => {
      const core = new ActionWizardCore(mockSteps)

      const step = core.getCurrentStep()

      expect(step).toEqual(mockSteps[0])
    })

    it('should get step by index', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getStep(1)).toEqual(mockSteps[1])
      expect(core.getStep(2)).toEqual(mockSteps[2])
    })

    it('should return null for invalid index', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getStep(99)).toBe(null)
      expect(core.getStep(-1)).toBe(null)
    })
  })

  describe('nextStep', () => {
    it('should move to next step', () => {
      const core = new ActionWizardCore(mockSteps)

      const result = core.nextStep()

      expect(result).toBe(true)
      expect(core.getCurrentStepIndex()).toBe(1)
    })

    it('should call onStepChange callback', () => {
      const core = new ActionWizardCore(mockSteps)
      const callback = jest.fn()

      core.onStepChange(callback)
      core.nextStep()

      expect(callback).toHaveBeenCalledWith(1, mockSteps[1])
    })

    it('should not move beyond last step', () => {
      const core = new ActionWizardCore(mockSteps)
      core.goToStep(2) // Last step

      const result = core.nextStep()

      expect(result).toBe(false)
      expect(core.getCurrentStepIndex()).toBe(2)
    })
  })

  describe('prevStep', () => {
    it('should move to previous step', () => {
      const core = new ActionWizardCore(mockSteps)
      core.nextStep()

      const result = core.prevStep()

      expect(result).toBe(true)
      expect(core.getCurrentStepIndex()).toBe(0)
    })

    it('should call onStepChange callback', () => {
      const core = new ActionWizardCore(mockSteps)
      const callback = jest.fn()

      core.nextStep()
      core.onStepChange(callback)
      core.prevStep()

      expect(callback).toHaveBeenCalledWith(0, mockSteps[0])
    })

    it('should not move before first step', () => {
      const core = new ActionWizardCore(mockSteps)

      const result = core.prevStep()

      expect(result).toBe(false)
      expect(core.getCurrentStepIndex()).toBe(0)
    })
  })

  describe('goToStep', () => {
    it('should jump to specific step', () => {
      const core = new ActionWizardCore(mockSteps)

      const result = core.goToStep(2)

      expect(result).toBe(true)
      expect(core.getCurrentStepIndex()).toBe(2)
    })

    it('should return false for invalid index', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.goToStep(-1)).toBe(false)
      expect(core.goToStep(99)).toBe(false)
      expect(core.getCurrentStepIndex()).toBe(0) // Unchanged
    })
  })

  describe('step checks', () => {
    it('should identify first step', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.isFirstStep()).toBe(true)

      core.nextStep()
      expect(core.isFirstStep()).toBe(false)
    })

    it('should identify last step', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.isLastStep()).toBe(false)

      core.goToStep(2)
      expect(core.isLastStep()).toBe(true)
    })
  })

  describe('step data', () => {
    it('should save and retrieve step data', () => {
      const core = new ActionWizardCore(mockSteps)
      const data = { name: 'John', age: 30 }

      core.setStepData('step1', data)

      expect(core.getStepData('step1')).toEqual(data)
    })

    it('should return undefined for non-existent step', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getStepData('nonexistent')).toBeUndefined()
    })

    it('should get all step data', () => {
      const core = new ActionWizardCore(mockSteps)

      core.setStepData('step1', { field1: 'value1' })
      core.setStepData('step2', { field2: 'value2' })

      const allData = core.getAllStepData()

      expect(allData).toEqual({
        step1: { field1: 'value1' },
        step2: { field2: 'value2' }
      })
    })

    it('should clear all step data', () => {
      const core = new ActionWizardCore(mockSteps)

      core.setStepData('step1', { field1: 'value1' })
      core.setStepData('step2', { field2: 'value2' })
      core.clearStepData()

      expect(core.getAllStepData()).toEqual({})
    })
  })

  describe('reset', () => {
    it('should reset to initial state', () => {
      const core = new ActionWizardCore(mockSteps)

      core.nextStep()
      core.nextStep()
      core.setStepData('step1', { data: 'test' })

      core.reset()

      expect(core.getCurrentStepIndex()).toBe(0)
      expect(core.getAllStepData()).toEqual({})
    })

    it('should call onStepChange on reset', () => {
      const core = new ActionWizardCore(mockSteps)
      const callback = jest.fn()

      core.nextStep()
      core.onStepChange(callback)
      core.reset()

      expect(callback).toHaveBeenCalledWith(0, mockSteps[0])
    })
  })

  describe('step properties', () => {
    it('should get current form', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getCurrentForm()).toBe('Step1Form')
    })

    it('should get current object', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getCurrentObject()).toEqual({ field1: 'value1' })
    })

    it('should get current meta', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getCurrentMeta()).toEqual({ meta1: 'data1' })
    })

    it('should get current titles', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getCurrentTitles()).toEqual({ header: 'Step 1' })
    })

    it('should get current options', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getCurrentOptions()).toEqual({ opt1: true })
    })

    it('should return empty object for missing properties', () => {
      const core = new ActionWizardCore(mockSteps)
      core.nextStep() // Step 2 has no meta

      expect(core.getCurrentMeta()).toEqual({})
      expect(core.getCurrentOptions()).toEqual({})
    })
  })

  describe('nested steps', () => {
    it('should detect nested steps', () => {
      const stepsWithNested = [
        {
          key: 'parent',
          form: 'ParentForm',
          steps: [
            { key: 'child1', form: 'Child1Form' },
            { key: 'child2', form: 'Child2Form' }
          ]
        }
      ]
      const core = new ActionWizardCore(stepsWithNested)

      expect(core.hasNestedSteps()).toBe(true)
    })

    it('should return false for no nested steps', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.hasNestedSteps()).toBe(false)
    })

    it('should get nested steps', () => {
      const nestedSteps = [
        { key: 'child1', form: 'Child1Form' },
        { key: 'child2', form: 'Child2Form' }
      ]
      const stepsWithNested = [
        {
          key: 'parent',
          form: 'ParentForm',
          steps: nestedSteps
        }
      ]
      const core = new ActionWizardCore(stepsWithNested)

      expect(core.getNestedSteps()).toEqual(nestedSteps)
    })
  })

  describe('isAntFormEnabled', () => {
    it('should return true by default', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.isAntFormEnabled()).toBe(true)
    })

    it('should return false when noAntForm=true', () => {
      const core = new ActionWizardCore(mockSteps)
      core.goToStep(2) // Step 3 has noAntForm: true

      expect(core.isAntFormEnabled()).toBe(false)
    })
  })

  describe('getNavigationProps', () => {
    it('should return correct navigation props', () => {
      const core = new ActionWizardCore(mockSteps)

      const props = core.getNavigationProps()

      expect(props).toEqual({
        currentStep: 0,
        totalSteps: 3,
        isFirstStep: true,
        isLastStep: false,
        canGoNext: true,
        canGoPrev: false
      })
    })

    it('should update navigation props on step change', () => {
      const core = new ActionWizardCore(mockSteps)

      core.goToStep(1)
      const props = core.getNavigationProps()

      expect(props).toEqual({
        currentStep: 1,
        totalSteps: 3,
        isFirstStep: false,
        isLastStep: false,
        canGoNext: true,
        canGoPrev: true
      })
    })
  })

  describe('getProgress', () => {
    it('should calculate progress percentage', () => {
      const core = new ActionWizardCore(mockSteps)

      expect(core.getProgress()).toBe(33) // 1/3 = 33%

      core.nextStep()
      expect(core.getProgress()).toBe(67) // 2/3 = 67%

      core.nextStep()
      expect(core.getProgress()).toBe(100) // 3/3 = 100%
    })

    it('should return 0 for no steps', () => {
      const core = new ActionWizardCore([])

      expect(core.getProgress()).toBe(0)
    })
  })

  describe('callbacks', () => {
    it('should register and unregister onStepChange', () => {
      const core = new ActionWizardCore(mockSteps)
      const callback = jest.fn()

      const unregister = core.onStepChange(callback)
      core.nextStep()
      expect(callback).toHaveBeenCalledTimes(1)

      unregister()
      core.nextStep()
      expect(callback).toHaveBeenCalledTimes(1) // Not called again
    })
  })

  describe('destroy', () => {
    it('should cleanup callbacks and data', () => {
      const core = new ActionWizardCore(mockSteps)
      const callback = jest.fn()

      core.onStepChange(callback)
      core.setStepData('step1', { data: 'test' })
      core.destroy()

      core.nextStep()

      expect(callback).not.toHaveBeenCalled()
      expect(core.getAllStepData()).toEqual({})
    })
  })
})
