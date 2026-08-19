import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/useAuth";
import type { UserRole } from "../../types/user";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
