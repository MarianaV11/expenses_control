import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
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
} from "../../ui/alert-dialog";
import { Button } from "../../ui/button";

const SettingsDangerZone = () => {
  const router = useRouter();

  const onDeleteAccount = () => {
    axios
      .delete(`/users/delete/${getUser()}`)
      .then(() => router.push("/"))
      .catch((error: AxiosError) => console.error(error));
  };

  return (
    <div className="flex flex-col gap-4 border border-b-primary/50 rounded-md p-8 bg-background w-[55%] max-lg:w-[100%] border-b-10">
      <h1 className="text-3xl">Danger Zone</h1>
      <p className="text-muted-foreground text-sm">Irreversible actions</p>
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-destructive">Delete Account</h2>
          <p className="text-muted-foreground text-sm">
            Permanently remove your account and all data
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger className="ml-auto" asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={onDeleteAccount}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SettingsDangerZone;
