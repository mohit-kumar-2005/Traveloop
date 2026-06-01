import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import Card from '../components/common/Card.jsx';
import Avatar from '../components/common/Avatar.jsx';
import Modal from '../components/common/Modal.jsx';
import * as userService from '../services/userService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const qc = useQueryClient();
  const profileQ = useQuery({
    queryKey: ['profile'],
    queryFn: userService.fetchProfile,
  });

  const u = profileQ.data?.user || user;
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: '',
    country: '',
    language: 'en',
  });
  const [privacy, setPrivacy] = useState(true);
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [delEmail, setDelEmail] = useState('');
  const [delOpen, setDelOpen] = useState(false);

  useEffect(() => {
    if (!u) return;
    setForm({
      name: u.name || '',
      phone: u.phone || '',
      city: u.city || '',
      country: u.country || '',
      language: u.language || 'en',
    });
    setPrivacy(u.isProfilePublic !== false);
  }, [u]);

  const saveProfile = useMutation({
    mutationFn: () =>
      userService.updateProfile({
        ...form,
        isProfilePublic: privacy,
      }),
    onSuccess: async () => {
      toast.success('Profile saved');
      await refreshUser();
      qc.invalidateQueries({ queryKey: ['profile'] });
      setEdit(false);
    },
    onError: (e) => toast.error(e.friendlyMessage || 'Save failed'),
  });

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('photo', file);
    await userService.uploadProfilePhoto(fd);
    await refreshUser();
    qc.invalidateQueries({ queryKey: ['profile'] });
    toast.success('Photo updated');
  };

  const changePwd = useMutation({
    mutationFn: () =>
      userService.changePassword({
        currentPassword: pwd.current,
        newPassword: pwd.next,
      }),
    onSuccess: () => {
      toast.success('Password updated');
      setPwd({ current: '', next: '', confirm: '' });
    },
    onError: (e) => toast.error(e.friendlyMessage || 'Could not update password'),
  });

  const deleteAccount = useMutation({
    mutationFn: () => userService.deleteAccount(),
    onSuccess: async () => {
      toast.success('Account deleted');
      await logout();
    },
  });

  const submitPassword = () => {
    if (pwd.next !== pwd.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    changePwd.mutate();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

      <Card className="p-8 flex flex-col sm:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-3">
          <Avatar src={u?.photo} name={u?.name} size="lg" />
          <label className="text-sm font-semibold text-primary-dark cursor-pointer">
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={upload} />
          </label>
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">Personal info</h2>
            <button type="button" className="text-sm text-primary-dark font-medium" onClick={() => setEdit(!edit)}>
              {edit ? 'Cancel' : 'Edit profile'}
            </button>
          </div>
          <Input
            label="Name"
            value={form.name}
            disabled={!edit}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input label="Email" value={u?.email || ''} disabled />
          <Input
            label="Phone"
            value={form.phone}
            disabled={!edit}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="City"
              value={form.city}
              disabled={!edit}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
            <Input
              label="Country"
              value={form.country}
              disabled={!edit}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
            <select
              className="w-full border rounded-xl px-4 py-3"
              disabled={!edit}
              value={form.language}
              onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={privacy}
              disabled={!edit}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-sm text-slate-700">Make profile public</span>
          </label>
          {edit && (
            <Button type="button" onClick={() => saveProfile.mutate()}>
              Save changes
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-8 space-y-4">
        <h2 className="font-semibold text-lg">Saved destinations</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(u?.savedDestinations || []).map((c) => (
            <span key={c._id} className="px-3 py-1 rounded-full bg-teal-50 text-sm whitespace-nowrap">
              {c.name}
            </span>
          ))}
          {!(u?.savedDestinations || []).length && (
            <p className="text-sm text-muted">Save cities from Explore to see them here.</p>
          )}
        </div>
      </Card>

      <Card className="p-8 space-y-4">
        <h2 className="font-semibold text-lg">Change password</h2>
        <Input
          type="password"
          label="Current password"
          value={pwd.current}
          onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
        />
        <Input
          type="password"
          label="New password"
          value={pwd.next}
          onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
        />
        <Input
          type="password"
          label="Confirm new password"
          value={pwd.confirm}
          onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
        />
        <Button type="button" variant="outline" onClick={submitPassword}>
          Update password
        </Button>
      </Card>

      <Card className="p-8 border border-red-100 space-y-4">
        <h2 className="font-semibold text-lg text-error">Danger zone</h2>
        <Button variant="danger" type="button" onClick={() => setDelOpen(true)}>
          Delete account
        </Button>
      </Card>

      <Modal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="Delete account?"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDelOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={delEmail !== u?.email}
              onClick={() => deleteAccount.mutate()}
            >
              Delete permanently
            </Button>
          </div>
        }
      >
        <p className="mb-3 text-sm text-slate-600">
          Type your email <strong>{u?.email}</strong> to confirm.
        </p>
        <Input value={delEmail} onChange={(e) => setDelEmail(e.target.value)} />
      </Modal>
    </motion.div>
  );
}
