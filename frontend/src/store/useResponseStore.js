import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export const useResponseStore = create((set) => ({
    isSubmittingForm: false,
    submittedForm: null,
    isDeletingResponse: false,
    isDeletingAllResponses: false,
    isGettingAllResponses: false,
    allResponses: [],
    isGettingResponse: false,
    respone: null,

    submitForm: async (data, id) => {
        set({ isSubmittingForm: true });

        try {
            const res = await axiosInstance.post(`/response/submit/${id}`, {
                answer: data,
            });

            set({ submittedForm: res.data });

            toast.success(res.msg || "Form submitted");

            return { success: true, data: res.data };
        } catch (error) {
            console.error("Error submitting response", error);
            toast.error(
                error.response.data.message || "Error submitting response"
            );

            return { success: false, data: null };
        }
        finally {
            set({ isSubmittingForm: false });
        }
    },

    getAllResponses: async (formId) => {
        set({ isGettingAllResponses: true });

        try {
            const res = await axiosInstance.get(
                `/response/getAllResponses/${formId}`
            );

            set({ allResponses: res.data });
        } catch (error) {
            console.error("Error getting all responses", error);
            toast.error("Error getting responses");
        } finally {
            set({ isGettingAllResponses: false });
        }
    },

    getResponse: async (id) => {
        set({ isGettingResponse: true });

        try {
            const res = await axiosInstance.get(`/response/getResponse/${id}`);

            set({ response: res.data });
        } catch (error) {
            console.error("Error getting response", error);
            toast.error("Error getting response");
        } finally {
            set({ isGettingResponse: false });
        }
    },

    deleteResponse: async (id) => {
        set({ isDeletingResponse: true });

        try {
            await axiosInstance.delete(`/response/delete/${id}`);

            toast.success("Response deleted");

            return true;
        } catch (error) {
            console.error("Error deleting response", error);
            toast.error("Error deleting response");

            return false;
        } finally {
            set({ isDeletingResponse: false });
        }
    },

    deleteAllResponses: async (formId) => {
        set({ isDeletingAllResponses: true });

        try {
            await axiosInstance.delete(`/response/deleteAll/${formId}`);

            toast.success("All responses deleted");

            return true;
        } catch (error) {
            console.error("Error deleting all responses", error);
            toast.error("Error deleting all responses");

            return false;
        } finally {
            set({ isDeletingAllResponses: false });
        }
    },

    exportResponse: async (formId) => {
        try {
            const response = await axiosInstance.get(
                `/response/export/${formId}`,
                {
                    responseType: "blob", //Telling axios to handle response as file
                }
            );

            //Create URL for blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));

            //Create temporary anchor element -> for download trigger
            const link = document.createElement("a");
            link.href = url;

            //Set the filename -> optional: can extract it from headers and assign as given by backend
            link.setAttribute("download", `form_export_${formId}.csv`);

            //Append link to body, click it to trigger download, remove it
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            //Clean up the url object
            window.URL.revokeObjectURL(url);

            toast.success("File downloaded");
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Export failed");
        }
    },
}));
