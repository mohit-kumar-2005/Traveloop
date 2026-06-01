import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Loader from '../components/common/Loader.jsx';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import * as adminService from '../services/adminService.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const COLORS = ['#2DD4BF', '#0F9488', '#F59E0B'];

export default function AdminDashboardPage() {
  const qc = useQueryClient();
  const statsQ = useQuery({ queryKey: ['admin-stats'], queryFn: adminService.fetchAdminStats });
  const usersQ = useQuery({ queryKey: ['admin-users'], queryFn: adminService.fetchAdminUsers });
  const tripsMonthQ = useQuery({
    queryKey: ['admin-trips-month'],
    queryFn: adminService.fetchTripsPerMonth,
  });
  const statusQ = useQuery({
    queryKey: ['admin-trip-status'],
    queryFn: adminService.fetchTripStatusDistribution,
  });
  const signupsQ = useQuery({
    queryKey: ['admin-signups'],
    queryFn: adminService.fetchSignupsOverTime,
  });
  const citiesQ = useQuery({
    queryKey: ['admin-pop-cities'],
    queryFn: adminService.fetchAdminPopularCities,
  });
  const actsQ = useQuery({
    queryKey: ['admin-pop-activities'],
    queryFn: adminService.fetchAdminPopularActivities,
  });

  const promote = useMutation({
    mutationFn: adminService.promoteAdminUser,
    onSuccess: () => {
      toast.success('User promoted');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const removeUser = useMutation({
    mutationFn: adminService.deleteAdminUser,
    onSuccess: () => {
      toast.success('User deleted');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  if (statsQ.isLoading) return <Loader />;

  const stats = statsQ.data?.stats;
  const tripSeries = Object.entries(tripsMonthQ.data?.series || {}).map(([month, count]) => ({
    month,
    count,
  }));
  const pieData = statusQ.data
    ? [
        { name: 'Upcoming', value: statusQ.data.distribution.upcoming },
        { name: 'Ongoing', value: statusQ.data.distribution.ongoing },
        { name: 'Completed', value: statusQ.data.distribution.completed },
      ]
    : [];
  const signupSeries = Object.entries(signupsQ.data?.series || {}).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total users', value: stats?.totalUsers },
          { label: 'Total trips', value: stats?.totalTrips },
          { label: 'Trips this month', value: stats?.tripsThisMonth },
          { label: 'Active now', value: stats?.activeNow },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="text-3xl font-bold mt-2">{c.value ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold mb-4">Trips created (12 mo)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2DD4BF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold mb-4">Trip status distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 lg:col-span-2">
          <h2 className="font-bold mb-4">User signups</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" hide />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#0F9488" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Trips</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(usersQ.data?.users || []).map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Avatar src={u.photo} name={u.name} />
                    {u.name}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{u.tripsCount}</td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                    {u.role !== 'admin' && (
                      <>
                        <Button type="button" variant="outline" className="py-1 px-2 text-xs" onClick={() => promote.mutate(u._id)}>
                          Promote
                        </Button>
                        <Button type="button" variant="danger" className="py-1 px-2 text-xs" onClick={() => removeUser.mutate(u._id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold mb-4">Top cities</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={(citiesQ.data?.cities || []).map((c) => ({
                  name: c.name,
                  popularity: c.popularity,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="popularity" fill="#2DD4BF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold mb-4">Popular activities</h2>
          <ul className="divide-y divide-slate-100 max-h-72 overflow-y-auto text-sm">
            {(actsQ.data?.activities || []).map((a) => (
              <li key={a._id} className="py-2 flex justify-between gap-2">
                <span>{a.name}</span>
                <span className="text-muted">★ {a.rating}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
