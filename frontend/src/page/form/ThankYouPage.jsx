import { cn } from "@/lib/utils";
import { useFormStore } from "@/store/useFormStore";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

//Shadcn component(s)
import { Button } from "@/components/ui/button";

export const ThankYouPage = () => {
    const { url } = useParams();

    const { formPublicView, getPublicView } = useFormStore();

    useEffect(() => {
        getPublicView(url);
        //eslint-disable-next-line
    }, [url]);

    return (
        <div className="flex h-full w-full bg-background text-foreground flex-col font-sans max-w-7xl mx-auto">
            <div className="h-full w-full flex justify-center items-center bg-background text-foreground font-sans">
                <div className="flex flex-1 overflow-hidden h-full">
                    <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-background no-scrollbar">
                        <div className="w-full max-w-3xl space-y-4">
                            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border-t-8 border-t-pink-500 shadow-sm px-5 py-10">
                                <h1 className="font-bold text-2xl mb-5">
                                    {formPublicView?.title}
                                </h1>
                                <p className="text-muted-foreground">
                                    Your response has been recorded.
                                </p>
                                <p className="text-muted-foreground">
                                    Thank you for submitting.
                                </p>
                                <div className="w-full flex flex-col justify-between items-start mt-8 gap-8">
                                    {formPublicView?.ownerId?.role !==
                                        "free" && (
                                        <Button
                                            variant="link"
                                            className={cn(
                                                "p-0 pl-1 hover:text-hover-text"
                                            )}
                                        >
                                            Edit your response
                                        </Button>
                                    )}
                                    <Button
                                        asChild
                                        variant="outline"
                                        className={cn(
                                            "bg-pink-500 dark:bg-pink-500 font-bold md:text-xl w-full"
                                        )}
                                    >
                                        <Link
                                            to={`${window.location.origin}/signup`}
                                        >
                                            Create your own form!
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
