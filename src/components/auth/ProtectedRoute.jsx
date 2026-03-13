import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, status, token } = useSelector((state) => state.auth);
  const location = useLocation();

  const isInitializing = status === 'loading' || status === 'idle';

  const isFetchingUser = token && !user;

  if (isInitializing || isFetchingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest animate-pulse">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    console.warn("[Auth] No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role?.toUpperCase();
  const normalizedRoles = allowedRoles?.map(role => role.toUpperCase());

  if (normalizedRoles && !normalizedRoles.includes(userRole)) {
    console.error(`[Access Denied] User Role: ${userRole} | Required: ${normalizedRoles}`);
    return <Navigate to="/dashboard" replace />; 
  }
  
  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
};

export default ProtectedRoute;