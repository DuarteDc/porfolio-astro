import React from 'react'

interface FormFieldProps {
  label: string
  type?: string
  value: string
  placeholder?: string
  error?: string
  onChange: (value: string) => void
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  value,
  placeholder,
  error,
  onChange
}) => {
  return (
    <div>
      <label className='block text-sm font-medium text-purple-200'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className='w-full rounded-lg bg-purple-900/20 border border-purple-600 px-3 py-2 text-white placeholder-purple-400 
          focus:outline-none focus:ring-2 focus:ring-purple-500'
        placeholder={placeholder}
      />
      {error && <p className='text-red-400 text-xs mt-1'>{error}</p>}
    </div>
  )
}
