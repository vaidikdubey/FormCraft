import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
            const res = await axiosInstance.get("/auth/me");

            set({ authUser: res.data });
        } catch (error) {
            console.error("Error checking auth", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/auth/login", data);

            toast.success(res.message || "Login successful");

            set({ authUser: res.data });
        } catch (error) {
            console.error("Error logging in", error);
            toast.error("Error logging in");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    signup: async (data) => {
        set({ isSigninUp: true });

        try {
            const res = await axiosInstance.post("/auth/register", data);

            toast.success(res.message || "User created successfully");

            set({ authUser: res.data });
        } catch (error) {
            console.error("Error signing in", error);
            toast.error("Error signing in");
        } finally {
            set({ isSigninUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.get("/auth/logout");
            set({ authUser: null });

            toast.success("Logout successful");
        } catch (error) {
            console.error("Error logging out", error);
            toast.error("Error logging out");
        }
    },

    verifyEmail: async (token) => {
        try {
            const res = await axiosInstance.get(`/auth/verify/${token}`);

            toast.success(res.message || "Email verified");

            return { status: "success" };
        } catch (error) {
            console.error("Error verifying email", error);
            toast.error("Error verifying email");
            return { status: "error" };
        }
    },

    forgotPassword: async (data) => {
        try {
            const res = await axiosInstance.post("/auth/forgot-password", data);
        } catch (error) {
            console.error("Error in forgot password", error);
            toast.error("Error sending reset link");
        }
    },
}));
