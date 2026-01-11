import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./page/auth/LoginPage";
import { Layout } from "./layout/Layout";
import { HomePage } from "./page/dashboard/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { RegisterPage } from "./page/auth/RegisterPage";
import { VerifyEmailPage } from "./page/auth/VerifyEmailPage";
import { ForgotPasswordPage } from "./page/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./page/auth/ResetPasswordPage";
import { ChangePasswordPage } from "./page/auth/ChangePasswordPage";
import { RequireAuth } from "./layout/RequireAuth";
import { ProfilePages } from "./page/dashboard/ProfilePages";
import { UpdateProfilePage } from "./page/dashboard/UpdateProfilePage";

function App() {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    className:
                        "dark:bg-card dark:text-foreground dark:border-border",
                    style: {
                        background: "var(--foreground)",
                        color: "var(--background)",
                    },
                }}
            />
            <Routes>
                <Route element={<Layout />}>
                    <Route element={<RequireAuth />}>
                        <Route
                            path="/login"
                            element={
                                authUser ? (
                                    <Navigate to={"/"} replace />
                                ) : (
                                    <LoginPage />
                                )
                            }
                        />

                        <Route
                            path="/signup"
                            element={
                                !authUser ? (
                                    <RegisterPage />
                                ) : (
                                    <Navigate to={"/"} replace />
                                )
                            }
                        />

                        <Route
                            path="/"
                            element={
                                authUser ? (
                                    <HomePage />
                                ) : (
                                    <Navigate to={"/login"} replace />
                                )
                            }
                        />

                        <Route
                            path="/change-password"
                            element={
                                isCheckingAuth || authUser === null ? (
                                    <div className="flex items-center justify-center h-screen">
                                        <Loader className="size-10 animate-spin" />
                                    </div>
                                ) : authUser ? (
                                    <ChangePasswordPage />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/verify/:token"
                            element={<VerifyEmailPage />}
                        />

                        <Route
                            path="/forgot-password"
                            element={<ForgotPasswordPage />}
                        />

                        <Route
                            path="/reset-password/:token"
                            element={<ResetPasswordPage />}
                        />

                        <Route
                            path="/me"
                            element={
                                authUser ? (
                                    <ProfilePages />
                                ) : (
                                    <Navigate to={"/login"} replace />
                                )
                            }
                        />

                        <Route
                            path="/profile/update"
                            element={
                                authUser ? (
                                    <UpdateProfilePage />
                                ) : (
                                    <Navigate to={"/login"} replace />
                                )
                            }
                        />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
