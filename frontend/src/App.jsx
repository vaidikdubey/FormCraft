import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./page/auth/LoginPage";
import { Layout } from "./layout/Layout";
import { HomePage } from "./page/dashboard/HomePage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { RegisterPage } from "./page/auth/RegisterPage";

function App() {
    const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
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
                <Route element={<Layout />}>
                    <Route
                        path="/login"
                        element={
                            !authUser ? (
                                <LoginPage />
                            ) : (
                                <Navigate to={"/"} replace />
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
                </Route>
            </Routes>
        </>
    );
}

export default App;
