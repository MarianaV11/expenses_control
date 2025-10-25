import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

interface CommonDialogProps {
  title: string;
  openButton: React.ReactNode | string;
  content: React.ReactNode;
  className?: string;
  description?: string;
}

const CommonDialog = ({
  title,
  openButton,
  content,
  className,
  description,
}: CommonDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        {openButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
