import { useFormStore } from "@/store/useFormStore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//Shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const PublicViewPage = () => {
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

    const handleInputChange = (fieldId, e, type) => {
        let finalValue;

        if (type === "checkbox") {
            finalValue = e.target.checked;
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

        if (compareFn(responses[sourceFieldId], value)) {
            return actions === "show" ? true : false;
        }

        return actions === "show" ? false : true;
    };

    const renderField = (field) => {
        const commonProps = {
            id: field.id,
            required: field.required || false,
            className: "w-full p-2 border rounded-md",
            placeholder: field.placeholder,
            onChange: (e) => handleInputChange(field.id, e, field.type),
        };

        switch (field.type) {
            case "text":
                return <input type="text" {...commonProps} />;
            case "email":
                return <input type="email" {...commonProps} />;
            case "date":
                return <input type="date" {...commonProps} />;
            case "dropdown":
                return (
                    <select {...commonProps}>
                        <option value="">Select an option...</option>
                        {field.options.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                );
            case "checkbox":
                return (
                    <div>
                        <input type="checkbox" {...commonProps} />
                        <label>{field.label}</label>
                    </div>
                );

            default:
                return null;
        }
    };

    useEffect(() => {
        getPublicView(url);
    }, [url]);

    console.log(formPublicView);

    return (
        <div className="h-full w-full flex justify-center items-center bg-background text-foreground font-sans">
            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-background no-scrollbar">
                    <div className="w-full max-w-3xl space-y-4 pb-24">
                        <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border-t-8 border-t-pink-500 shadow-sm p-8">
                            <h1 className="font-bold text-2xl mb-2">
                                {formPublicView?.title}
                            </h1>
                            <p className="text-muted-foreground">
                                {formPublicView?.description
                                    ? formPublicView?.description
                                    : "No form description provided by owner"}
                            </p>
                        </div>
                        <div className="border border-gray-400 rounded-lg p-12 text-center bg-background">
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
                                                            <h3>{f.label}</h3>
                                                            {renderField(f)}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                )
                            ) : (
                                <div className="text-muted-foreground italic text-center">
                                    No fields found...
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
