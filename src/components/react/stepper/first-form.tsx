import {
  forwardRef,
  useImperativeHandle,
  type ForwardedRef,
  useState,
  useEffect
} from 'react'
import type { ValidateStep } from 'stepper-ui'

export const FirstForm = forwardRef<ValidateStep>(
  (__, ref: ForwardedRef<ValidateStep>) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

    useEffect(() => {
      const savedData = localStorage.getItem('userData')
      if (savedData) {
        const { name, email } = JSON.parse(savedData)
        setName(name)
        setEmail(email)
      }
    }, [])

    useImperativeHandle(ref, () => ({
      canContinue: () => {
        const newErrors: typeof errors = {}
        if (!name.trim()) newErrors.name = 'Name is required'
        if (!email.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          newErrors.email = 'Invalid email format'

        setErrors(newErrors)
        if (Object.keys(newErrors).length === 0) {
          localStorage.setItem('userData', JSON.stringify({ name, email }))
          return true
        }
        return false
      }
    }))

    return (
      <form className='flex flex-col gap-4'>
        <div>
          <label className='block text-sm font-medium text-purple-200'>
            Name
          </label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full rounded-lg bg-purple-900/20 border border-purple-600 px-3 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500'
            placeholder='Enter your name'
          />
          {errors.name && (
            <p className='text-red-400 text-xs mt-1'>{errors.name}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-purple-200'>
            Email
          </label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full rounded-lg bg-purple-900/20 border border-purple-600 px-3 py-2 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500'
            placeholder='Enter your email'
          />
          {errors.email && (
            <p className='text-red-400 text-xs mt-1'>{errors.email}</p>
          )}
        </div>
      </form>
    )
  }
)
