"use client";

import CommonDialog from "@/components/external/CommonDialog";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/button";
import SettingsSecurityForm from "./forms/SettingsSecurityForm";

const SettingsSecurity = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4 border rounded-md p-8 bg-background w-[55%] max-lg:w-[100%]">
      <h1 className="text-3xl">Security</h1>
      <p className="text-muted-foreground text-sm">
        Manage your account security settings and keep your information safe.
      </p>

      <div className="flex items-center gap-3">
        <Lock className="text-primary max-sm:hidden" />
        <div>
          <h2>Change Password</h2>
          <p className="text-muted-foreground text-sm">
            Update your password regularly to help protect your account from
            unauthorized access.
          </p>
        </div>
        <Button className="ml-auto" onClick={() => setOpenDialog(true)}>
          Change
        </Button>
      </div>

      <CommonDialog
        title="Change Password"
        description="Enter a new password to replace your current one."
        content={<SettingsSecurityForm setOpenForm={setOpenDialog} />}
        open={openDialog}
        setOpen={setOpenDialog}
      />
    </div>
  );
};

export default SettingsSecurity;
