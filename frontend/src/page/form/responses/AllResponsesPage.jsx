import { cn } from "@/lib/utils";
import { useFormStore } from "@/store/useFormStore";
import { useResponseStore } from "@/store/useResponseStore";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";
import { useAuthStore } from "@/store/useAuthStore";
import { Crown, Trash2 } from "lucide-react";

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
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const AllResponsesPage = () => {
    const { formId } = useParams();

    const {
        getAllResponses,
        allResponses,
        deleteResponse,
        isDeletingResponse,
        deleteAllResponses,
        isDeletingAllResponses,
        exportResponse,
    } = useResponseStore();

    const { fetchFormById, form, getFormStats, formStats } = useFormStore();

    const { authUser } = useAuthStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [allDeleteDialog, setAllDeleteDialog] = useState(false);

    useEffect(() => {
        getAllResponses(formId);
        fetchFormById(formId);
        getFormStats(formId);
        //eslint-disable-next-line
    }, [formId]);

    const handleResponseDelete = async (id) => {
        const result = await deleteResponse(id);

        if (result) setIsDialogOpen(false);
    };

    const handleAllResponsesDelete = async () => {
        const result = await deleteAllResponses(formId);

        if (result) setAllDeleteDialog(false);
    };

    const handleResponseExport = () => {
        exportResponse(formId);
    };

    return (
        <div className="h-full w-full flex flex-col items-center bg-background text-foreground">
            <div className="w-full flex flex-col items-center justify-center gap-5 px-10">
                <h1 className="text-3xl text-hover-text font-bold">
                    {form?.title}
                </h1>
                <p className="text-center text-muted-foreground">
                    {form?.description}
                </p>

                <div className="w-full flex justify-around text-xl">
                    <p>
                        <span className="font-semibold text-pink-600 dark:text-pink-300">
                            Total Responses:{" "}
                        </span>{" "}
                        {formStats?.totalResponses}
                    </p>
                    <p>
                        <span className="font-semibold text-pink-600 dark:text-pink-300">
                            Last Response:{" "}
                        </span>
                        {timeAgo(formStats?.lastResponse?.createdAt)}
                    </p>
                    <p>
                        <span className="font-semibold text-pink-600 dark:text-pink-300">
                            Weekly Response Count:{" "}
                        </span>
                        {formStats?.weeklyData}
                    </p>
                </div>
            </div>
            <div
                className={cn(
                    "flex-1 px-3 w-7xl flex justify-center items-center mx-20"
                )}
            >
                <Table className={cn("border-2")}>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                className={cn("text-hover-text font-bold")}
                            >
                                User
                            </TableHead>
                            {form?.fields?.length > 0 ? (
                                form?.fields?.map((field) => (
                                    <TableHead
                                        key={field.fieldKey}
                                        className={cn("text-hover-text")}
                                    >
                                        {field.label}
                                    </TableHead>
                                ))
                            ) : (
                                <div>No fields</div>
                            )}
                            <TableHead className={cn("text-hover-text")}>
                                Delete
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    {allResponses?.data?.length > 0 ? (
                        <TableBody>
                            {allResponses?.data?.map((d) => {
                                const responsesArray = form?.fields
                                    ?.map((field) => field.fieldKey)
                                    .map((key) =>
                                        d.answer[key] ? d.answer[key] : "-"
                                    );

                                return (
                                    <TableRow key={d._id}>
                                        <TableCell
                                            className={cn(
                                                "hover:text-hover-text hover:underline"
                                            )}
                                        >
                                            <Link
                                                to={`/response/${formId}/${d._id}`}
                                            >
                                                {d.userId
                                                    ? d.userId
                                                    : "Anonymous"}
                                            </Link>
                                        </TableCell>
                                        {responsesArray.map((ans) => (
                                            <TableCell>{ans}</TableCell>
                                        ))}
                                        <TableRow>
                                            <AlertDialog
                                                open={isDialogOpen}
                                                onOpenChange={setIsDialogOpen}
                                            >
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
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This response will
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
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleResponseDelete(
                                                                    d._id
                                                                );
                                                            }}
                                                            disabled={
                                                                isDeletingResponse
                                                            }
                                                        >
                                                            {isDeletingResponse
                                                                ? "Deleting..."
                                                                : "Delete Response"}
                                                        </Button>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableRow>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow className={cn("text-center w-full")}>
                                No responses found...
                            </TableRow>
                        </TableBody>
                    )}
                </Table>
            </div>
            <div className="flex items-center justify-center gap-5">
                <AlertDialog
                    open={allDeleteDialog}
                    onOpenChange={setAllDeleteDialog}
                >
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            Delete All Responses
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will permanently delete all the
                                responses for <b>{form?.title}</b> form
                                <br />
                                <br />
                                <span className="font-bold text-red-500">
                                    This action cannot be undone.
                                </span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleAllResponsesDelete();
                                }}
                                disabled={isDeletingAllResponses}
                            >
                                {isDeletingAllResponses
                                    ? "Deleting..."
                                    : "Delete All Response"}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {allResponses?.data?.length > 0 && (
                    <Button onClick={handleResponseExport}>
                        {authUser?.data?.role !== "free" ? (
                            <span className="font-bold">
                                Export Responses as CSV
                            </span>
                        ) : (
                            <span className="flex justify-center items-center font-bold gap-2">
                                Export Response{" "}
                                {<Crown className="text-amber-400" />}
                            </span>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};
