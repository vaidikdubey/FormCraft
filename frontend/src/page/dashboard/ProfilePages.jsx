import React from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    CircleX,
    Crown,
    TrendingUp,
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

export const ProfilePages = () => {
    const { authUser } = useAuthStore();

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
                        className="w-full cursor-pointer"
                    >
                        <Link to={"/update"}>Update Profile</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};
