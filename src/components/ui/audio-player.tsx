import * as React from "react"

interface AudioItem {
  id: string
  src: string
}

interface AudioPlayerContextValue {
  play: (item: AudioItem) => void
  pause: () => void
  isPlaying: boolean
  isItemActive: (id: string) => boolean
}

const AudioPlayerContext = React.createContext<AudioPlayerContextValue | null>(null)

export function useAudioPlayer() {
  const context = React.useContext(AudioPlayerContext)
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const handleEnded = () => {
      setIsPlaying(false)
      setActiveId(null)
    }

    const handleError = () => {
      setIsPlaying(false)
      setActiveId(null)
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.pause()
      audio.src = ""
    }
  }, [])

  const play = React.useCallback((item: AudioItem) => {
    const audio = audioRef.current
    if (!audio) return

    // If clicking the same item that's playing, toggle pause
    if (activeId === item.id && isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    // Stop any current playback
    audio.pause()
    audio.currentTime = 0

    // Play the new item
    audio.src = item.src
    audio.load()
    setActiveId(item.id)

    audio.oncanplaythrough = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
          setActiveId(null)
        })
    }
  }, [activeId, isPlaying])

  const pause = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setActiveId(null)
  }, [])

  const isItemActive = React.useCallback(
    (id: string) => activeId === id && isPlaying,
    [activeId, isPlaying]
  )

  const value = React.useMemo(
    () => ({ play, pause, isPlaying, isItemActive }),
    [play, pause, isPlaying, isItemActive]
  )

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  )
}
