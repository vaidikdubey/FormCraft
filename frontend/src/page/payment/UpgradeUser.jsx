import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { ArrowLeft, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

//Shadcn components
import { Button } from "@/components/ui/button";

export const UpgradeUser = () => {
    const { isCreatingOrder, isVerifyingPayment, createOrder, verifyPayment } =
        usePaymentStore();

    const { authUser } = useAuthStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (authUser?.data?.role === "paid") {
            toast.success("You are already on PRO plan!");
            navigate("/");
        }
    }, [authUser?.data?.role, navigate]);

    const handleUpgrade = async () => {
        if (isCreatingOrder || isVerifyingPayment) return;

        try {
            const order = await createOrder();

            const options = {
                key: order.data.key,
                amount: order.data.amount,
                currency: order.data.currency,
                name: "FormCraft",
                description:
                    "Lifetime Premium Upgrade - Unlimited access to PRO features!",
                order_id: order.data.orderId,
                prefill: {
                    name: authUser?.data?.name || "User",
                    email: authUser?.data?.email || "",
                },
                theme: {
                    color: "#3B82F6",
                },
                handler: async (response) => {
                    await verifyPayment(response);
                    setTimeout(() => navigate("/"), 0);
                },
                modal: {
                    ondismiss: () => {
                        toast("Payment cancelled", { icon: "❌" });
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Upgrade flow error", error);
        }
    };

    if (isCreatingOrder || isVerifyingPayment) {
        <div className="h-full flex items-center justify-center">
            <Loader className="animate-spin text-pink-500" />
        </div>;
    }

    return (
        <div className="h-full bg-background flex items-center justify-center p-4">
            <Button
                variant="ghost"
                size="icon"
                className={cn("absolute left-8 top-9")}
                onClick={() => navigate("/")}
            >
                <ArrowLeft />
            </Button>
            <div className="bg-gray-900 dark:bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all hover:scale-[1.02]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-200 dark:text-gray-900 mb-2">
                        Go Premium
                    </h1>
                    <p className="text-gray-400 dark:text-gray-600">
                        Unlock unlimited power for your forms
                    </p>
                </div>

                {/* Features List */}
                <div className="mb-8 space-y-3">
                    <ul className="space-y-2 text-sm text-gray-300 dark:text-gray-700">
                        <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>{" "}
                            Response limit upgraded to 250/form
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>{" "}
                            Export responses (CSV)
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span> Edit
                            responses
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>{" "}
                            Priority email support
                        </li>
                    </ul>
                </div>

                {/* Price */}
                <div className="text-center mb-8 p-4 bg-blue-50 dark:bg-blue-100 rounded-xl">
                    <p className="text-4xl font-bold text-blue-600">₹499</p>
                    <p className="text-sm text-gray-500">
                        One-time payment. Lifetime access.
                    </p>
                </div>

                {/* Upgrade Button */}
                <button
                    onClick={handleUpgrade}
                    disabled={isCreatingOrder}
                    className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg"
                >
                    {isCreatingOrder ? (
                        <>Upgrading your account</>
                    ) : (
                        <>
                            <span className="mr-2">🔒</span>
                            Upgrade Now
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-gray-300 dark:text-gray-500 mt-6">
                    Powered by Razorpay | Secure & Test Mode Active
                </p>
            </div>
        </div>
    );
};
