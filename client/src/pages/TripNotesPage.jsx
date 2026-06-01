import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import NoteList from '../components/notes/NoteList.jsx';
import NoteEditor from '../components/notes/NoteEditor.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';
import * as notesService from '../services/notesService.js';
import * as tripService from '../services/tripService.js';
import { debounce } from '../utils/helpers.js';

export default function TripNotesPage() {
  const { id } = useParams();
  const qc = useQueryClient();
  const tripQ = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.fetchTrip(id),
    enabled: Boolean(id),
  });
  const notesQ = useQuery({
    queryKey: ['notes', id],
    queryFn: () => notesService.fetchNotes(id),
    enabled: Boolean(id),
  });

  const notes = notesQ.data?.notes || [];
  const trip = tripQ.data?.trip;

  const [active, setActive] = useState(null);
  const [content, setContent] = useState('');
  const [stopId, setStopId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!active && notes[0]) {
      setActive(notes[0]);
    }
  }, [notes, active]);

  useEffect(() => {
    if (active) {
      setContent(active.content || '');
      setStopId(active.stopId || null);
    }
  }, [active?._id]);

  const scheduleSave = useMemo(
    () =>
      debounce(async (noteId, payload) => {
        if (!noteId) return;
        setSaving(true);
        try {
          await notesService.updateNote(id, noteId, payload);
          await qc.invalidateQueries({ queryKey: ['notes', id] });
        } finally {
          setSaving(false);
        }
      }, 800),
    [id, qc]
  );

  const handleContent = (v) => {
    setContent(v);
    if (active?._id) scheduleSave(active._id, { content: v, stopId: stopId || null });
  };

  const handleStop = (v) => {
    setStopId(v);
    if (active?._id) scheduleSave(active._id, { content, stopId: v || null });
  };

  const createNote = useMutation({
    mutationFn: () => notesService.createNote(id, { content: '', stopId: null }),
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: ['notes', id] });
      if (data?.note) {
        setActive(data.note);
        setContent('');
        setStopId(null);
      }
      toast.success('New note');
    },
  });

  const deleteNote = useMutation({
    mutationFn: () => notesService.deleteNote(id, active._id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['notes', id] });
      setActive(null);
      setContent('');
      toast.success('Note deleted');
    },
  });

  if (notesQ.isLoading || tripQ.isLoading) return <Loader />;

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trip notes</h1>
          <Button type="button" className="flex items-center gap-2" onClick={() => createNote.mutate()}>
            <Plus className="w-4 h-4" /> New note
          </Button>
        </div>
        {notes.length === 0 ? (
          <p className="text-muted">No notes yet — jot down anything important.</p>
        ) : (
          <NoteList
            notes={notes}
            activeId={active?._id}
            onSelect={(n) => setActive(n)}
          />
        )}
      </div>
      <div className="lg:col-span-3">
        {active ? (
          <NoteEditor
            content={content}
            onChange={handleContent}
            saving={saving}
            stops={trip?.stops}
            stopId={stopId}
            onStopChange={handleStop}
            onDelete={() => deleteNote.mutate()}
          />
        ) : (
          <div className="text-muted">Select or create a note to begin editing.</div>
        )}
      </div>
    </div>
  );
}
