import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const EMOJIS = [
  '🤖', '👾', '🎙️', '📞', '🏠', '🔧', '⚡', '🌟',
  '💼', '🏥', '🦷', '⚖️', '🛒', '✂️', '🍕', '🏗️',
  '🚗', '🌿', '🔒', '📊', '🐝', '🏋️', '🎯', '🧠',
  '💡', '🛡️', '🦊', '🌊', '🔔', '💎',
];

const COLORS = [
  { hex: '#3B82F6', label: 'Blue' },
  { hex: '#8B5CF6', label: 'Purple' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#EF4444', label: 'Red' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#14B8A6', label: 'Teal' },
  { hex: '#F97316', label: 'Orange' },
  { hex: '#6366F1', label: 'Indigo' },
  { hex: '#64748B', label: 'Slate' },
];

interface EmojiColorPickerProps {
  avatar: string | null | undefined;
  color: string | null | undefined;
  onSave: (avatar: string | null, color: string | null) => void;
  trigger: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export function EmojiColorPicker({ avatar, color, onSave, trigger, align = 'start' }: EmojiColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [draftAvatar, setDraftAvatar] = useState<string | null>(avatar ?? null);
  const [draftColor, setDraftColor] = useState<string | null>(color ?? null);

  function handleOpen(next: boolean) {
    if (next) {
      // Reset drafts to current saved values each time popover opens
      setDraftAvatar(avatar ?? null);
      setDraftColor(color ?? null);
    }
    setOpen(next);
  }

  function handleSave() {
    onSave(draftAvatar, draftColor);
    setOpen(false);
  }

  function handleClear() {
    setDraftAvatar(null);
    setDraftColor(null);
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild onClick={e => e.stopPropagation()}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent align={align} className="w-72 p-4 space-y-4" onClick={e => e.stopPropagation()}>
        {/* Avatar section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Avatar</p>
          <div className="grid grid-cols-10 gap-1">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => setDraftAvatar(emoji === draftAvatar ? null : emoji)}
                className={`w-7 h-7 flex items-center justify-center rounded text-lg hover:bg-gray-100 transition-colors ${
                  draftAvatar === emoji ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Color section */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(({ hex, label }) => (
              <button
                key={hex}
                type="button"
                onClick={() => setDraftColor(hex === draftColor ? null : hex)}
                className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                  draftColor === hex ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                }`}
                style={{ backgroundColor: hex }}
                title={label}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
