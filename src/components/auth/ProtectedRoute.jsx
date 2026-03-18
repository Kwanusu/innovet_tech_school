import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, status, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. IMPROVED INITIALIZING CHECK
  // If we have a token but no user object, we MUST be in a loading state 
  // regardless of what the "status" string says (prevents race conditions).
  const isInitializing = status === 'loading' || (token && !user);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest animate-pulse">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  // 2. TOKEN CHECK
  // If there's no token at all, they definitely aren't logged in.
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. USER OBJECT CHECK
  // If initialization finished but we still don't have a user, the token was likely invalid.
  if (!user) {
    console.warn("[Auth] Session invalid or profile fetch failed");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toUpperCase();
  const normalizedRoles = allowedRoles?.map(role => role.toUpperCase());

  // 4. ROLE CHECK
  if (normalizedRoles && !normalizedRoles.includes(userRole)) {
    console.error(`[Access Denied] User Role: ${userRole} | Required: ${normalizedRoles}`);
    
    // Redirect admins to /admin if they accidentally hit a student route, 
    // and others to the standard dashboard.
    const redirectPath = userRole === 'ADMIN' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />; 
  }
  
  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
};

export default ProtectedRoute;