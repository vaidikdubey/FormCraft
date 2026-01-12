import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useFormStore = create((set) => ({
    forms: [],
    isLoadingForms: false,
    isCreatingForm: false,

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

    createForm: async (data) => {
        set({ isCreatingForm: true });

        try {
            const res = await axiosInstance.post("/form/create", data);

            toast.success(res.message || "Form created");

            return { success: true, id: res.data.data._id };
        } catch (error) {
            console.error("Error creating form", error);
            toast.error("Error creating form");

            return { success: false, id: null };
        } finally {
            set({ isCreatingForm: false });
        }
    },
}));
