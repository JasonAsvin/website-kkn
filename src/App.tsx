import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import ProfileKelurahan from './pages/ProfileKelurahan';
import OrgStructure from './pages/StrukturOrganisasi';
import VisionMission from './pages/VisiMisi';
import Infografis from './pages/Infografis';
import LoginAdmin from './pages/admin/Login';
import DashboardAdmin from './pages/admin/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<About />} />
          <Route path="/profil-kelurahan" element={<ProfileKelurahan />} />
          <Route path="/struktur-organisasi" element={<OrgStructure />} />
          <Route path="/visi-misi" element={<VisionMission />} />
          <Route path="/infografis" element={<Infografis />} />
          <Route path="/berita" element={<News />} />
          <Route path="/galeri" element={<Gallery />} />
          <Route path="/kontak" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route
          path="/admin/dashboard"
          element={
//            <ProtectedRoute>
              <DashboardAdmin />
//            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;