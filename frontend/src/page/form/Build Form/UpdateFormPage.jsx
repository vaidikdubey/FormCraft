import React, { useState, useEffect, Children } from "react";
import { useParams } from "react-router-dom";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    closestCorners,
    useDroppable,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { Share2, ArrowLeft, Save } from "lucide-react";

// --- Custom Components ---
import { SidebarDraggableItem } from "./SidebarDraggableItem";
import { SortableFieldCard } from "./SortableFieldCard";
import { PublishDialog } from "./PublishDialog";

// --- Hooks & Utils ---
import { useDebounce } from "@/store/useDebounce";
import { useFormStore } from "@/store/useFormStore";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DroppableCanvas = ({ children, id }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="min-h-50 w-full pb-20">
            {children}
        </div>
    );
};

export const UpdateFormPage = () => {
    const { id } = useParams();

    // --- ZUSTAND STORE ---
    const { form, isFetchingForm, fetchFormById, updateForm, isSavingForm } =
        useFormStore();

    // --- LOCAL STATE ---
    // We keep a local copy for immediate UI updates (drag & drop, typing)
    // This prevents UI lag waiting for server responses
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        allowAnonymous: false,
        fields: [],
        conditions: [],
        isPublished: false,
    });

    const [activeFieldId, setActiveFieldId] = useState(null);
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);

    // Debounce the entire form object (waits 2s after last change)
    const debouncedFormData = useDebounce(formData, 2000);

    // --- 1. FETCH FORM ON LOAD ---
    useEffect(() => {
        if (id) {
            fetchFormById(id);
        }
    }, [id, fetchFormById]);

    // --- 2. SYNC STORE DATA TO LOCAL STATE ---
    // When the store fetches the form, populate the local state
    useEffect(() => {
        if (form) {
            setFormData({
                title: form.title || "",
                description: form.description || "",
                allowAnonymous: form.allowAnonymous || false,
                fields: form.fields || [],
                conditions: form.conditions || [],
                isPublished: form.isPublished || false,
            });
        }
    }, [form]);

    // --- 3. AUTO-SAVE LOGIC ---
    useEffect(() => {
        // Only auto-save if we are not currently fetching and we have a title
        // Also check if formData actually differs from the store 'form' to avoid initial trigger
        if (!isFetchingForm && formData.title && form) {
            saveFormToBackend(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFormData]);

    const saveFormToBackend = async (shouldPublish = false) => {
        // Construct payload
        const payload = { ...formData, isPublished: shouldPublish };

        try {
            // Call Zustand Action
            // Note: Your store updateForm takes (data, id)
            await updateForm(payload, id);

            setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Save failed within component", error);
            // Toast handling is already in your store, but you can add UI specific logic here
        }
    };

    // --- 4. DND SENSORS ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    // --- 5. DRAG HANDLERS ---
    const handleDragStart = (event) => {
        setActiveDragItem(event.active.data.current);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        // A. New Item from Sidebar
        if (active.data.current?.type === "SIDEBAR_ITEM") {
            const type = active.data.current.fieldType;
            const newField = {
                fieldKey: nanoid(10),
                type,
                label: "Untitled Question",
                placeholder: "Enter your answer",
                required: false,
                options: ["Option 1", "Option 2"],
            };

            setFormData((prev) => {
                const newFields = [...prev.fields];

                if (over.id === "canvas-drop-zone") {
                    newFields.push(newField);
                } else {
                    const overIndex = prev.fields.findIndex(
                        (f) => f.fieldKey === over.id
                    );
                    if (overIndex >= 0) {
                        newFields.splice(overIndex + 1, 0, newField);
                    } else {
                        newFields.push(newField);
                    }
                }

                return { ...prev, fields: newFields };
            });
            setActiveFieldId(newField.fieldKey);
        }
        // B. Reorder Existing Items
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

    // --- 6. DATA HELPERS (LOCAL UPDATES) ---
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

    // --- 7. PUBLISH HANDLER ---
    const handlePublish = async () => {
        setIsPublishing(true);
        await saveFormToBackend(true); // true = Trigger Publish logic
        setIsPublishDialogOpen(true);
        setIsPublishing(false);
    };

    // // Loading State
    // if (isFetchingForm) {
    //     return (
    //         <div className="h-screen flex items-center justify-center">
    //             <Loader2 className="animate-spin text-purple-600" />
    //         </div>
    //     );
    // }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex min-h-screen bg-gray-50 flex-col font-sans">
                {/* HEADER */}
                <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
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
                                className="font-bold text-lg border-transparent hover:border-input focus:border-ring h-7 w-75 p-0 shadow-none"
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
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 mr-2">
                            <Switch
                                checked={formData.allowAnonymous}
                                onCheckedChange={(c) =>
                                    setFormData({
                                        ...formData,
                                        allowAnonymous: c,
                                    })
                                }
                            />
                            <Label className="text-sm cursor-pointer">
                                Anonymous
                            </Label>
                        </div>
                        {/* Manual Save Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => saveFormToBackend(false)}
                            disabled={isSavingForm}
                        >
                            <Save size={14} className="mr-2" /> Save
                        </Button>

                        <Button
                            onClick={handlePublish}
                            disabled={isPublishing || isSavingForm}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {isPublishing ? (
                                "Publishing..."
                            ) : (
                                <Share2 className="w-4 h-4 mr-2" />
                            )}
                            Publish
                        </Button>
                    </div>
                </header>

                {/* WORKSPACE */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Main Canvas (Scrollable) */}
                    <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-50/50">
                        <div className="w-full max-w-3xl space-y-4 pb-24">
                            {/* Title Card */}
                            <div className="bg-white rounded-lg border-t-8 border-t-purple-600 shadow-sm p-8">
                                <Input
                                    className="text-4xl font-bold border-none px-0 mb-2 focus-visible:ring-0"
                                    value={formData.title}
                                    readOnly
                                />
                                <Textarea
                                    className="border-none px-0 resize-none focus-visible:ring-0 text-gray-500 text-lg min-h-12.5"
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
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-white/50">
                                                <p className="text-gray-400">
                                                    Your form is empty. Drag
                                                    fields from the right panel.
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

                    {/* Sidebar (Fixed) */}
                    <aside className="w-72 bg-white border-l p-5 overflow-y-auto shadow-sm z-40">
                        <h3 className="font-semibold mb-4 text-xs text-gray-500 uppercase tracking-wider">
                            Drag Elements
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
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

            {/* Drag Overlay (Visual feedback) */}
            <DragOverlay>
                {activeDragItem ? (
                    <div className="bg-white p-4 rounded shadow-xl border w-60 opacity-90 cursor-grabbing flex items-center gap-2">
                        <span className="font-bold">Moving item...</span>
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
