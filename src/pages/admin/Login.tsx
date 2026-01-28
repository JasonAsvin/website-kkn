import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Prioritize Supabase auth when configured
      if (supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError || !data.session) {
          throw new Error(authError?.message || 'Login gagal, periksa kredensial Anda.');
        }

        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin/dashboard');
        return;
      }

      // Fallback: use environment credentials when Supabase is not configured
      const fallbackEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
      const fallbackPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

      if (email === fallbackEmail && password === fallbackPassword) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin/dashboard');
      } else {
        throw new Error('Email atau password tidak valid.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-blue-700 px-4">
      <div className="w-full max-w-xl bg-white/90 backdrop-blur rounded-2xl shadow-2xl overflow-hidden">
        {/* Card header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-8 flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-bold">
            <img 
                src="/Kabupaten_Maros.png" 
                alt="Logo Kabupaten Maros" 
                className="h-16 w-16 object-contain"
                onError={(e) => {
                  // Fallback jika logo tidak ada
                  e.currentTarget.style.display = 'none';
                }}
              />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold">Admin Portal</h1>
            <p className="text-sm text-white/80">Kelurahan Baju Bodoa</p>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-4">Login ke Dashboard</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium">Username atau Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-700 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">© 2026 Kelurahan Baju Bodoa. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}