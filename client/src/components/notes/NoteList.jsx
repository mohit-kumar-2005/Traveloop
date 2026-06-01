import { useEffect, useState } from 'react';
import { Pin } from 'lucide-react';

export default function NoteList({ notes, activeId, onSelect }) {
  return (
    <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
      {(notes || []).map((n) => (
        <button
          key={n._id}
          type="button"
          onClick={() => onSelect(n)}
          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
            activeId === n._id
              ? 'border-primary bg-teal-50 text-primary-dark'
              : 'border-transparent hover:bg-slate-50'
          }`}
        >
          <div className="flex justify-between gap-2 items-start">
            <span className="font-medium line-clamp-2">
              {(n.content || 'Untitled').split('\n')[0]}
            </span>
            <Pin className="w-4 h-4 shrink-0 text-muted" />
          </div>
          <p className="text-xs text-muted mt-1">
            {new Date(n.updatedAt || n.createdAt).toLocaleString()}
          </p>
        </button>
      ))}
    </div>
  );
}
