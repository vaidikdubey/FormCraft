import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Plus, XCircle, Search } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";
import { useFormStore } from "@/store/useFormStore";
import { CreateFormDialogue } from "../form/CreateFormDialogue";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export const Navbar = () => {
    const { authUser, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [finalState, setFinalState] = useState("");

    const { forms, fetchAllForms } = useFormStore();

    useEffect(() => {
        fetchAllForms();
    }, []);

    const filteredForms = forms?.filter((form) =>
        form.title.toLowerCase().includes(finalState.toLowerCase())
    );

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setFinalState(searchQuery);
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setFinalState("");
    };

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        const root = window.document.documentElement;
        theme === "dark"
            ? root.classList.add("dark")
            : root.classList.remove("dark");

        const favicon = document.querySelector('link[rel="icon"]');

        if (favicon) {
            favicon.href =
                theme === "dark" ? "/faviconDark.png" : "/favicon.png";
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <nav
            className={cn(
                "md:w-lg lg:w-2xl xl:w-4xl sticky top-6 rounded-[999px] z-50 border-2 border-pink-300 px-5 py-2 flex justify-evenly items-center bg-white/2 backdrop-blur-[2px] before:content-[''] before:absolute before:inset-0 before:rounded-[999px] before:border-2 before:border-pink-300/10 before:-z-10 shadow-pink-500 shadow-2xs gap-2"
            )}
        >
            <CreateFormDialogue>
                <Button className={cn("flex items-center justify-center")}>
                    <Plus />{" "}
                    <span className={cn("hidden md:block")}>Create</span>
                </Button>
            </CreateFormDialogue>
            <div
                className={cn(
                    "hidden relative md:flex justify-center items-center lg:w-[50%] gap-2"
                )}
            >
                <Input
                    className={cn("pl-5")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type and press Enter to search..."
                />

                {searchQuery && (
                    <Button variant="ghost" onClick={clearSearch}>
                        <XCircle className="h-4 w-4" />
                    </Button>
                )}

                {finalState && (
                    <div
                        className={cn(
                            "absolute top-full left-0 mt-2 w-full bg-popover/70 text-popover-foreground border rounded-md shadow-md z-100 overflow-hidden"
                        )}
                    >
                        <div className={cn("p-2")}>
                            {filteredForms?.length > 0 ? (
                                filteredForms.map((form) => (
                                    <Link
                                        key={form._id}
                                        to={`/getForm/${form._id}`}
                                        className={cn(
                                            "block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                                        )}
                                    >
                                        {form.title}
                                    </Link>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-sm text-muted-foreground">
                                    No matching forms found...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className={cn("block md:hidden")}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost">
                            <Search />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={cn("w-full md:hidden")}>
                        <div className="flex md:hidden">
                            <Input
                                className={cn("pl-2 block md:hidden")}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search forms..."
                            />

                            {searchQuery && (
                                <Button variant="ghost" onClick={clearSearch}>
                                    <XCircle className="h-4 w-4 block md:hidden" />
                                </Button>
                            )}
                        </div>

                        {finalState && (
                            <div
                                className={cn(
                                    "absolute top-full left-0 mt-2 w-full bg-popover/70 text-popover-foreground border rounded-md shadow-md z-100 overflow-hidden md:hidden"
                                )}
                            >
                                <div className={cn("p-2")}>
                                    {filteredForms?.length > 0 ? (
                                        filteredForms.map((form) => (
                                            <Link
                                                key={form._id}
                                                to={`/getForm/${form._id}`}
                                                className={cn(
                                                    "block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                                                )}
                                            >
                                                {form.title}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-sm text-muted-foreground">
                                            No matching forms found...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </PopoverContent>
                </Popover>
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
                    <DropdownMenuLabel
                        className={cn("text-slate-700 dark:text-slate-400")}
                    >
                        Account Center
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link to={"/me"}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={"/change-password"}>Change Password</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className={cn("block md:hidden")}
                            onClick={handleThemeChange}
                        >
                            {theme === "light" ? "Dark Mode" : "Light Mode"}
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
