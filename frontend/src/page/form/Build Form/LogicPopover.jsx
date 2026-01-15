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
        operator: "equals",
        value: "",
        action: "SHOW",
        targetFieldId: "",
    });

    console.log(conditions);

    const myConditions = conditions.filter(
        (c) => c.sourceFieldId === currentField.fieldKey
    );
    const availableTargets = allFields.filter(
        (f) => f.fieldKey !== currentField.fieldKey
    );

    const isSelectionField = ["dropdown", "checkbox"].includes(
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
                            ? "text-pink-500 bg-purple-50"
                            : "text-gray-400"
                    }`}
                >
                    <GitFork size={16} /> Logic{" "}
                    {myConditions.length > 0 && `(${myConditions.length})`}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-fit p-0 shadow-xl " align="start">
                <div className="p-3 border-b border-gray-400 bg-gray-50/50 font-medium text-sm flex items-center gap-2">
                    <GitFork size={14} className="text-pink-500" /> Logic Rules
                </div>

                <ScrollArea className="max-h-50 overflow-y-auto no-scrollbar w-fit md:w-full p-3">
                    {myConditions.length === 0 ? (
                        <p className="text-center text-xs text-gray-200 py-2 italic">
                            No rules yet.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {myConditions.map((cond, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-neutral-100 text-black border rounded p-2 text-xs shadow-sm"
                                >
                                    <div className="flex flex-col">
                                        <span>
                                            If answer{" "}
                                            <b>
                                                {cond.operator === "not_equals" ? "NOT EQUALS" : cond.operator.toUpperCase()} "{cond.value}
                                                "
                                            </b>
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
                                        className="h-6 w-6 text-red-600 hover:text-red-500"
                                        onClick={() => onRemoveCondition(cond)}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-3 border-t border-neutral-300 bg-background text-foreground space-y-3">
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
                            <Label className="text-[10px]">Condtion</Label>
                            <Select
                                value={newRule.operator}
                                onValueChange={(v) =>
                                    setNewRule({ ...newRule, operator: v })
                                }
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="equals">
                                        Equals
                                    </SelectItem>
                                    <SelectItem value="not_equals">
                                        Not Equals
                                    </SelectItem>
                                    <SelectItem value="contains">
                                        Contains
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
                        className="w-full h-8 mt-1 gap-1 text-xs bg-pink-400 hover:bg-pink-600 text-foreground"
                    >
                        <Plus size={12} /> Add Rule
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
