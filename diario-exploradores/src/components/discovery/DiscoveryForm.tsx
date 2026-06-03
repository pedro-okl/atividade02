import { type FormEvent, useRef, useState } from 'react'
import { Camera, Save, Trash2 } from 'lucide-react'
import type { Discovery, DiscoveryCategory, RarityLevel } from '../../types'
import { DISCOVERY_CATEGORIES, RARITY_LEVELS } from '../../types'
import { useCamera } from '../../hooks/useCamera'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { Field, Input, Textarea } from '../ui/Input'

interface DiscoveryFormProps {
  initialValue?: Discovery
  onSubmit: (input: {
    title: string
    description: string
    category: DiscoveryCategory
    rarity: RarityLevel
    photos: string[]
  }) => Promise<void>
  submitLabel?: string
}

interface FormErrors {
  description?: string
  title?: string
}

export function DiscoveryForm({
  initialValue,
  onSubmit,
  submitLabel = 'Salvar descoberta',
}: DiscoveryFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? '')
  const [description, setDescription] = useState(initialValue?.description ?? '')
  const [category, setCategory] = useState<DiscoveryCategory>(
    initialValue?.category ?? 'Botânica',
  )
  const [rarity, setRarity] = useState<RarityLevel>(initialValue?.rarity ?? 'Comum')
  const [photos, setPhotos] = useState<string[]>(initialValue?.photos ?? [])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { convertFilesToPhotos, maxPhotos } = useCamera()
  const { showToast } = useToast()

  function validate() {
    const nextErrors: FormErrors = {}

    if (!title.trim()) {
      nextErrors.title = 'Informe um título.'
    }

    if (!description.trim()) {
      nextErrors.description = 'Descreva a descoberta.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handlePhotoChange(files: FileList | null) {
    if (!files?.length) {
      return
    }

    try {
      const result = await convertFilesToPhotos(files, photos)
      setPhotos(result.photos)

      if (result.rejected > 0) {
        showToast('O limite é de 3 fotos por descoberta.', 'info')
      }
    } catch {
      showToast('Não foi possível carregar a foto.', 'error')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setIsSaving(true)

    try {
      await onSubmit({ title, description, category, rarity, photos })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <Field error={errors.title} label="Título">
        <Input
          maxLength={80}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex: Orquídea de encosta úmida"
          value={title}
        />
      </Field>

      <Field error={errors.description} label="Descrição">
        <Textarea
          maxLength={800}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Registre aparência, localização, comportamento ou composição."
          value={description}
        />
      </Field>

      <Field label="Categoria">
        <select
          className="min-h-11 rounded-lg border border-stone-300 bg-white px-3 text-base text-stone-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
          onChange={(event) => setCategory(event.target.value as DiscoveryCategory)}
          value={category}
        >
          {DISCOVERY_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-semibold text-stone-800">Raridade</legend>
        <div className="grid grid-cols-3 gap-2">
          {RARITY_LEVELS.map((item) => (
            <label
              className={`grid min-h-11 place-items-center rounded-lg border px-2 text-center text-sm font-bold ${
                rarity === item
                  ? 'border-emerald-700 bg-emerald-800 text-white'
                  : 'border-stone-300 bg-white text-stone-700'
              }`}
              key={item}
            >
              <input
                checked={rarity === item}
                className="sr-only"
                name="rarity"
                onChange={() => setRarity(item)}
                type="radio"
                value={item}
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <section className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-800">Fotos</h2>
            <p className="text-xs font-medium text-stone-500">
              {photos.length}/{maxPhotos} imagens registradas
            </p>
          </div>
          <Button
            disabled={photos.length >= maxPhotos}
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
          >
            <Camera className="size-4" />
            Tirar foto
          </Button>
          <input
            accept="image/*"
            capture="environment"
            className="hidden"
            multiple
            onChange={(event) => void handlePhotoChange(event.target.files)}
            ref={fileInputRef}
            type="file"
          />
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100" key={photo}>
                <img
                  alt={`Foto ${index + 1} da descoberta`}
                  className="h-full w-full object-cover"
                  src={photo}
                />
                <button
                  aria-label={`Remover foto ${index + 1}`}
                  className="absolute right-1 top-1 grid size-9 place-items-center rounded-md bg-white/90 text-rose-700 shadow"
                  onClick={() => setPhotos((current) => current.filter((_, item) => item !== index))}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <Button className="w-full" disabled={isSaving} type="submit">
        <Save className="size-4" />
        {isSaving ? 'Salvando...' : submitLabel}
      </Button>
    </form>
  )
}
