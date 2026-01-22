import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Layout from './components/layout/Layout';
import Home from './pages/Beranda';
import News from './pages/Berita';
import Gallery from './pages/Galeri';
import ProfileKelurahan from './pages/ProfileKelurahan';
import Pemerintahan from './pages/Pemerintahan';
import Infografis from './pages/Infografis';
import LoginAdmin from './pages/admin/Login';
import DashboardAdmin from './pages/admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

type Instrument = {
  id?: string;
  name: string;
};

type InstrumentsListProps = {
  instruments: Instrument[];
  loading: boolean;
  error: string | null;
};

// Initialize Supabase client only if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function InstrumentsList({ instruments, loading, error }: InstrumentsListProps) {
  if (loading) return <p>Loading instruments...</p>;
  if (error) return <p>Failed to load instruments: {error}</p>;
  if (!instruments.length) return <p>No instruments found.</p>;

  return (
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.id ?? instrument.name}>{instrument.name}</li>
      ))}
    </ul>
  );
}

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loadingInstruments, setLoadingInstruments] = useState(false);
  const [instrumentsError, setInstrumentsError] = useState<string | null>(null);

  useEffect(() => {
    // Skip if Supabase is not configured
    if (!supabase) {
      console.warn('Supabase not configured. Skipping instruments fetch.');
      return;
    }

    let ignore = false;

    const loadInstruments = async () => {
      try {
        setLoadingInstruments(true);
        const { data, error } = await supabase.from("instruments").select();

        if (ignore) return;
        if (error) {
          console.error('Supabase fetch error:', error);
          setInstrumentsError(error.message);
          setInstruments([]);
        } else {
          setInstruments(data ?? []);
          setInstrumentsError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Unexpected error loading instruments:', err);
          setInstrumentsError(err instanceof Error ? err.message : 'Unknown error');
          setInstruments([]);
        }
      } finally {
        if (!ignore) {
          setLoadingInstruments(false);
        }
      }
    };

    loadInstruments();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/profil" element={<About />} /> */}
          <Route path="/profil-kelurahan" element={<ProfileKelurahan />} />
          <Route path="/pemerintahan" element={<Pemerintahan />} />
          <Route path="/infografis" element={<Infografis />} />
          <Route path="/berita" element={<News />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route
            path="/_debug/instruments"
            element={
              <InstrumentsList
                instruments={instruments}
                loading={loadingInstruments}
                error={instrumentsError}
              />
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
