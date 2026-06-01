import { useEffect, useMemo, useRef, useState } from 'react';

export default function NoteEditor({
  content,
  onChange,
  saving,
  onDelete,
  stops,
  stopId,
  onStopChange,
}) {
  const ref = useRef(null);

  const wrap = (prefix, suffix = prefix) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = content.slice(start, end);
    const next =
      content.slice(0, start) + prefix + sel + suffix + content.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  };

  return (
    <div className="flex flex-col h-full min-h-[360px] border border-slate-200 rounded-2xl bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 items-center px-3 py-2 border-b border-slate-100">
        <button
          type="button"
          className="text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-100"
          onClick={() => wrap('**', '**')}
        >
          Bold
        </button>
        <button
          type="button"
          className="text-xs italic px-3 py-2 rounded-lg hover:bg-slate-100"
          onClick={() => wrap('*')}
        >
          Italic
        </button>
        <button
          type="button"
          className="text-xs px-3 py-2 rounded-lg hover:bg-slate-100"
          onClick={() => {
            const ta = ref.current;
            if (!ta) return;
            const pos = ta.selectionStart;
            const lineStart = content.lastIndexOf('\n', pos - 1) + 1;
            const next = `${content.slice(0, lineStart)}• ${content.slice(lineStart)}`;
            onChange(next);
          }}
        >
          Bullet
        </button>
        <div className="ml-auto flex flex-wrap gap-2 items-center">
          <select
            className="text-sm border rounded-lg px-2 py-1"
            value={stopId || ''}
            onChange={(e) => onStopChange(e.target.value || null)}
          >
            <option value="">Whole trip</option>
            {(stops || []).map((s) => (
              <option key={s._id} value={s._id}>
                {s.cityName}
              </option>
            ))}
          </select>
          <button type="button" className="text-sm text-error px-2" onClick={onDelete}>
            Delete note
          </button>
          <span className="text-xs text-muted">{saving ? 'Saving…' : 'Saved'}</span>
        </div>
      </div>
      <textarea
        ref={ref}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full resize-none outline-none px-4 py-3 text-sm leading-relaxed min-h-[280px]"
        placeholder="Jot reservations, reminders, or inspiration..."
      />
    </div>
  );
}
