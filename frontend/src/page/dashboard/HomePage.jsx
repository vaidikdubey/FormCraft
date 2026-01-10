import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { Navbar } from "./Navbar";

export const HomePage = () => {
    return (
        <div className="flex flex-col w-full h-full items-center">
            <Navbar />
            <div
                className={cn(
                    "flex-1 flex flex-col justify-center items-center text-3xl text-hover-text font-bold"
                )}
            >
                Welcome to FormCraft! Page under construction ⚠️
            </div>
        </div>
    );
};
