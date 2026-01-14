import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor,
    closestCorners,
    useDroppable,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { Share2, ArrowLeft, Save, Loader2, Crown } from "lucide-react";
import { useDebounce } from "@/store/useDebounce";
import { useFormStore } from "@/store/useFormStore";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

//Custom Components
import { SidebarDraggableItem } from "./SidebarDraggableItem";
import { SortableFieldCard } from "./SortableFieldCard";
import { PublishDialog } from "./PublishDialog";

//Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

const DroppableCanvas = ({ children, id }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="w-full pb-20">
            {children}
        </div>
    );
};

export const UpdateFormPage = () => {
    const { id } = useParams();

    const { form, isFetchingForm, fetchFormById, updateForm, isSavingForm } =
        useFormStore();

    const { authUser } = useAuthStore();

    //For local updates -> To make UI smooth
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        allowAnonymous: false,
        fields: [],
        conditions: [],
        isPublished: false,
        allowEditing: false,
    });

    const [activeFieldId, setActiveFieldId] = useState(null);
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);

    // Debounce the entire form object
    const debouncedFormData = useDebounce(formData, 2000);

    useEffect(() => {
        if (id) {
            fetchFormById(id);
        }
    }, [id, fetchFormById]);

    useEffect(() => {
        if (form) {
            setFormData({
                title: form?.title || "",
                description: form?.description || "",
                allowAnonymous: form.allowAnonymous || false,
                fields: form.fields || [],
                conditions: form.conditions || [],
                isPublished: form.isPublished || false,
                allowEditing: form.allowEditing || false,
            });
        }
    }, [form]);

    //AUTO-SAVE LOGIC
    useEffect(() => {
        // Only auto-save if we are not currently fetching and we have a title
        // Also check if formData actually differs from the store 'form' to avoid initial trigger
        if (!isFetchingForm && formData.title && form) {
            saveFormToBackend(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFormData]);

    const saveFormToBackend = async (shouldPublish = false) => {
        const payload = { ...formData, isPublished: shouldPublish };

        try {
            await updateForm(payload, id);

            setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Save failed within component", error);
        }
    };

    //Sensor for detecting drag movement
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), //Pixes before activation
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        })
    );

    const handleDragStart = (event) => {
        setActiveDragItem(event.active.data.current);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        //New Item from Sidebar
        if (active.data.current?.type === "SIDEBAR_ITEM") {
            const type = active.data.current.fieldType;

            setFormData((prev) => {
                const newField = {
                    fieldKey: nanoid(10),
                    type,
                    label: "Untitled Question",
                    placeholder: "Enter your response",
                    required: false,
                    options: ["Option 1", "Option 2"],
                };

                const newFields = [...prev.fields];

                if (newFields.some((f) => f.fieldKey === newField.fieldKey))
                    return prev;

                if (over.id === "canvas-drop-zone") {
                    newFields.push(newField);
                } else {
                    const overIndex = prev.fields.findIndex(
                        (f) => f.fieldKey === over.id
                    );
                    if (overIndex >= 0) {
                        newFields.splice(overIndex, 0, newField);
                    } else {
                        newFields.push(newField);
                    }
                }

                setTimeout(() => setActiveFieldId(newField.fieldKey), 0);

                return { ...prev, fields: newFields };
            });
        }
        //Reorder Existing Items
        else if (active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.fields.findIndex(
                    (f) => f.fieldKey === active.id
                );
                const newIndex = prev.fields.findIndex(
                    (f) => f.fieldKey === over.id
                );
                // Only reorder if valid indices
                if (oldIndex !== -1 && newIndex !== -1) {
                    return {
                        ...prev,
                        fields: arrayMove(prev.fields, oldIndex, newIndex),
                    };
                }
                return prev;
            });
        }
    };

    const updateField = (key, updates) => {
        setFormData((prev) => ({
            ...prev,
            fields: prev.fields.map((f) =>
                f.fieldKey === key ? { ...f, ...updates } : f
            ),
        }));
    };

    const deleteField = (key) => {
        setFormData((prev) => ({
            ...prev,
            fields: prev.fields.filter((f) => f.fieldKey !== key),
            conditions: prev.conditions.filter(
                (c) => c.sourceFieldId !== key && c.targetFieldId !== key
            ),
        }));
    };

    const addCondition = (cond) => {
        setFormData((prev) => ({
            ...prev,
            conditions: [...prev.conditions, cond],
        }));
    };

    const removeCondition = (cond) => {
        setFormData((prev) => ({
            ...prev,
            conditions: prev.conditions.filter((c) => c !== cond),
        }));
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        await saveFormToBackend(true); // true = Trigger Publish logic
        setIsPublishDialogOpen(true);
        setIsPublishing(false);
    };

    if (isFetchingForm) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full w-full bg-background text-foreground flex-col font-sans max-w-7xl mx-auto">
                {/* HEADER */}
                <header className="bg-background text-foreground border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm flex-wrap gap-4 md:gap-0">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div className="flex flex-col">
                            <Input
                                className="font-bold text-xl border-transparent hover:border-pink-200 focus:border-r-pink-200 h-7 p-0 shadow-none mb-2"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                {isSavingForm ? (
                                    <>Saving...</>
                                ) : lastSaved ? (
                                    `Saved ${lastSaved}`
                                ) : (
                                    "Draft"
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 md:mr-2">
                            <Switch
                                checked={formData.allowAnonymous}
                                onCheckedChange={(c) =>
                                    setFormData({
                                        ...formData,
                                        allowAnonymous: c,
                                    })
                                }
                                className={cn(
                                    "data-[state=unchecked]:bg-neutral-500 data-[state=checked]:bg-pink-500 border-2 border-transparent focus-visible:ring-pink-600"
                                )}
                            />
                            <Label className="text-sm">Anonymous</Label>
                        </div>
                        {authUser?.data?.role === "paid" && (
                            <div className="flex items-center gap-2 md:mr-2">
                                <Switch
                                    checked={formData.allowEditing}
                                    onCheckedChange={(c) =>
                                        setFormData({
                                            ...formData,
                                            allowEditing: c,
                                        })
                                    }
                                    className={cn(
                                        "data-[state=unchecked]:bg-neutral-500 data-[state=checked]:bg-pink-500 border-2 border-transparent focus-visible:ring-pink-600"
                                    )}
                                />
                                <Label className="text-sm">Edit Response</Label>
                            </div>
                        )}
                        {authUser?.data?.role === "free" && (
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <Button asChild variant="outline">
                                        <Link to={"/upgrade"}>
                                            Edit Response{" "}
                                            <Crown className="text-amber-400" />
                                        </Link>
                                    </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-fit">
                                    Upgrade to unlock this feature!
                                </HoverCardContent>
                            </HoverCard>
                        )}
                        {/* Manual Save Button */}
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => saveFormToBackend(false)}
                            disabled={isSavingForm}
                        >
                            <Save size={14} className="mr-2" /> Save
                        </Button>

                        <div className="flex flex-col gap-1">
                            <Button
                                onClick={handlePublish}
                                disabled={isPublishing || isSavingForm}
                                className="bg-pink-500 hover:bg-pink-600"
                            >
                                {isPublishing ? (
                                    "Publishing..."
                                ) : (
                                    <Share2 className="w-4 h-4 mr-2" />
                                )}
                                Publish
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                *re-publish after editing
                            </p>
                        </div>
                    </div>
                </header>

                {/* WORKSPACE */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Main Canvas (Scrollable) */}
                    <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-background no-scrollbar">
                        <div className="w-full max-w-3xl space-y-4 pb-24">
                            {/* Title Card */}
                            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border-t-8 border-t-pink-500 shadow-sm p-8">
                                <Input
                                    className="text-4xl font-bold border-none px-0 mb-2 focus-visible:ring-0"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <Textarea
                                    className="border-none px-0 resize-none focus-visible:ring-0 text-foreground/50 text-lg min-h-12.5"
                                    placeholder="Form description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Fields List */}
                            <SortableContext
                                items={formData.fields.map((f) => f.fieldKey)}
                                strategy={verticalListSortingStrategy}
                            >
                                <DroppableCanvas id="canvas-drop-zone">
                                    <div className="space-y-4">
                                        {formData.fields.length === 0 && (
                                            <div className="border-2 border-dashed border-gray-400 rounded-lg p-12 text-center bg-background">
                                                <p className="text-gray-400">
                                                    Your form is empty. Drag
                                                    fields from the panel.
                                                </p>
                                            </div>
                                        )}
                                        {formData.fields.map((field) => (
                                            <SortableFieldCard
                                                key={field.fieldKey}
                                                field={field}
                                                allFields={formData.fields}
                                                conditions={formData.conditions}
                                                isActive={
                                                    activeFieldId ===
                                                    field.fieldKey
                                                }
                                                onActivate={() =>
                                                    setActiveFieldId(
                                                        field.fieldKey
                                                    )
                                                }
                                                onUpdate={(updates) =>
                                                    updateField(
                                                        field.fieldKey,
                                                        updates
                                                    )
                                                }
                                                onDelete={() =>
                                                    deleteField(field.fieldKey)
                                                }
                                                onAddCondition={addCondition}
                                                onRemoveCondition={
                                                    removeCondition
                                                }
                                            />
                                        ))}
                                    </div>
                                </DroppableCanvas>
                            </SortableContext>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="hidden md:block w-fit bg-backgroun border-l-2 p-5 overflow-y-auto shadow-sm z-40">
                        <h3 className="font-semibold mb-4 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Field Types
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <SidebarDraggableItem
                                type="TEXT"
                                label="Short Text"
                            />
                            <SidebarDraggableItem
                                type="TEXTAREA"
                                label="Long Text"
                            />
                            <SidebarDraggableItem
                                type="NUMBER"
                                label="Number"
                            />
                            <SidebarDraggableItem type="EMAIL" label="Email" />
                            <SidebarDraggableItem
                                type="DROPDOWN"
                                label="Dropdown"
                            />
                            <SidebarDraggableItem
                                type="RADIO"
                                label="Single Choice"
                            />
                            <SidebarDraggableItem
                                type="CHECKBOX"
                                label="Multiple"
                            />
                            <SidebarDraggableItem type="DATE" label="Date" />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeDragItem ? (
                    <div className="bg-background p-4 rounded shadow-xl border w-60 opacity-90 cursor-grabbing flex items-center gap-2">
                        <span className="font-bold">
                            Release to add field...
                        </span>
                    </div>
                ) : null}
            </DragOverlay>

            <PublishDialog
                open={isPublishDialogOpen}
                onOpenChange={setIsPublishDialogOpen}
                form={formData}
            />
        </DndContext>
    );
};
