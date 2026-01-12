import React, { useState } from "react";
import { GitFork, Plus, X } from "lucide-react";

//Shadcn components
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LogicPopover = ({
    currentField,
    allFields,
    conditions,
    onAddCondition,
    onRemoveCondition,
}) => {
    const [open, setOpen] = useState(false);
    const [newRule, setNewRule] = useState({
        operator: "EQUALS",
        value: "",
        action: "SHOW",
        targetFieldId: "",
    });

    const myConditions = conditions.filter(
        (c) => c.sourceFieldId === currentField.fieldKey
    );
    const availableTargets = allFields.filter(
        (f) => f.fieldKey !== currentField.fieldKey
    );
    const isSelectionField = ["DROPDOWN", "CHECKBOX", "RADIO"].includes(
        currentField.type
    );

    const handleAdd = () => {
        if (!newRule.targetFieldId || !newRule.value) return;
        onAddCondition({ sourceFieldId: currentField.fieldKey, ...newRule });
        setNewRule({ ...newRule, value: "", targetFieldId: "" });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={myConditions.length > 0 ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${
                        myConditions.length > 0
                            ? "text-purple-600 bg-purple-50"
                            : "text-gray-500"
                    }`}
                >
                    <GitFork size={16} /> Logic{" "}
                    {myConditions.length > 0 && `(${myConditions.length})`}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-100 p-0 shadow-xl border-purple-100"
                align="start"
            >
                <div className="p-3 border-b bg-gray-50/50 font-medium text-sm flex items-center gap-2">
                    <GitFork size={14} className="text-purple-600" /> Logic
                    Rules
                </div>

                <ScrollArea className="max-h-50 p-3">
                    {myConditions.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 py-2 italic">
                            No rules yet.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {myConditions.map((cond, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-white border rounded p-2 text-xs shadow-sm"
                                >
                                    <div className="flex flex-col">
                                        <span>
                                            If answer is <b>"{cond.value}"</b>
                                        </span>
                                        <span className="text-gray-500">
                                            Then <b>{cond.action}</b> "
                                            {
                                                allFields.find(
                                                    (f) =>
                                                        f.fieldKey ===
                                                        cond.targetFieldId
                                                )?.label
                                            }
                                            "
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-400"
                                        onClick={() => onRemoveCondition(cond)}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-3 border-t bg-gray-50 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[10px]">If Answer Is</Label>
                            {isSelectionField ? (
                                <Select
                                    value={newRule.value}
                                    onValueChange={(v) =>
                                        setNewRule({ ...newRule, value: v })
                                    }
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentField.options?.map((opt, i) => (
                                            <SelectItem key={i} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    className="h-8 text-xs"
                                    placeholder="Value..."
                                    value={newRule.value}
                                    onChange={(e) =>
                                        setNewRule({
                                            ...newRule,
                                            value: e.target.value,
                                        })
                                    }
                                />
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px]">Then</Label>
                            <Select
                                value={newRule.action}
                                onValueChange={(v) =>
                                    setNewRule({ ...newRule, action: v })
                                }
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SHOW">Show</SelectItem>
                                    <SelectItem value="HIDE">Hide</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[10px]">Target Field</Label>
                        <Select
                            value={newRule.targetFieldId}
                            onValueChange={(v) =>
                                setNewRule({ ...newRule, targetFieldId: v })
                            }
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select Field..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTargets.map((f) => (
                                    <SelectItem
                                        key={f.fieldKey}
                                        value={f.fieldKey}
                                    >
                                        {f.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="w-full h-8 mt-1 gap-1 text-xs bg-purple-600 hover:bg-purple-700"
                    >
                        <Plus size={12} /> Add Rule
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
