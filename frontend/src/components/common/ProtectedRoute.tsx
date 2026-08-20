import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/useAuth";
import type { UserRole } from "../../types/user";
import { getRedirectPath } from "../../utils/redirectByRole";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRedirectPath(user.role)} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
