import { cn } from "@/lib/utils";
import { useFormStore } from "@/store/useFormStore";
import { useResponseStore } from "@/store/useResponseStore";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { timeAgo } from "@/utils/timeAgo";
import { useAuthStore } from "@/store/useAuthStore";
import { Crown, Trash2, ArrowLeft } from "lucide-react";

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
        <div className="h-full w-full flex flex-col items-center bg-background text-foreground overflow-y-auto pb-10">
            <Button
                variant="ghost"
                size="icon"
                className={cn("absolute left-2 lg:left-8 top-9 z-10")}
                onClick={() => window.history.back()}
            >
                <ArrowLeft />
            </Button>
            <div className="w-full flex flex-col items-center justify-center gap-5 px-4 md:px-10 mt-12 md:mt-0 pt-4 md:pt-0">
                <h1 className="text-2xl md:text-3xl text-hover-text font-bold text-center">
                    {form?.title}
                </h1>
                <p className="text-center text-muted-foreground text-sm md:text-base">
                    {form?.description}
                </p>

                <div className="w-full flex flex-col md:flex-row justify-around text-sm lg:text-xl gap-2 md:gap-0 items-center">
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

            {/* Desktop Table View */}
            <div
                className={cn(
                    "hidden md:flex flex-1 px-3 w-full max-w-7xl justify-center items-center mx-auto my-10"
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
                                        <TableCell>
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
                                        </TableCell>
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

            {/* Mobile Card View */}
            <div className="flex md:hidden flex-col w-full px-4 gap-4 my-6">
                {allResponses?.data?.length > 0 ? (
                    allResponses?.data?.map((d) => {
                        return (
                            <div
                                key={d._id}
                                className="border rounded-lg p-4 shadow-sm bg-card text-card-foreground flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-bold">User:</span>
                                    <Link
                                        to={`/response/${formId}/${d._id}`}
                                        className="hover:text-hover-text hover:underline text-primary truncate max-w-[150px]"
                                    >
                                        {d.userId ? d.userId : "Anonymous"}
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-2 text-sm">
                                    {form?.fields?.map((field) => (
                                        <div
                                            key={field.fieldKey}
                                            className="flex flex-col"
                                        >
                                            <span className="font-semibold opacity-70 text-xs uppercase">
                                                {field.label}
                                            </span>
                                            <span>
                                                {d.answer[field.fieldKey]
                                                    ? d.answer[field.fieldKey]
                                                    : "-"}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-2 border-t mt-1">
                                    <AlertDialog
                                        open={isDialogOpen}
                                        onOpenChange={setIsDialogOpen}
                                    >
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />{" "}
                                                Delete Response
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you absolutely sure?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This response will be
                                                    permanently deleted.
                                                    <br />
                                                    <br />
                                                    <span className="font-bold text-red-500">
                                                        This action cannot be
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
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center w-full py-10 border rounded-lg">
                        No responses found...
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-5 pb-10 w-full px-4">
                <AlertDialog
                    open={allDeleteDialog}
                    onOpenChange={setAllDeleteDialog}
                >
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="w-full md:w-auto"
                        >
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
                    <Button
                        onClick={handleResponseExport}
                        className="w-full md:w-auto"
                    >
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
