import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";

//Shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/store/useFormStore";

export const Navbar = () => {
    const { authUser, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [finalState, setFinalState] = useState("");

    const { forms, isLoadingForms, fetchAllForms } = useFormStore();

    useEffect(() => {
        fetchAllForms();
    }, []);

    const filteredForms = forms?.filter((form) =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setFinalState(searchQuery);
        }
    };

    return (
        <nav
            className={cn(
                "w-2xl sticky top-6 rounded-[999px] z-50 border-2 border-pink-300 px-5 py-2 flex justify-between items-center bg-white/2 backdrop-blur-[2px] before:content-[''] before:absolute before:inset-0 before:rounded-[999px] before:border-2 before:border-pink-300/10 before:-z-10 shadow-pink-500 shadow-2xs"
            )}
        >
            <Button>
                <Plus /> Create
            </Button>
            <div>
                <div
                    className={cn(
                        "flex justify-center items-center w-[50%] gap-2"
                    )}
                >
                    <Input
                        className={cn("pl-5")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Type and press Enter to search..."
                    />
                </div>
            </div>

            <Button
                variant={
                    authUser?.data?.role === "free" ? "default" : "outline"
                }
                className={cn("cursor-pointer")}
                asChild={authUser?.data?.role === "free"}
            >
                {authUser?.data?.role === "free" ? (
                    <Link to={"/upgrade"}>Upgrade 👑</Link>
                ) : (
                    <span>PRO 👑</span>
                )}
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <Avatar className="rounded-lg">
                            <AvatarImage
                                src="https://github.com/evilrabbit.png"
                                alt="@evilrabbit"
                            />
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Account Center</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link to={"/me"}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={"/change-password"}>Change Password</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={"/reverify"}>Verify Email</Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className={cn(
                            "text-destructive focus:bg-destructive focus:text-white focus:font-bold"
                        )}
                        onClick={handleLogout}
                    >
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
};
