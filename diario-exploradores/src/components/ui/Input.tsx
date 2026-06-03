import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  children: ReactNode
  error?: string
  label: string
}

export function Field({ children, error, label }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-stone-800">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-rose-700">{error}</span> : null}
    </label>
  )
}

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 ${className}`}
      {...props}
    />
  )
}

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-32 rounded-lg border border-stone-300 bg-white px-3 py-3 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 ${className}`}
      {...props}
    />
  )
}
