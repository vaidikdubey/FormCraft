import React, { useEffect, useState, useRef } from "react";
import { useFormStore } from "@/store/useFormStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useResponseStore } from "@/store/useResponseStore";
import { ExternalLink } from "lucide-react";

//Shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export const EditResponsePage = () => {
    const { url, responseId } = useParams();

    const navigate = useNavigate();

    const { isSubmittingForm, submitForm, getResponse, response } =
        useResponseStore();

    const { formPublicView, getPublicView } = useFormStore();

    useEffect(() => {
        getPublicView(url);
        getResponse(responseId);
        //eslint-disable-next-line
    }, [url, responseId]);

    const operationFn = {
        equals: (a, b) => a === b,
        not_equals: (a, b) => a !== b,
        contains: (a, b) => String(a).includes(String(b)),
    };

    const isResponseInitialized = useRef(false);

    const [responses, setResponses] = useState({});

    const targetFieldsArray = formPublicView?.conditions?.map(
        (cond) => cond.targetFieldId,
    );

    const handleInputChange = (fieldId, finalValue) => {
        setResponses((prev) => ({ ...prev, [fieldId]: finalValue }));
    };

    const isTargetField = (field) => {
        if (!targetFieldsArray.includes(field.fieldKey)) return true;

        const conditionObject =
            formPublicView?.conditions?.find(
                (cond) => cond.targetFieldId === field.fieldKey,
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

    useEffect(() => {
        if (response?.data?.answer && !isResponseInitialized.current) {
            setResponses(response?.data?.answer);
            isResponseInitialized.current = true;
        }
    }, [response]);

    useEffect(() => {
        isResponseInitialized.current = false;
    }, [responseId]);

    const renderField = (field) => {
        // const userResponse = response?.data?.answer;

        const currentVal = responses[field?.fieldKey] || "";

        const commonProps = {
            id: field.id,
            required: field?.required,
            className: cn("w-full p-2 border rounded-md"),
            placeholder: field?.placeholder,
            onChange: (e) => handleInputChange(field.fieldKey, e.target.value),
        };

        switch (field.type) {
            case "text":
                return (
                    <Input type="text" value={currentVal} {...commonProps} />
                );
            case "email":
                return (
                    <Input type="email" value={currentVal} {...commonProps} />
                );
            case "date":
                return (
                    <Input type="date" value={currentVal} {...commonProps} />
                );
            case "dropdown":
                return (
                    <select
                        {...commonProps}
                        value={currentVal}
                        className={cn(
                            "bg-white dark:bg-background text-foreground",
                        )}
                    >
                        {field.options.map((opt) => (
                            <option
                                key={opt}
                                value={opt}
                                className={cn(
                                    "bg-white dark:bg-background text-foreground",
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
                            const selectedValue = currentVal ?? [];
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
                                        onCheckedChange={(checked) => {
                                            const next = checked ? [opt] : [];
                                            handleInputChange(
                                                field.fieldKey,
                                                next,
                                            );
                                        }}
                                        required={field?.required}
                                        placeholder={field?.placeholder}
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

    const handleSubmit = async () => {
        const result = await submitForm(responses, formPublicView._id);

        if (result.success) {
            setTimeout(() => {
                navigate(
                    `/thankyou/${url}/${result.data.data._id}/${formPublicView._id}`,
                    {
                        replace: true,
                    },
                );
            }, 0);
        }
    };

    return (
        <div className="flex h-full w-full bg-background text-foreground flex-col font-sans max-w-7xl mx-auto">
            <Button
                asChild
                variant="secondary"
                className={cn(
                    "hidden lg:block absolute left-8 top-9 bg-foreground text-background hover:text-hover-text font-semibold",
                )}
            >
                <Link to={`${window.location.origin}/login`}>Login</Link>
            </Button>
            <Button
                asChild
                variant="outline"
                size="icon-sm"
                className={cn(
                    "flex items-center jusify-center lg:hidden absolute top-3 left-2",
                )}
            >
                <Link to={`${window.location.origin}/login`}>
                    <ExternalLink />
                </Link>
            </Button>
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
                                            ),
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
