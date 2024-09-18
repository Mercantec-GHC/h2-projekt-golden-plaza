import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./UserAuth";


const ProtectedRoute = () => {
    const user = useAuth()
    if (!user.token) return <Navigate to="/login"/>;
    return <Outlet />;
}


export default ProtectedRoute;