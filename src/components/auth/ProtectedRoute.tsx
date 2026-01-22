  import { useEffect, useState } from 'react';
  import { Navigate } from 'react-router-dom';
  import { supabase } from '../../services/supabase';

  interface ProtectedRouteProps {
    children: React.ReactNode;
  }

  const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [checking, setChecking] = useState(true);
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
      let isMounted = true;

      const checkAuth = async () => {
        try {
          if (supabase) {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
              console.warn('Auth session error:', error.message);
            }
            if (!isMounted) return;
            const hasSession = Boolean(data?.session);
            const localFlag = localStorage.getItem('isAuthenticated') === 'true';
            setIsAuthed(hasSession || localFlag);
          } else {
            const localFlag = localStorage.getItem('isAuthenticated') === 'true';
            if (isMounted) setIsAuthed(localFlag);
          }
        } finally {
          if (isMounted) setChecking(false);
        }
      };

      checkAuth();
      return () => {
        isMounted = false;
      };
    }, []);

    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-600">Checking authentication...</div>
        </div>
      );
    }

    if (!isAuthed) {
      return <Navigate to="/admin" replace />;
    }

    return children;
  };

  export default ProtectedRoute;
