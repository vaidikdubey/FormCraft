import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useResponseStore = create((set) => ({
    isSubmittingForm: false,
    submittedForm: null,
    isDeletingResponse: false,
    isDeletingAllResponses: false,

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

    deleteResponse: async (id) => {
        set({ isDeletingResponse: true });

        try {
            await axiosInstance.delete(`/response/delete/${id}`);

            toast.success("Response deleted");
        } catch (error) {
            console.error("Error deleting response", error);
            toast.error("Error deleting response")
        }
        finally {
            set({ isDeletingResponse: false });
        }
    },

    deleteAllResponses: async (formId) => {
        set({ isDeletingAllResponses: true });

        try {
            await axiosInstance.delete(`/response/deleteAll/${formId}`);

            toast.success("All responses deleted");
        } catch (error) {
            console.error("Error deleting all responses", error);
            toast.error("Error deleting all responses")
        }
        finally {
            set({ isDeletingAllResponses: false });
        }
    }
}));
