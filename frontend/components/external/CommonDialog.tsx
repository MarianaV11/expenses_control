import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";

interface CommonDialogProps {
  title: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  content: React.ReactNode;
  className?: string;
  description?: string;
  open: boolean;
}

const CommonDialog = ({
  setOpen,
  title,
  content,
  description,
  open = false,
}: CommonDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogContent>
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
