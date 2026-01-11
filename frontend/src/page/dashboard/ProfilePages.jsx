import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    CircleX,
    Crown,
    TrendingUp,
    Eye,
    EyeClosed,
} from "lucide-react";

//Shadcn components
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export const ProfilePages = () => {
    const { authUser, deleteUser, isDeletingUser } = useAuthStore();

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [isDialogueOpen, setIsDialogueOpen] = useState(false);

    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();
        const success = await deleteUser(password);

        if (success) {
            setIsDialogueOpen(false);
            setPassword("");

            setTimeout(() => {
                navigate("/signup");
            }, 1000);
        }
    };

    return (
        <div className={cn("h-full w-full flex justify-center items-center")}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Update your personal details here
                    </CardDescription>
                    <CardAction>
                        <Button asChild variant="ghost">
                            <Link
                                to={"/"}
                                className="hover:text-hover-text cursor-pointer"
                            >
                                <ArrowLeft /> Home
                            </Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <Label className={cn("mb-4")}>
                        Name: {authUser?.data?.name}
                    </Label>

                    <Label className={cn("mb-4")}>
                        <div className="flex justify-center items-center gap-2">
                            Email: {authUser?.data?.email}
                            {authUser?.data?.isEmailVerified ? (
                                <CheckCircle2
                                    size={"15px"}
                                    className="text-emerald-400"
                                />
                            ) : (
                                <Link to={"/reverify"}>
                                    <CircleX
                                        size={"15px"}
                                        className="text-red-500"
                                    />
                                </Link>
                            )}
                        </div>
                    </Label>

                    <Label className={cn("mb-4")}>
                        Response Limit: {authUser?.data?.responseLimit}
                    </Label>

                    <Label>
                        Plan:{" "}
                        {authUser?.data?.role === "free" ? (
                            <span className="flex justify-center items-center gap-2">
                                FREE{" "}
                                <Link to={"/upgrade"}>
                                    <TrendingUp
                                        size={"20px"}
                                        className="text-pink-500"
                                    />
                                </Link>
                            </span>
                        ) : (
                            <span className="flex justify-center items-center gap-2">
                                PRO{" "}
                                <Crown
                                    size={"20px"}
                                    className="text-amber-400"
                                />
                            </span>
                        )}
                    </Label>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        asChild
                        type="submit"
                        className="w-full cursor-pointer font-semibold"
                    >
                        <Link to={"/profile/update"}>Update Profile</Link>
                    </Button>

                    {/* Delete user button */}
                    <AlertDialog
                        open={isDialogueOpen}
                        onOpenChange={setIsDialogueOpen}
                    >
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full font-semibold"
                            >
                                Delete User
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="flex flex-col gap-4">
                                <Label htmlFor="password">
                                    Current Password:{" "}
                                </Label>
                                <div className="flex gap-5">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className={cn("cursor-pointer")}
                                    >
                                        {showPassword ? (
                                            <Eye className="h-5 w-5 text-base-content/40" />
                                        ) : (
                                            <EyeClosed className="h-5 w-5 text-base-content/40" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeletingUser}>
                                    Cancel
                                </AlertDialogCancel>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeletingUser || !password}
                                >
                                    {isDeletingUser
                                        ? "Deleting..."
                                        : "Delete Account"}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    );
};
