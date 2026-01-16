import React from "react";
import { Copy, CheckCircle, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

//Shadcn components
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PublishDialog = ({ open, onOpenChange, publishedForm }) => {
    const shareUrl = `${window.location.origin}/form/${publishedForm?.data?.publicURL}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Form URL Copied");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-500 h-6 w-6" />
                        <DialogTitle>Form Published Successfully!</DialogTitle>
                    </div>
                    <DialogDescription>
                        Your form is now live and ready to collect responses.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                    <Input
                        value={shareUrl}
                        readOnly
                        className="bg-gray-50 selection:text-hover-text"
                    />
                    <Button
                        size="icon"
                        onClick={copyToClipboard}
                        className="shrink-0"
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-between">
                    <Button
                        variant="secondary"
                        onClick={() => window.open(shareUrl, "_blank")}
                        className={cn("cursor-pointer")}
                    >
                        <ExternalLink className="mr-2 h-4 w-4" /> View Form
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        className={cn("cursor-pointer")}
                    >
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
