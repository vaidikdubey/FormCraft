import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useFormStore = create((set) => ({
    forms: [],
    isLoadingForms: false,

    fetchAllForms: async () => {
        set({ isLoadingForms: true });

        try {
            const res = await axiosInstance.get("/form/getAll");

            set({ forms: res.data.data });
        } catch (error) {
            console.error("Error fetching forms", error);
            toast.error("Error fetching forms");
        } finally {
            set({ isLoadingForms: false });
        }
    },
}));
