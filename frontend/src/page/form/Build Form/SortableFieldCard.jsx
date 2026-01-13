import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, PlusCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { LogicPopover } from "./LogicPopover";

export const SortableFieldCard = ({
    field,
    allFields,
    conditions,
    isActive,
    onActivate,
    onUpdate,
    onDelete,
    onAddCondition,
    onRemoveCondition,
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: field.fieldKey });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="relative group mb-3">
            {!isActive && (
                <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={onActivate}
                />
            )}

            <Card
                className={`transition-all ${
                    isActive
                        ? "border-l-4 border-l-pink-500 shadow-lg ring-1 ring-neutral-300 dark:ring-neutral-600"
                        : "hover:border-pink-300"
                }`}
            >
                <CardContent className="p-4 flex gap-3">
                    <div
                        {...attributes}
                        {...listeners}
                        className="mt-2 cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none touch-none"
                    >
                        <GripVertical size={20} />
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex gap-3">
                            <Input
                                value={field.label}
                                onChange={(e) =>
                                    onUpdate({ label: e.target.value })
                                }
                                className={`flex-1 ${
                                    isActive
                                        ? ""
                                        : "border-transparent px-0 font-medium text-lg pointer-events-none"
                                }`}
                                placeholder="Question Label"
                            />
                            {isActive && (
                                <Select
                                    value={field.type}
                                    onValueChange={(val) =>
                                        onUpdate({ type: val })
                                    }
                                >
                                    <SelectTrigger className="w-35">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TEXT">
                                            Short Text
                                        </SelectItem>
                                        <SelectItem value="TEXTAREA">
                                            Long Text
                                        </SelectItem>
                                        <SelectItem value="NUMBER">
                                            Number
                                        </SelectItem>
                                        <SelectItem value="EMAIL">
                                            Email
                                        </SelectItem>
                                        <SelectItem value="DROPDOWN">
                                            Dropdown
                                        </SelectItem>
                                        <SelectItem value="RADIO">
                                            Single Choice
                                        </SelectItem>
                                        <SelectItem value="CHECKBOX">
                                            Checkbox
                                        </SelectItem>
                                        <SelectItem value="DATE">
                                            Date
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {!isActive && (
                            <p className="text-sm text-gray-400 pl-1">
                                {field.placeholder || "No placeholder set"}
                            </p>
                        )}

                        {isActive && (
                            <>
                                <Input
                                    value={field.placeholder}
                                    onChange={(e) =>
                                        onUpdate({
                                            placeholder: e.target.value,
                                        })
                                    }
                                    placeholder="Placeholder text..."
                                />

                                {["DROPDOWN", "RADIO", "CHECKBOX"].includes(
                                    field.type
                                ) && (
                                    <div className="space-y-2 pl-3 border-l-2 border-gray-100">
                                        <Label className="text-xs text-gray-500">
                                            Options
                                        </Label>
                                        {field.options?.map((opt, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="w-3 h-3 border rounded-full border-gray-300" />
                                                <Input
                                                    value={opt}
                                                    className="h-8"
                                                    onChange={(e) => {
                                                        const newOpts = [
                                                            ...field.options,
                                                        ];
                                                        newOpts[idx] =
                                                            e.target.value;
                                                        onUpdate({
                                                            options: newOpts,
                                                        });
                                                    }}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                                                    onClick={() =>
                                                        onUpdate({
                                                            options:
                                                                field.options.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        idx
                                                                ),
                                                        })
                                                    }
                                                >
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-pink-400 h-8 text-xs"
                                            onClick={() =>
                                                onUpdate({
                                                    options: [
                                                        ...(field.options ||
                                                            []),
                                                        `Option ${
                                                            (field.options
                                                                ?.length || 0) +
                                                            1
                                                        }`,
                                                    ],
                                                })
                                            }
                                        >
                                            <PlusCircle
                                                size={14}
                                                className="mr-2"
                                            /> Add Option
                                        </Button>
                                    </div>
                                )}

                                <div className="pt-4 border-t flex justify-between items-center mt-2">
                                    <LogicPopover
                                        currentField={field}
                                        allFields={allFields}
                                        conditions={conditions}
                                        onAddCondition={onAddCondition}
                                        onRemoveCondition={onRemoveCondition}
                                    />
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={field.required}
                                                onCheckedChange={(c) =>
                                                    onUpdate({ required: c })
                                                }
                                            />
                                            <Label>Required</Label>
                                        </div>
                                        <div className="h-6 w-px bg-gray-200" />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:bg-red-50"
                                            onClick={onDelete}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
