import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';
import CitySearch from '../search/CitySearch.jsx';
import { uploadImage } from '../../services/uploadService.js';

export default function TripForm({ initial, onSubmit, submitting }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [startDate, setStartDate] = useState(
    initial?.startDate ? new Date(initial.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    initial?.endDate ? new Date(initial.endDate) : new Date(Date.now() + 86400000 * 5)
  );
  const [coverPhoto, setCoverPhoto] = useState(initial?.coverPhoto || '');
  const [isPublic, setIsPublic] = useState(Boolean(initial?.isPublic));
  const [destinationCityId, setDestinationCityId] = useState('');
  const [destinationCityName, setDestinationCityName] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const id = setInterval(() => {
      const draft = {
        title,
        description,
        startDate,
        endDate,
        coverPhoto,
        isPublic,
        destinationCityId,
        destinationCityName,
      };
      localStorage.setItem('traveloop-trip-draft', JSON.stringify(draft));
    }, 30000);
    return () => clearInterval(id);
  }, [title, description, startDate, endDate, coverPhoto, isPublic, destinationCityId]);

  useEffect(() => {
    const raw = localStorage.getItem('traveloop-trip-draft');
    if (!initial && raw) {
      try {
        const d = JSON.parse(raw);
        if (d.title) setTitle(d.title);
        if (d.description) setDescription(d.description);
        if (d.startDate) setStartDate(new Date(d.startDate));
        if (d.endDate) setEndDate(new Date(d.endDate));
        if (d.coverPhoto) setCoverPhoto(d.coverPhoto);
        if (typeof d.isPublic === 'boolean') setIsPublic(d.isPublic);
        if (d.destinationCityId) setDestinationCityId(d.destinationCityId);
        if (d.destinationCityName) setDestinationCityName(d.destinationCityName);
      } catch {
        /* ignore */
      }
    }
  }, [initial]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file, 'traveloop/trips');
      setCoverPhoto(url);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Required';
    if (!destinationCityId) nextErrors.destinationCityId = 'Pick a destination city';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({
      title,
      description,
      startDate,
      endDate,
      coverPhoto,
      isPublic,
      destinationCityId,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Input
        label="Trip name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Destination
        </label>
        <button
          type="button"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-left flex justify-between items-center"
          onClick={() => setShowCityModal(true)}
        >
          <span className={destinationCityName ? "text-dark" : "text-slate-400"}>
            {destinationCityName || 'Select a destination city'}
          </span>
        </button>
        {errors.destinationCityId && (
          <p className="text-red-500 text-xs mt-1">{errors.destinationCityId}</p>
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            className="w-full border border-slate-200 rounded-xl px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">End</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            className="w-full border border-slate-200 rounded-xl px-4 py-3"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          rows={4}
          className="w-full border border-slate-200 rounded-xl px-4 py-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Cover photo</label>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 cursor-pointer hover:border-primary transition-colors">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          {coverPhoto ? (
            <img src={coverPhoto} alt="" className="max-h-48 rounded-xl object-cover" />
          ) : (
            <span className="text-muted">Drag & drop or click to upload</span>
          )}
        </label>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-5 h-5 accent-primary"
        />
        <span className="text-sm font-medium text-slate-700">Share with community</span>
      </label>
      <Button type="submit" className="w-full py-3" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save & Continue to Itinerary'}
      </Button>

      <Modal
        open={showCityModal}
        onClose={() => setShowCityModal(false)}
        title="Select Destination"
      >
        <CitySearch
          mode="modal"
          onPickCity={(city) => {
            setDestinationCityId(city._id);
            setDestinationCityName(city.name);
            setShowCityModal(false);
          }}
        />
      </Modal>
    </form>
  );
}
