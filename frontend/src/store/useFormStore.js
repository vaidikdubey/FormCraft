import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const UI_BACKEND_MAP = {
    TEXT: "text",
    EMAIL: "email",
    DROPDOWN: "dropdown",
    CHECKBOX: "checkbox",
    DATE: "date",
};

export const useFormStore = create((set) => ({
    forms: [],
    isLoadingForms: false,
    isCreatingForm: false,
    createdForm: null,
    form: null,
    isFetchingForm: false,
    isSavingForm: false,
    updatedForm: null,
    isDeletingForm: false,
    isPublishing: false,
    publishedForm: null,
    formPublicView: null,

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
        } finally {
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
            const formattedFields = data.fields.map((f) => ({
                ...f,
                type: UI_BACKEND_MAP[f.type] || f.type.toLowerCase(),
            }));

            const formattedConditions = (data.conditions || []).map((c) => ({
                sourceFieldId: c.sourceFieldId,
                targetFieldId: c.targetFieldId,
                value: c.value,
                operator: c.operator?.toLowerCase(),
                actions: (c.actions || c.action)?.toLowerCase(),
            }));

            const payload = {
                ...data,
                fields: formattedFields,
                conditions: formattedConditions,
            };

            const res = await axiosInstance.patch(
                `/form/update/${id}`,
                payload
            );

            set({ updatedForm: res.data });
        } catch (error) {
            console.error("Error updating form", error);
            toast.error("Error updating form");
        } finally {
            set({ isSavingForm: false });
        }
    },

    deleteForm: async (id) => {
        set({ isDeletingForm: true });

        try {
            await axiosInstance.delete(`/form/delete/${id}`);

            toast.success("Form deleted");
        } catch (error) {
            console.error("Error deleting form", error);
            toast.error("Error deleting form");
        } finally {
            set({ isDeletingForm: false });
        }
    },

    publishForm: async (data, id) => {
        set({ isPublishing: true });

        try {
            const res = await axiosInstance.patch(`/form/publish/${id}`, data);

            set({ publishedForm: res.data });

            data.isPublished && toast.success("Form published");

            !data.isPublished && toast.success("Form unpublished");

            return true;
        } catch (error) {
            console.error("Error publishing form", error);
            toast.error("Error publishing form");

            return false;
        } finally {
            set({ isPublishing: false });
        }
    },

    getPublicView: async (url) => {
        try {
            const res = await axiosInstance.get(`/form/public/${url}`);

            set({ formPublicView: res.data.data });
        } catch (error) {
            console.error("Error fetching form", error);
            toast.error("Error fetching form");
        }
    },
}));
