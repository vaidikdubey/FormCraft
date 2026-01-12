import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { createFormSchema } from "@/lib/zod";
import { useFormStore } from "@/store/useFormStore";
import { useNavigate } from "react-router-dom";

//Shadcn components
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const CreateFormDialogue = ({ children }) => {
    const navigate = useNavigate();

    const { createForm, isCreatingForm } = useFormStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(createFormSchema),
        defaultValues: {
            title: "",
            email: "",
        },
    });

    const onSubmit = async (data) => {
        const result = await createForm(data);

        if (result.success)
            setTimeout(() => navigate(`/update/${result.id}`), 1000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Create a New Form</DialogTitle>
                        <DialogDescription className={cn("mb-5")}>
                            Start by giving your form a name and optional
                            description.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 mb-5">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Your form title"
                                {...register("title", {
                                    required: "title is required",
                                })}
                                className={cn(
                                    "placeholder:text-stone-400",
                                    errors.title &&
                                        "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            {errors.title && (
                                <p className={cn("text-xs text-red-500 mt-1")}>
                                    {errors.title.message}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Your form description..."
                                {...register("description")}
                                className={cn(
                                    "placeholder:text-stone-400",
                                    errors.name &&
                                        "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            {errors.description && (
                                <p className={cn("text-xs text-red-500 mt-1")}>
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={isCreatingForm || !isDirty}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isCreatingForm || !isDirty}
                        >
                            {isCreatingForm ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
