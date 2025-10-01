import { forwardRef, useImperativeHandle, type ForwardedRef } from 'react'
import type { ValidateStep } from 'stepper-ui'
import { usePersistedState } from '../../../hooks/use-persisted-state'
import { FormField } from './form-field'
import type { FirstFormData, FirstFormErrors } from './types'

export const FirstForm = forwardRef<ValidateStep>(
  (_, ref: ForwardedRef<ValidateStep>) => {
    const [formData, setFormData] = usePersistedState<FirstFormData>(
      'userData',
      {
        name: '',
        email: ''
      }
    )
    const [errors, setErrors] = usePersistedState<FirstFormErrors>(
      'errorsStep1',
      {}
    )

    useImperativeHandle(ref, () => ({
      canContinue: () => {
        const newErrors: FirstFormErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          newErrors.email = 'Invalid email format'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }
    }))

    return (
      <form className='flex flex-col gap-4'>
        <FormField
          label='Name'
          value={formData.name}
          onChange={val => setFormData({ ...formData, name: val })}
          placeholder='Enter your name'
          error={errors.name}
        />

        <FormField
          label='Email'
          type='email'
          value={formData.email}
          onChange={val => setFormData({ ...formData, email: val })}
          placeholder='Enter your email'
          error={errors.email}
        />
      </form>
    )
  }
)
