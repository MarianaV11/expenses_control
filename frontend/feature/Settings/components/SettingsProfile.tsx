"use client";

import CommonDialog from "@/components/external/CommonDialog";
import { Button } from "@/components/ui/button";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { useProfile } from "@/store/profile.store";
import { useUser } from "@/store/user.store";
import { AxiosError } from "axios";
import { Calendar, Camera, Mail } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { SettingsPhotoForm } from "./forms/SettingsPhotoForm";
import SettingsProfileInfoForm from "./forms/SettingsProfileInfoForm";

const SettingsProfile = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const profile = useProfile((state) => state.profile);
  const setProfile = useProfile((state) => state.setProfile);

  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);

  const getUserData = useCallback(async () => {
    const userId: string | null = getUser();

    if (userId) {
      axios
        .get(`/users/user`, {
          params: {
            user_id: userId,
          },
        })
        .then((response) => setUser(response.data))
        .catch((error: AxiosError) => console.log(error));
    }
  }, []);

  const getUserPicture = useCallback(() => {
    axios
      .get(`/images/${getUser()}/profile`, { responseType: "blob" })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        setProfile(url);
      })
      .catch((error: AxiosError) => console.log(error));
  }, []);

  return (
    <div className="flex flex-col border-t-10 border-t-primary/50 gap-4 border rounded-md p-8 bg-background  w-[55%] max-lg:w-[100%]">
      <h1 className="text-3xl">Profile</h1>
      <p className="text-muted-foreground text-sm">
        Manage your personal information
      </p>
      <div className="p-5 inline-flex gap-12 relative max-sm:flex-col">
        <Button
          className="rounded-full absolute top-0 right-0"
          variant="outline"
          size="icon"
          onClick={(current) => setOpenDialog(true)}
        >
          <Camera className="text-primary" />
        </Button>

        <div className="w-30 h-30 relative overflow-hidden rounded-full shadow-md max-sm:mx-auto">
          <Image
            alt="user_profile"
            src={profile}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="flex gap-2 flex-col ml-3 max-sm:ml-0 max-sm:items-center">
          <h3 className="font-semiboldy text-2xl max-sm:text-sm">
            {user?.name.split(" ").slice(0, 2).join(" ")}
          </h3>
          <div className="flex items-center gap-2">
            <Mail className="text-primary/60 h-4 w-4 max-sm:hidden" />
            <p className="text-xs text-muted-foreground hover:opacity-80">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-primary/60 h-4 w-4 max-sm:hidden" />
            <p className="text-xs text-muted-foreground hover:opacity-40">
              {user?.birthday.replaceAll("-", "/")}
            </p>
          </div>
        </div>
      </div>

      {user && (
        <SettingsProfileInfoForm
          getUserData={getUserData}
          birthdate={new Date(user?.birthday)}
          email={user?.email}
          name={user?.name}
        />
      )}

      <CommonDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title="Your Profile Picture"
        description="Upload a new picture to personalize your profile."
        content={
          <SettingsPhotoForm
            currentProfile={profile === "/default_user.png" ? null : profile}
            getProfile={getUserPicture}
            setOpenForm={setOpenDialog}
          />
        }
      />
    </div>
  );
};

export default SettingsProfile;
