import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { Navbar } from "./Navbar";
import { useFormStore } from "@/store/useFormStore";
import { timeAgo } from "@/utils/timeAgo";
import { ExternalLink, Trash2, Edit, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

//Shadcn components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

export const HomePage = () => {
    const navigate = useNavigate();

    const {
        forms,
        fetchAllForms,
        isDeletingForm,
        deleteForm,
        updateForm,
        publishForm,
        isPublishing,
        isCloningForm,
        cloneForm,
    } = useFormStore();

    const { authUser } = useAuthStore();

    useEffect(() => {
        fetchAllForms();
    }, [fetchAllForms]);

    const copyToClipboard = (url) => {
        if (!url) {
            toast.error("Form not published");
            return;
        }

        navigator.clipboard.writeText(`${window.location.origin}/form/${url}`);
        toast.success("Form URL Copied");
    };

    const handlePublishedChange = (checked, id) => {
        publishForm({ isPublished: checked }, id);
    };

    const handleFormUpdate = (data, id) => {
        updateForm(data, id);
    };

    const handleFormClone = async (id) => {
        const result = await cloneForm(id);

        if (result)
            navigate(`${window.location.origin}/update/${result.data._id}`);
    };

    return (
        <div className="flex flex-col w-full h-full items-center">
            <Navbar />
            <main
                className={cn(
                    "flex-1 flex flex-col justify-center items-center text-3xl font-bold overflow-y-auto"
                )}
            >
                {forms?.length > 0 ? (
                    <div className="h-full max-w-6xl my-15 overflow-y-auto no-scrollbar border-8 rounded-xl p-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead
                                        className={cn(
                                            "text-hover-text font-semibold"
                                        )}
                                    >
                                        Form Title
                                    </TableHead>
                                    <TableHead
                                        className={cn("text-hover-text")}
                                    >
                                        Description
                                    </TableHead>
                                    <TableHead
                                        className={cn("text-hover-text")}
                                    >
                                        Published
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            "text-hover-text text-right"
                                        )}
                                    >
                                        Edit Response
                                    </TableHead>
                                    <TableHead
                                        className={cn(
                                            "text-hover-text text-right"
                                        )}
                                    >
                                        Anonymous
                                    </TableHead>
                                    <TableHead
                                        className={cn("text-hover-text")}
                                    >
                                        Link
                                    </TableHead>
                                    <TableHead
                                        className={cn("text-hover-text")}
                                    >
                                        Created At
                                    </TableHead>
                                    <TableHead
                                        className={cn("text-hover-text")}
                                    >
                                        Updated At
                                    </TableHead>
                                    <TableHead
                                        className={cn("text-hover-text")}
                                    >
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {forms?.map((form) => (
                                    <TableRow key={form._id}>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleFormClone(form._id)
                                                }
                                                disabled={isCloningForm}
                                            >
                                                <Copy />
                                            </Button>
                                        </TableCell>
                                        <TableCell
                                            className={cn("font-semibold")}
                                        >
                                            {form.title}
                                        </TableCell>
                                        <TableCell
                                            className={cn("font-normal")}
                                        >
                                            {form.description}
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                id="published"
                                                checked={form.isPublished}
                                                onCheckedChange={(c) =>
                                                    handlePublishedChange(
                                                        c,
                                                        form._id
                                                    )
                                                }
                                                disabled={isPublishing}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                id="editing"
                                                checked={form.allowEditing}
                                                onCheckedChange={(checked) => {
                                                    if (
                                                        authUser?.data?.role ===
                                                        "free"
                                                    ) {
                                                        return toast.error(
                                                            "Upgrade to PRO for editing feature"
                                                        );
                                                    }

                                                    handleFormUpdate(
                                                        {
                                                            allowEditing:
                                                                checked,
                                                        },
                                                        form._id
                                                    );
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                id="anonymous"
                                                checked={form.allowAnonymous}
                                                onCheckedChange={(c) =>
                                                    handleFormUpdate(
                                                        { allowAnonymous: c },
                                                        form._id
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        form.publicURL
                                                    )
                                                }
                                            >
                                                <ExternalLink />
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {timeAgo(form.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            {timeAgo(form.updatedAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-center items-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        navigate(
                                                            `${window.location.origin}/update/${form._id}`
                                                        )
                                                    }
                                                >
                                                    <Edit />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you
                                                                absolutely sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                <b>
                                                                    {form.title}
                                                                </b>{" "}
                                                                form and all its
                                                                responses will
                                                                be permanently
                                                                deleted.
                                                                <br />
                                                                <br />
                                                                <span className="font-bold text-red-500">
                                                                    This action
                                                                    cannot be
                                                                    undone.
                                                                </span>
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    deleteForm(
                                                                        form._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeletingForm
                                                                }
                                                            >
                                                                {isDeletingForm
                                                                    ? "Deleting..."
                                                                    : "Delete Form"}
                                                            </Button>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h3>No forms found... Create one now!</h3>
                        <Button
                            variant="default"
                            className={cn("font-bold hover:text-hover-text")}
                        >
                            + Create New Form
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
};
