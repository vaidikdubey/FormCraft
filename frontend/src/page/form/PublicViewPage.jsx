import { useFormStore } from "@/store/useFormStore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useResponseStore } from "@/store/useResponseStore";

//Shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const PublicViewPage = () => {
    const navigate = useNavigate()

    const { isSubmittingForm, submitForm } = useResponseStore();

    const operationFn = {
        equals: (a, b) => a === b,
        not_equals: (a, b) => a !== b,
        contains: (a, b) => String(a).includes(String(b)),
    };

    const { url } = useParams();

    const { formPublicView, getPublicView } = useFormStore();

    const [responses, setResponses] = useState({});

    const targetFieldsArray = formPublicView?.conditions?.map(
        (cond) => cond.targetFieldId
    );

    const handleInputChange = (fieldId, e, type, option = undefined) => {
        let finalValue;

        if (type === "checkbox") {
            finalValue = [option];
        } else {
            finalValue = e.target.value;
        }

        setResponses((prev) => ({ ...prev, [fieldId]: finalValue }));
    };

    const isTargetField = (field) => {
        if (!targetFieldsArray.includes(field.fieldKey)) return true;

        const conditionObject =
            formPublicView?.conditions?.find(
                (cond) => cond.targetFieldId === field.fieldKey
            ) ?? null;

        if (!conditionObject) return true;

        const { sourceFieldId, operator, value, actions } = conditionObject;

        const compareFn = operationFn[operator];

        const responseValue = !Array.isArray(responses[sourceFieldId])
            ? responses[sourceFieldId]
            : responses[sourceFieldId].toString();

        if (compareFn(responseValue, value)) {
            return actions === "show" ? true : false;
        }

        return actions === "show" ? false : true;
    };

    const renderField = (field) => {
        const commonProps = {
            id: field.id,
            required: field.required || false,
            className: cn("w-full p-2 border rounded-md"),
            placeholder: field.placeholder,
            onChange: (e) => handleInputChange(field.fieldKey, e, field.type),
        };

        switch (field.type) {
            case "text":
                return <Input type="text" {...commonProps} />;
            case "email":
                return <Input type="email" {...commonProps} />;
            case "date":
                return <Input type="date" {...commonProps} />;
            case "dropdown":
                return (
                    <select {...commonProps}>
                        <option
                            value=""
                            className={cn(
                                "bg-white dark:bg-background text-foreground"
                            )}
                        >
                            Select an option...
                        </option>
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
                                responses[field?.fieldKey] ?? [];
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
                                        onCheckedChange={(e) =>
                                            handleInputChange(
                                                field.fieldKey,
                                                e,
                                                field.type,
                                                opt
                                            )
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

    useEffect(() => {
        getPublicView(url);
        //eslint-disable-next-line
    }, [url]);

    const handleSubmit = () => {
        submitForm(responses, formPublicView._id);

        navigate(`/thankyou/${url}`, { replace: true });
    };

    return (
        <div className="flex h-full w-full bg-background text-foreground flex-col font-sans max-w-7xl mx-auto">
            <div className="h-full w-full flex justify-center items-center bg-background text-foreground font-sans">
                <div className="flex flex-1 overflow-hidden h-full">
                    <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-background no-scrollbar">
                        <div className="w-full max-w-3xl space-y-4">
                            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border-t-8 border-t-pink-500 shadow-sm px-5 py-10">
                                <h1 className="font-bold text-2xl mb-2">
                                    {formPublicView?.title}
                                </h1>
                                <p className="text-muted-foreground">
                                    {formPublicView?.description
                                        ? formPublicView?.description
                                        : "No form description provided by owner"}
                                </p>
                            </div>
                            <div className="rounded-lg text-center bg-background">
                                {formPublicView?.fields?.length > 0 ? (
                                    formPublicView?.fields?.map(
                                        (f) =>
                                            isTargetField(f) && (
                                                <Card
                                                    key={f.fieldKey}
                                                    className="w-full my-5 border-l-4 border-l-pink-400"
                                                >
                                                    <CardContent>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex flex-col items-start gap-3 mb-2">
                                                                <h3>
                                                                    {f.label}
                                                                </h3>
                                                                {renderField(f)}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                    )
                                ) : (
                                    <div className="w-full text-muted-foreground italic text-center border border-dashed border-gray-400 p-10 rounded-xl">
                                        No fields found...
                                    </div>
                                )}
                            </div>
                            <div className="w-full text-center">
                                <Button
                                    variant="default"
                                    className={cn("font-bold")}
                                    onClick={handleSubmit}
                                    disabled={isSubmittingForm}
                                >
                                    SUBMIT RESPONSE
                                </Button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
