import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { auth } from "@/firebaseConfig";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isDemo } = useAuth();

  if (!user && !isDemo) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
