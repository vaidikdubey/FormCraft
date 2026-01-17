import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";

export const usePaymentStore = create((set) => ({
    isCreatingOrder: false,
    paymentData: null,
    isVerifyingPayment: false,
    verifyPaymentData: null,

    createOrder: async () => {
        set({ isPaymentLoading: true });

        try {
            const res = await axiosInstance.post("/payment/create", {});

            set({ paymentData: res.data });
            toast.success(res.message || "Order created");

            return res.data;
        } catch (error) {
            console.error("Error creating order", error);
            toast.error("Error creating order");
        } finally {
            set({ isPaymentLoading: false });
        }
    },

    verifyPayment: async (response) => {
        set({ isVerifyingPayment: true });

        try {
            const res = await axiosInstance.post("/payment/verify", response);

            set({ verifyPaymentData: res.data });
            toast.success(res.message || "Payment verified! PRO activated🎉");
        } catch (error) {
            console.error("Error verifying payment", error);
            toast.error("Error verifying payment");
        } finally {
            set({ isVerifyingPayment: false });
        }
    },
}));
