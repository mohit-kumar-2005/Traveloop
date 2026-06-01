import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Loader from './components/common/Loader.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CreateTripPage = lazy(() => import('./pages/CreateTripPage.jsx'));
const MyTripsPage = lazy(() => import('./pages/MyTripsPage.jsx'));
const ItineraryBuilderPage = lazy(() => import('./pages/ItineraryBuilderPage.jsx'));
const ItineraryViewPage = lazy(() => import('./pages/ItineraryViewPage.jsx'));
const CitySearchPage = lazy(() => import('./pages/CitySearchPage.jsx'));
const ActivitySearchPage = lazy(() => import('./pages/ActivitySearchPage.jsx'));
const BudgetPage = lazy(() => import('./pages/BudgetPage.jsx'));
const PackingChecklistPage = lazy(() => import('./pages/PackingChecklistPage.jsx'));
const CommunityPage = lazy(() => import('./pages/CommunityPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const TripNotesPage = lazy(() => import('./pages/TripNotesPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'));
const PublicItineraryPage = lazy(() => import('./pages/PublicItineraryPage.jsx'));
const MainLayout = lazy(() => import('./components/layout/MainLayout.jsx'));

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

function CatchAllRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/" replace />;
}

function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AdminGate() {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/share/:slug" element={<PublicItineraryPage />} />

        <Route path="/" element={<HomeRoute />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trips/new" element={<CreateTripPage />} />
            <Route path="/trips" element={<MyTripsPage />} />
            <Route path="/trips/:id/builder" element={<ItineraryBuilderPage />} />
            <Route path="/trips/:id/view" element={<ItineraryViewPage />} />
            <Route path="/trips/:id/budget" element={<BudgetPage />} />
            <Route path="/trips/:id/checklist" element={<PackingChecklistPage />} />
            <Route path="/trips/:id/notes" element={<TripNotesPage />} />
            <Route path="/cities" element={<CitySearchPage />} />
            <Route path="/activities" element={<ActivitySearchPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<AdminGate />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<CatchAllRoute />} />
      </Routes>
    </Suspense>
  );
}
