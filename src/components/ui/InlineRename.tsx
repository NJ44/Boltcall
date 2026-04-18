import React, { useState, useRef, useEffect } from 'react';

interface InlineRenameProps {
  value: string;
  onSave: (newName: string) => void;
  className?: string;
  inputClassName?: string;
  maxLength?: number;
}

export function InlineRename({
  value,
  onSave,
  className = '',
  inputClassName = '',
  maxLength = 80,
}: InlineRenameProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep draft in sync if parent value changes while not editing
  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    }
    setEditing(false);
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { e.preventDefault(); cancel(); }
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        maxLength={maxLength}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()}
        className={`bg-transparent border-b border-blue-500 outline-none font-medium min-w-0 ${inputClassName}`}
        style={{ width: `${Math.max(draft.length, 4)}ch` }}
      />
    );
  }

  return (
    <span
      onClick={startEdit}
      title="Click to rename"
      className={`cursor-text hover:underline decoration-dotted underline-offset-2 truncate ${className}`}
    >
      {value}
    </span>
  );
}
