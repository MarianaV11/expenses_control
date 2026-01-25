"use client";

import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarProfile,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { axios } from "@/service/axios_config";
import { getUser } from "@/service/local_storage";
import { showErrorToast, showSuccessToast } from "@/service/toast_service";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowRight, ImageMinus, ImagePlus, ImageUp, User } from "lucide-react";
import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  file: z.any(),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export type CropPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface ProjectImageFormProps {
  currentProfile: string | null;
  setOpenForm: (openForm: boolean) => void;
  getProfile: () => void;
}

export const SettingsPhotoForm = ({
  currentProfile,
  getProfile,
  setOpenForm,
}: ProjectImageFormProps) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const [imageSrc, setImageSrc] = useState<string | null>(currentProfile);
  const [preview, setPreview] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = async (_: any, pixels: CropPixels) => {
    if (!imageSrc) return;

    // Create image to show in screen.
    const image = new Image();
    image.src = imageSrc;
    await new Promise((r) => (image.onload = r));

    const canvas = document.createElement("canvas");

    canvas.width = pixels.width;
    canvas.height = pixels.height;

    const drawPencil = canvas.getContext("2d")!;
    drawPencil.drawImage(
      image,
      pixels.x,
      pixels.y,
      pixels.width,
      pixels.height,
      0,
      0,
      pixels.width,
      pixels.height,
    );

    // Transform image into blob to be sent.
    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "profile.png", { type: "image/png" });

      form.setValue("file", file, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setPreview(URL.createObjectURL(blob));
    }, "image/png");
  };

  const onSubmit = ({ file }: FormSchemaType) => {
    const formData = new FormData();
    formData.append("file", file);

    const userId = getUser();
    const url = currentProfile
      ? `/images/profile/update/${userId}`
      : `/images/profile/create/${userId}`;

    const request = currentProfile ? axios.put : axios.post;

    request(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        showSuccessToast({ message: "Profile updated with success!" });
        setOpenForm(false);
        getProfile();
      })
      .catch((error: AxiosError) => {
        showErrorToast({
          message: `Error updating profile picture: ${error.message}`,
        });
        setOpenForm(false);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 rounded-md justify-between p-4 lg:flex-row border border-primary/50">
        <h2 className="text-center text-md font-medium text-slate-400">
          Preview how your profile will look.
        </h2>
        <ArrowRight className="hidden h-6 w-6 animate-bounce text-primary lg:block" />

        <AvatarProfile className="h-16 w-16">
          <AvatarImage src={preview} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </AvatarProfile>
      </div>

      <div className="relative mt-4 h-[20rem] w-full border rounded-md flex items-center justify-center">
        {imageSrc ? (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        ) : (
          <h3 className="text-muted-foreground font-light">Select an image.</h3>
        )}
        <label className="absolute right-2 top-2 cursor-pointer rounded-md bg-slate-100 p-1 hover:bg-slate-200 dark:bg-slate-700">
          <ImageUp className="h-5 w-5 opacity-55" />
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={onSelectFile}
          />
        </label>
      </div>

      <div className="flex gap-4 pl-12 pr-12">
        <ImageMinus className="opacity-80" />
        <Slider
          value={[zoom]}
          onValueChange={(value) => setZoom(value[0])}
          min={1}
          max={3}
          step={0.1}
        />
        <ImagePlus className="opacity-80" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormDescription>
                  The file must be PNG, JPG or JPEG.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </>
  );
};
