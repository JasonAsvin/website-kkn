import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Beranda';
import Gallery from './pages/Galeri';
import ProfileKelurahan from './pages/ProfileKelurahan';
import Pemerintahan from './pages/Pemerintahan';
import Infografis from './pages/Infografis';
import LoginAdmin from './pages/admin/Login';
import DashboardAdmin from './pages/admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ManajemenPenduduk from './pages/admin/ManajemenPenduduk';
import EditPenduduk from './pages/admin/EditPenduduk';
import ManajemenGaleri from './pages/admin/ManajemenGaleri';
import TambahGaleri from './pages/admin/TambahGaleri';
import EditGaleri from './pages/admin/EditGaleri';
import ManajemenFasilitas from './pages/admin/ManajemenFasilitas';
import TambahFasilitas from './pages/admin/TambahFasilitas';
import ManajemenStruktur from './pages/admin/ManajemenStruktur';
import TambahStruktur from './pages/admin/TambahStruktur';
import ManajemenWilayah from './pages/admin/ManajemenWilayah';
import TambahWilayah from './pages/admin/TambahWilayah';
import ManajemenAset from './pages/admin/ManajemenAset';
import ManajemenKontenWeb from './pages/admin/ManajemenKontenWeb';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil-kelurahan" element={<ProfileKelurahan />} />
          <Route path="/pemerintahan" element={<Pemerintahan />} />
          <Route path="/infografis" element={<Infografis />} />
          <Route path="/galeri" element={<Gallery />} />
        </Route>

        {/* Admin Login Routes */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} 
        />
        {/* Manajemen Penduduk */}
        <Route 
          path="/admin/manajemen-penduduk" 
          element={<ProtectedRoute><ManajemenPenduduk /></ProtectedRoute>} 
        />

        <Route
          path="/admin/edit-penduduk/:id"
          element={<ProtectedRoute><EditPenduduk /></ProtectedRoute>}
        />

        {/* Manajemen Galeri */}
        <Route 
          path="/admin/manajemen-galeri" 
          element={<ProtectedRoute><ManajemenGaleri /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/tambah-galeri" 
          element={<ProtectedRoute><TambahGaleri /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/edit-galeri/:id" 
          element={<ProtectedRoute><EditGaleri /></ProtectedRoute>} 
        />

        {/* Manajemen Fasilitas */}
        <Route 
          path="/admin/manajemen-fasilitas" 
          element={<ProtectedRoute><ManajemenFasilitas /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/tambah-fasilitas" 
          element={<ProtectedRoute><TambahFasilitas /></ProtectedRoute>} 
        />

        {/* Manajemen Wilayah Administratif */}
        <Route 
          path="/admin/manajemen-wilayah" 
          element={<ProtectedRoute><ManajemenWilayah /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/tambah-wilayah" 
          element={<ProtectedRoute><TambahWilayah /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/edit-wilayah/:id" 
          element={<ProtectedRoute><TambahWilayah /></ProtectedRoute>} 
        />

        {/* Manajemen Struktur Organisasi */}
        <Route 
          path="/admin/manajemen-struktur" 
          element={<ProtectedRoute><ManajemenStruktur /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/tambah-struktur" 
          element={<ProtectedRoute><TambahStruktur /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/edit-struktur/:id" 
          element={<ProtectedRoute><TambahStruktur /></ProtectedRoute>} 
        />

        {/* Manajemen Aset */}
        <Route 
          path="/admin/manajemen-aset" 
          element={<ProtectedRoute><ManajemenAset /></ProtectedRoute>} 
        />

        {/* Manajemen Konten Web */}
        <Route 
          path="/admin/manajemen-konten" 
          element={<ProtectedRoute><ManajemenKontenWeb /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;