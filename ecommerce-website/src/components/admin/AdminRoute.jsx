import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white p-10">Loading Please Wait... </div>;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }  

  return children;
}

export default AdminRoute;
