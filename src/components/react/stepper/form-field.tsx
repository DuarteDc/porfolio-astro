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
      <label className='block text-sm font-medium text-zinc-300 mb-2'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full rounded-lg border px-4 py-3 text-zinc-100 placeholder-zinc-600 bg-zinc-900 
          focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all
          ${error ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-600'}`}
        placeholder={placeholder}
      />
      {error && <p className='text-red-400 text-xs mt-2'>{error}</p>}
    </div>
  )
}
