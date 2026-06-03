/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useReducer,
} from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

type ToastAction =
  | { type: 'add'; toast: Toast }
  | { type: 'remove'; id: string }

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

function toastReducer(state: Toast[], action: ToastAction) {
  switch (action.type) {
    case 'add':
      return [...state, action.toast]
    case 'remove':
      return state.filter((toast) => toast.id !== action.id)
    default:
      return state
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
    dispatch({ type: 'add', toast: { id, message, type } })
    window.setTimeout(() => dispatch({ type: 'remove', id }), 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed inset-x-0 bottom-24 z-50 mx-auto flex w-full max-w-md flex-col gap-2 px-4">
        {toasts.map((toast) => {
          const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info
          return (
            <div
              className="flex min-h-12 items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-800 shadow-lg"
              key={toast.id}
            >
              <Icon
                aria-hidden="true"
                className={
                  toast.type === 'success'
                    ? 'size-5 text-emerald-700'
                    : toast.type === 'error'
                      ? 'size-5 text-rose-700'
                      : 'size-5 text-sky-700'
                }
              />
              <span className="min-w-0 flex-1">{toast.message}</span>
              <button
                aria-label="Fechar aviso"
                className="grid size-9 place-items-center rounded-md text-stone-500"
                onClick={() => dispatch({ type: 'remove', id: toast.id })}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
