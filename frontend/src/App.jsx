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
import { ProtectedRoute } from "./layout/RequireAuth";
import { ProfilePages } from "./page/dashboard/ProfilePages";
import { UpdateProfilePage } from "./page/dashboard/UpdateProfilePage";
import { CreateFormDialogue } from "./page/form/CreateFormDialog";
import { UpdateFormPage } from "./page/form/Build Form/UpdateFormPage";
import { PublicViewPage } from "./page/form/PublicViewPage";
import { ThankYouPage } from "./page/form/ThankYouPage";

function App() {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    if (isCheckingAuth) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="animate-spin text-pink-500" />
            </div>
        );
    }

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
                {/* Public Routes */}
                <Route element={<Layout />}>
                    <Route
                        path="/login"
                        element={
                            authUser ? (
                                <Navigate
                                    to={
                                        window.history.state?.usr?.from
                                            ?.pathname || "/"
                                    }
                                    replace
                                />
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
                                <Navigate
                                    to={
                                        window.history.state?.usr?.from
                                            ?.pathname || "/"
                                    }
                                    replace
                                />
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

                    <Route path="/form/:url" element={<PublicViewPage />} />

                    <Route path="/thankyou/:url" element={<ThankYouPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomePage />} />

                        <Route
                            path="/change-password"
                            element={<ChangePasswordPage />}
                        />

                        <Route path="/me" element={<ProfilePages />} />

                        <Route
                            path="/profile/update"
                            element={<UpdateProfilePage />}
                        />

                        <Route
                            path="/create"
                            element={<CreateFormDialogue />}
                        />

                        <Route
                            path="/update/:id"
                            element={<UpdateFormPage />}
                        />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;
