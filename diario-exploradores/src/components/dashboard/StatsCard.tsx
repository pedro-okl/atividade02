import type { ReactNode } from 'react'

interface StatsCardProps {
  children?: ReactNode
  label: string
  value: string | number
}

export function StatsCard({ children, label, value }: StatsCardProps) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</p>
      <strong className="mt-2 block text-3xl font-black text-stone-950">{value}</strong>
      {children ? <div className="mt-3">{children}</div> : null}
    </section>
  )
}
