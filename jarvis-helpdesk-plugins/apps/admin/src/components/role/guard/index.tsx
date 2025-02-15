import { Navigate, Outlet } from 'react-router-dom';

const RoleGuard = ({ allowedRoles, userRole }: { allowedRoles: string[]; userRole: string | null }) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
