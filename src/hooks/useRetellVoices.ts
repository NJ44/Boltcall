import { useState, useEffect } from "react"
import { getVoices } from "../server/api"

export interface RetellVoice {
  voice_id: string
  voice_name: string
  provider: string
  accent?: string
  gender?: string
  age?: string
  preview_audio_url?: string
}

export function useRetellVoices() {
  const [voices, setVoices] = useState<RetellVoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchVoices = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const voicesData = await getVoices()

        if (cancelled) return

        // Map the existing voice shape to RetellVoice interface
        const mapped: RetellVoice[] = voicesData.map((v: any) => ({
          voice_id: v.id,
          voice_name: v.name,
          provider: v.provider || "unknown",
          accent: v.accent || undefined,
          gender: v.gender || undefined,
          age: undefined,
          preview_audio_url: v.preview || undefined,
        }))

        setVoices(mapped)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to fetch voices")
        console.error("Error fetching Retell voices:", err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchVoices()

    return () => {
      cancelled = true
    }
  }, [])

  return { voices, isLoading, error }
}
