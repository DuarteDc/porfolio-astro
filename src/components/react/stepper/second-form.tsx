import {
  forwardRef,
  useImperativeHandle,
  type ForwardedRef,
  useState,
  useEffect
} from 'react'
import type { ValidateStep } from 'stepper-ui'

export const SecondForm = forwardRef<ValidateStep>(
  (__, ref: ForwardedRef<ValidateStep>) => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<{
      password?: string
      confirmPassword?: string
    }>({})

    useEffect(() => {
      const savedData = localStorage.getItem('userDataPassword')
      if (savedData) {
        const { password } = JSON.parse(savedData)
        setPassword(password)
        setConfirmPassword(password)
      }
    }, [])

    useImperativeHandle(ref, () => ({
      canContinue: () => {
        const newErrors: typeof errors = {}
        if (!password.trim()) newErrors.password = 'Password is required'
        else if (password.length < 6)
          newErrors.password = 'Must be at least 6 characters'
        if (!confirmPassword.trim())
          newErrors.confirmPassword = 'Please confirm your password'
        else if (password !== confirmPassword)
          newErrors.confirmPassword = 'Passwords do not match'

        setErrors(newErrors)
        if (Object.keys(newErrors).length === 0) {
          localStorage.setItem('userDataPassword', JSON.stringify({ password }))
          const userData = JSON.parse(
            localStorage.getItem('userData')!
          ) as Object
          alert(
            `Form submitted successfully! ${JSON.stringify({
              ...userData,
              password
            })}`
          )
          return true
        }
        return false
      }
    }))

    return (
      <form className='flex flex-col gap-4'>
        <div>
          <label className='block text-sm font-medium text-purple-200'>
            Password
          </label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full rounded-lg bg-purple-900/20 border border-purple-600 px-3 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500'
            placeholder='Enter a password'
          />
          {errors.password && (
            <p className='text-red-400 text-xs mt-1'>{errors.password}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-purple-200'>
            Confirm Password
          </label>
          <input
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className='w-full rounded-lg bg-purple-900/20 border border-purple-600 px-3 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500'
            placeholder='Confirm your password'
          />
          {errors.confirmPassword && (
            <p className='text-red-400 text-xs mt-1'>
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </form>
    )
  }
)
