import { forwardRef, useImperativeHandle, type ForwardedRef } from 'react'
import type { StepperContextProps, ValidateStep } from 'stepper-ui'
import { FormField } from './form-field'
import { usePersistedState } from '../../../hooks/use-persisted-state'
import type { SecondFormData, SecondFormErrors } from './types'

export const SecondForm = forwardRef<ValidateStep, StepperContextProps>(
  ({ goToInitialStep }, ref: ForwardedRef<ValidateStep>) => {
    const [formData, setFormData] = usePersistedState<SecondFormData>(
      'userDataPassword',
      { password: '', confirmPassword: '' }
    )
    const [errors, setErrors] = usePersistedState<SecondFormErrors>(
      'errorsStep2',
      {}
    )

    useImperativeHandle(ref, () => ({
      canContinue: () => {
        const newErrors: SecondFormErrors = {}
        if (!formData.password.trim())
          newErrors.password = 'Password is required'
        else if (formData.password.length < 6)
          newErrors.password = 'Must be at least 6 characters'

        if (!formData.confirmPassword.trim())
          newErrors.confirmPassword = 'Please confirm your password'
        else if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = 'Passwords do not match'

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}')
          alert(
            `Form submitted successfully! ${JSON.stringify({
              ...userData,
              password: formData.password
            })}`
          )
          localStorage.clear()
          goToInitialStep()
          return true
        }
        return false
      }
    }))

    return (
      <form className='flex flex-col gap-4'>
        <FormField
          label='Password'
          type='password'
          value={formData.password}
          onChange={val => setFormData({ ...formData, password: val })}
          placeholder='Enter a password'
          error={errors.password}
        />

        <FormField
          label='Confirm Password'
          type='password'
          value={formData.confirmPassword}
          onChange={val => setFormData({ ...formData, confirmPassword: val })}
          placeholder='Confirm your password'
          error={errors.confirmPassword}
        />
      </form>
    )
  }
)
