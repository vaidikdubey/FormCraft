import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useFormStore = create((set) => ({
    forms: [],
    isLoadingForms: false,
    isCreatingForm: false,
    createdForm: null,
    form: null,
    isFetchingForm: false,
    isSavingForm: false,
    updatedForm: null,

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

    fetchFormById: async (id) => {
        set({ isFetchingForm: true });
        try {
            const res = await axiosInstance.get(`/form/getForm/${id}`);

            set({ form: res.data.data });
        } catch (error) {
            console.error("Error fetching form", error);
            toast.error("Error fetching form");
        }
        finally {
            set({ isFetchingForm: false });
        }
    },

    createForm: async (data) => {
        set({ isCreatingForm: true });

        try {
            const res = await axiosInstance.post("/form/create", data);

            set({ createdForm: res.data.data });

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

    updateForm: async (data, id) => {
        set({ isSavingForm: true });
        try {
            const res = await axiosInstance.patch(`/form/update/${id}`, data);

            set({ updateForm: res.data });
        } catch (error) {
            console.error("Error updating form", error);
            toast.error("Error updating form")
        }
        finally {
            set({ isSavingForm: false });
        }
    },
}));
