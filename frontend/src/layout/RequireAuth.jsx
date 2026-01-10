import React from "react";
import { Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export const RequireAuth = () => {
    const { isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    return <Outlet />;
};
