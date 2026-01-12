import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
    Type,
    AlignLeft,
    Hash,
    Mail,
    ChevronDown,
    CircleDot,
    CheckSquare,
    Calendar,
    HelpCircle,
} from "lucide-react";

const iconMap = {
    TEXT: Type,
    TEXTAREA: AlignLeft,
    NUMBER: Hash,
    EMAIL: Mail,
    DROPDOWN: ChevronDown,
    RADIO: CircleDot,
    CHECKBOX: CheckSquare,
    DATE: Calendar,
};

export const SidebarDraggableItem = ({ type, label }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: { type: "SIDEBAR_ITEM", fieldType: type },
    });

    const IconComponent = iconMap[type] || HelpCircle;
    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className={cn(
                "flex flex-col items-center justify-center p-4 bg-white border rounded-lg cursor-grab hover:shadow-md hover:border-purple-200 transition-all active:cursor-grabbing"
            )}
        >
            <IconComponent className="mb-2 text-gray-500" size={24} />
            <span className="text-xs font-medium text-gray-700">{label}</span>
        </div>
    );
};
