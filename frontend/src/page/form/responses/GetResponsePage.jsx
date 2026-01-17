import React, { useEffect } from "react";
import { useResponseStore } from "@/store/useResponseStore";
import { useParams } from "react-router-dom";
import { useFormStore } from "@/store/useFormStore";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

//Shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const GetResponsePage = () => {
    const { formId, responseId } = useParams();

    const { getResponse, response } = useResponseStore();

    const { fetchFormById, form } = useFormStore();

    useEffect(() => {
        getResponse(responseId);
        fetchFormById(formId);
        //eslint-disable-next-line
    }, [responseId, formId]);

    // console.log("Response: ", response.data.answer);
    // console.log("Form: ", form);

    const renderField = (field) => {
        const userResponse = response?.data?.answer;

        const commonProps = {
            id: field.id,
            className: cn("w-full p-2 border rounded-md"),
            placeholder: field.placeholder,
        };

        switch (field.type) {
            case "text":
                return (
                    <Input
                        type="text"
                        value={
                            userResponse?.[field?.fieldKey] ?? "Not answered..."
                        }
                        readOnly
                        {...commonProps}
                    />
                );
            case "email":
                return (
                    <Input
                        type="email"
                        value={
                            userResponse?.[field?.fieldKey] || "Not answered..."
                        }
                        readOnly
                        {...commonProps}
                    />
                );
            case "date":
                return (
                    <Input
                        type="date"
                        value={userResponse?.[field?.fieldKey] || ""}
                        readOnly
                        {...commonProps}
                    />
                );
            case "dropdown":
                return (
                    <select
                        {...commonProps}
                        value={userResponse?.[field?.fieldKey] || ""}
                        disabled
                        className={cn(
                            commonProps.className,
                            "cursor-not-allowed opacity-70"
                        )}
                    >
                        {!userResponse?.[field?.fieldKey] && (
                            <option
                                className={cn(
                                    "bg-white dark:bg-background text-foreground"
                                )}
                            >
                                Not answered...
                            </option>
                        )}
                        {field.options.map((opt) => (
                            <option
                                key={opt}
                                value={opt}
                                className={cn(
                                    "bg-white dark:bg-background text-foreground"
                                )}
                            >
                                {opt}
                            </option>
                        ))}
                    </select>
                );
            case "checkbox":
                return (
                    <div>
                        {field.options?.map((opt) => {
                            const selectedValue =
                                userResponse?.[field?.fieldKey] ??
                                "Not answered...";
                            return (
                                <div
                                    key={opt}
                                    className="flex items-center text-nowrap gap-3 my-4"
                                >
                                    <Checkbox
                                        id={field.fieldKey}
                                        checked={
                                            selectedValue.includes(opt) ?? false
                                        }
                                    />
                                    <Label htmlFor={field.fieldKey}>
                                        {opt}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex h-full w-full bg-background text-foreground flex-col font-sans max-w-7xl mx-auto">
            <Button
                variant="ghost"
                size="icon"
                className={cn("absolute left-2 lg:left-8 top-9")}
            >
                <ArrowLeft />
            </Button>
            <div className="h-full w-full flex justify-center items-center bg-background text-foreground font-sans">
                <div className="flex flex-1 overflow-hidden h-full">
                    <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-background no-scrollbar">
                        <div className="w-full max-w-3xl space-y-4">
                            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border-t-8 border-t-pink-500 shadow-sm px-5 py-10">
                                <h1 className="font-bold text-2xl mb-2">
                                    {form?.title}
                                </h1>
                                <p className="text-muted-foreground">
                                    {form?.description ? (
                                        form?.description
                                    ) : (
                                        <span className="italic text-sm">
                                            No form description provided...
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="rounded-lg text-center bg-background">
                                {form?.fields?.length > 0 ? (
                                    form?.fields?.map((f) => (
                                        <Card
                                            key={f.fieldKey}
                                            className="w-full my-5 border-l-4 border-l-pink-400"
                                        >
                                            <CardContent>
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex flex-col items-start gap-3 mb-2">
                                                        <h3>
                                                            {f.label}
                                                            <span className="text-red-500">
                                                                {f.required
                                                                    ? "*"
                                                                    : ""}
                                                            </span>
                                                        </h3>
                                                        {renderField(f)}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="w-full text-muted-foreground italic text-center border border-dashed border-gray-400 p-10 rounded-xl">
                                        No fields found...
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
