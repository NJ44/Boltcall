import * as React from "react"
import { Check, ChevronsUpDown, Volume2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { AudioPlayerProvider, useAudioPlayer } from "@/components/ui/audio-player"
import { Orb } from "@/components/ui/orb"
import type { RetellVoice } from "@/hooks/useRetellVoices"

interface VoicePickerProps {
  voices: RetellVoice[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

function VoicePickerInner({
  voices,
  value,
  onValueChange,
  placeholder = "Select a voice...",
  disabled = false,
  className,
}: VoicePickerProps) {
  const [open, setOpen] = React.useState(false)
  const { play, pause, isItemActive } = useAudioPlayer()

  const selectedVoice = voices.find((v) => v.voice_id === value)

  const handlePreview = (
    e: React.MouseEvent,
    voice: RetellVoice
  ) => {
    e.stopPropagation()
    e.preventDefault()

    if (!voice.preview_audio_url) return

    if (isItemActive(voice.voice_id)) {
      pause()
    } else {
      play({ id: voice.voice_id, src: voice.preview_audio_url })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white transition-colors",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {selectedVoice ? (
            <div className="flex items-center gap-2">
              <Orb size="sm" />
              <span className="font-medium">{selectedVoice.voice_name}</span>
              {selectedVoice.gender && (
                <span className="text-xs text-gray-500 capitalize">
                  {selectedVoice.gender}
                </span>
              )}
              {selectedVoice.accent && (
                <span className="text-xs text-gray-400">
                  {selectedVoice.accent}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search voices..." />
          <CommandList>
            <CommandEmpty>No voices found.</CommandEmpty>
            <CommandGroup>
              {voices.map((voice) => {
                const isActive = isItemActive(voice.voice_id)
                return (
                  <CommandItem
                    key={voice.voice_id}
                    value={`${voice.voice_name} ${voice.accent || ""} ${voice.gender || ""} ${voice.provider}`}
                    onSelect={() => {
                      onValueChange?.(voice.voice_id)
                      setOpen(false)
                      pause()
                    }}
                    className="flex items-center gap-3 py-2.5 px-2 cursor-pointer"
                  >
                    {/* Preview orb */}
                    <button
                      type="button"
                      className={cn(
                        "flex-shrink-0 rounded-full p-1 transition-colors",
                        voice.preview_audio_url
                          ? "hover:bg-blue-50 cursor-pointer"
                          : "opacity-30 cursor-default"
                      )}
                      onClick={(e) => handlePreview(e, voice)}
                      onMouseEnter={(e) => {
                        if (voice.preview_audio_url && !isActive) {
                          handlePreview(e, voice)
                        }
                      }}
                      tabIndex={-1}
                    >
                      {isActive ? (
                        <Orb size="sm" agentState="talking" />
                      ) : (
                        <Volume2 className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {/* Voice info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">
                          {voice.voice_name}
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          {voice.provider}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {voice.gender && (
                          <span className="text-xs text-gray-500 capitalize">
                            {voice.gender}
                          </span>
                        )}
                        {voice.gender && voice.accent && (
                          <span className="text-xs text-gray-300">|</span>
                        )}
                        {voice.accent && (
                          <span className="text-xs text-gray-500">
                            {voice.accent}
                          </span>
                        )}
                        {voice.age && (
                          <>
                            <span className="text-xs text-gray-300">|</span>
                            <span className="text-xs text-gray-500 capitalize">
                              {voice.age}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Check mark for selected */}
                    <Check
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        value === voice.voice_id
                          ? "opacity-100 text-blue-600"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function VoicePicker(props: VoicePickerProps) {
  return (
    <AudioPlayerProvider>
      <VoicePickerInner {...props} />
    </AudioPlayerProvider>
  )
}

export type { VoicePickerProps, RetellVoice }
