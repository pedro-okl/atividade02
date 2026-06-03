import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  children: ReactNode
  confirmLabel: string
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export function Modal({
  children,
  confirmLabel,
  isOpen,
  onClose,
  onConfirm,
  title,
}: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-stone-950/40 p-4 sm:place-items-center">
      <section
        aria-modal="true"
        className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl"
        role="dialog"
      >
        <div className="flex items-start gap-3">
          <h2 className="flex-1 text-lg font-bold text-stone-950">{title}</h2>
          <button
            aria-label="Fechar modal"
            className="grid size-10 place-items-center rounded-md text-stone-500"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-2 text-sm text-stone-600">{children}</div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="danger">
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  )
}
