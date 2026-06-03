import { useCallback } from 'react'

const MAX_PHOTOS = 3

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function useCamera() {
  const convertFilesToPhotos = useCallback(
    async (files: FileList | File[], currentPhotos: string[]) => {
      const availableSlots = MAX_PHOTOS - currentPhotos.length
      const selectedFiles = Array.from(files).slice(0, Math.max(0, availableSlots))

      if (availableSlots <= 0) {
        return {
          photos: currentPhotos,
          rejected: Array.from(files).length,
        }
      }

      const encoded = await Promise.all(selectedFiles.map(readFileAsDataUrl))

      return {
        photos: [...currentPhotos, ...encoded],
        rejected: Math.max(0, Array.from(files).length - availableSlots),
      }
    },
    [],
  )

  return { convertFilesToPhotos, maxPhotos: MAX_PHOTOS }
}
