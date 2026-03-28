import { describe, it, expect, beforeEach } from 'vitest'
import { useSetupStore } from '../setupStore'

describe('setupStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useSetupStore.getState().reset()
  })

  it('has correct initial state', () => {
    const state = useSetupStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.isCompleted).toBe(false)
    expect(state.completedSteps).toEqual([])
    expect(state.account.fullName).toBe('')
    expect(state.businessProfile.businessName).toBe('')
    expect(state.calendar.isConnected).toBe(false)
    expect(state.knowledgeBase.services).toEqual([])
    expect(state.callFlow.tone).toBe('friendly_concise')
    expect(state.agentConfig.agentType).toBe('inbound')
    expect(state.review.isEnabled).toBe(false)
  })

  describe('updateBusinessProfile', () => {
    it('updates partial business profile data', () => {
      useSetupStore.getState().updateBusinessProfile({
        businessName: 'Test Corp',
        mainCategory: 'technology',
      })

      const state = useSetupStore.getState()
      expect(state.businessProfile.businessName).toBe('Test Corp')
      expect(state.businessProfile.mainCategory).toBe('technology')
      // Other fields remain at defaults
      expect(state.businessProfile.websiteUrl).toBe('')
      expect(state.businessProfile.languages).toBe('en')
    })

    it('merges with existing data', () => {
      useSetupStore.getState().updateBusinessProfile({ businessName: 'First' })
      useSetupStore.getState().updateBusinessProfile({ websiteUrl: 'https://example.com' })

      const state = useSetupStore.getState()
      expect(state.businessProfile.businessName).toBe('First')
      expect(state.businessProfile.websiteUrl).toBe('https://example.com')
    })
  })

  describe('markStepCompleted', () => {
    it('adds a step to completedSteps', () => {
      useSetupStore.getState().markStepCompleted(1)
      expect(useSetupStore.getState().completedSteps).toEqual([1])
    })

    it('does not duplicate steps', () => {
      useSetupStore.getState().markStepCompleted(1)
      useSetupStore.getState().markStepCompleted(1)
      expect(useSetupStore.getState().completedSteps).toEqual([1])
    })

    it('tracks multiple steps', () => {
      useSetupStore.getState().markStepCompleted(1)
      useSetupStore.getState().markStepCompleted(3)
      expect(useSetupStore.getState().completedSteps).toContain(1)
      expect(useSetupStore.getState().completedSteps).toContain(3)
      expect(useSetupStore.getState().completedSteps).toHaveLength(2)
    })
  })

  describe('complete', () => {
    it('sets isCompleted to true', () => {
      useSetupStore.getState().complete()
      expect(useSetupStore.getState().isCompleted).toBe(true)
    })
  })

  describe('reset', () => {
    it('resets all state to defaults', () => {
      // Modify state first
      useSetupStore.getState().updateBusinessProfile({ businessName: 'Modified' })
      useSetupStore.getState().markStepCompleted(1)
      useSetupStore.getState().complete()
      useSetupStore.getState().updateStep(5)

      // Reset
      useSetupStore.getState().reset()

      const state = useSetupStore.getState()
      expect(state.currentStep).toBe(1)
      expect(state.isCompleted).toBe(false)
      expect(state.completedSteps).toEqual([])
      expect(state.businessProfile.businessName).toBe('')
    })
  })

  describe('updateStep', () => {
    it('updates the current step', () => {
      useSetupStore.getState().updateStep(3)
      expect(useSetupStore.getState().currentStep).toBe(3)
    })
  })

  describe('updateAccount', () => {
    it('updates account data', () => {
      useSetupStore.getState().updateAccount({
        fullName: 'John Doe',
        workEmail: 'john@example.com',
      })

      const state = useSetupStore.getState()
      expect(state.account.fullName).toBe('John Doe')
      expect(state.account.workEmail).toBe('john@example.com')
    })
  })
})
