import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

//Shadcn components
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RegisterPage = () => {
    const { signup, isSigninUp } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data) => {
        signup(data);
    };

    return (
        <div className={cn("flex flex-col justify-center items-center h-full")}>
            <Card className={cn("w-full max-w-sm")}>
                <CardHeader>
                    <CardTitle className={cn("text-2xl")}>
                        Create new FormCraft Account
                    </CardTitle>
                    <CardDescription className={cn("text-sm w-full")}>
                        Start building dynamic forms, collect responses, and
                        manage everything from one powerful dashboard.
                    </CardDescription>
                    <CardAction>
                        <Button
                            variant="link"
                            className={cn(
                                "hover:underline cursor-pointer hover:text-hover-text hover:font-bold",
                            )}
                        >
                            <Link to={"/login"}>Login</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        {/* Name field */}
                        <div>
                            <Label htmlFor="name" className={cn("my-2")}>
                                Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                className={cn(
                                    "placeholder:text-stone-400",
                                    errors.name &&
                                        "border-red-500 focus-visible:ring-red-500",
                                )}
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className={cn("text-xs text-red-500 mt-1")}>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <Label htmlFor="email" className={cn("my-2")}>
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className={cn(
                                    "placeholder:text-stone-400",
                                    errors.email &&
                                        "border-red-500 focus-visible:ring-red-500",
                                )}
                                {...register("email")}
                            />
                            {errors.email && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <Label htmlFor="password" className={cn("my-3")}>
                                Password
                            </Label>
                            <div className={cn("flex gap-3")}>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                                    className={cn(
                                        "placeholder:text-stone-400",
                                        errors.password &&
                                            "border-red-500 focus-visible:ring-red-500",
                                    )}
                                    {...register("password")}
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
                            {errors.password && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <Label
                                htmlFor="confirmPassword"
                                className={cn("my-3")}
                            >
                                Confirm Password
                            </Label>
                            <div className={cn("flex gap-3")}>
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="⁕⁕⁕⁕⁕⁕⁕⁕⁕⁕"
                                    className={cn(
                                        "placeholder:text-stone-400",
                                        errors.confirmPassword &&
                                            "border-red-500 focus-visible:ring-red-500",
                                    )}
                                    {...register("confirmPassword")}
                                />
                                <Button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className={cn("cursor-pointer")}
                                >
                                    {showConfirmPassword ? (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <EyeClosed className="h-5 w-5 text-base-content/40" />
                                    )}
                                </Button>
                            </div>
                            {errors.confirmPassword && (
                                <p
                                    className={cn(
                                        "text-xs font-medium text-red-500 mt-1",
                                    )}
                                >
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            type="submit"
                            className={cn("w-full cursor-pointer mt-6")}
                            disabled={isSigninUp}
                        >
                            <Link>
                                {isSigninUp ? "Please wait..." : "Signup"}
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
