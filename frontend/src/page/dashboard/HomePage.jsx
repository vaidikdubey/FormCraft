import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";

export const HomePage = () => {

    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    }

    return (
        <div
            className={cn(
                "h-full flex flex-col justify-center items-center text-3xl text-hover-text font-bold"
            )}
        >
            Welcome to FormCraft! Page under construction ⚠️

            <Button
                variant="default"
                onClick={handleLogout}
                className={cn("my-5 cursor-pointer")}>
                Logout
            </Button>
        </div>
    );
};
