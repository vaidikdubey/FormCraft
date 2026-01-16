import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useResponseStore = create((set) => ({
    isSubmittingForm: false,
    submittedForm: null,

    submitForm: async (data, id) => {
        set({ isSubmittingForm: true });

        try {
            const res = await axiosInstance.post(`/response/submit/${id}`, {
                answer: data,
            });

            set({ submittedForm: res.data });

            toast.success(res.msg || "Form submitted");

            return true;
        } catch (error) {
            console.error("Error submitting response", error);
            toast.error(
                error.response.data.message || "Error submitting response"
            );

            return false;
        }
    },
}));
