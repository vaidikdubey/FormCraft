import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./page/LoginPage";
import { Layout } from "./layout/Layout";

function App() {
    return (
        <div className="flex flex-col items-center justify-center font-sans bg-background text-foreground h-full w-ful">
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: "#0f172a",
                        color: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #334155",
                        padding: "12px 16px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                    },
                    success: {
                        style: {
                            background: "#059669",
                        },
                    },
                    error: {
                        style: {
                            background: "#dc2626",
                        },
                    },
                }}
            />
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
