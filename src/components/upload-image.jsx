import { api } from "@/config/api";
import { PROFILE } from "@/constant/image";
import { makeToast } from "@/helper/makeToast";
import { cn } from "@/lib/utils";
import { React, useState } from "react";

export const UploadImage = ({
  className,
  image,
  onChangeImage,
  isProfile = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const onImageSelected = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        await handleFileUpload(file);
      }
    } catch (error) {
      console.log("image error",error)
      makeToast("error", error);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      makeToast("info", "Uploading...");
      const res = await api.post("/image", formData);
      onChangeImage?.(res.data.data);
    } catch (error) {
      makeToast("error", error);
    }
  };

  if (isProfile) {
    return (
      <div
        className={cn(
          "w-40 h-40 rounded-full flex items-center justify-center cursor-pointer overflow-hidden",
          className,
          isDragOver ? "bg-gray-200" : ""
        )}
        onClick={() => document.getElementById("image")?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          className="hidden"
          type="file"
          accept="image/*"
          id="image"
          onChange={onImageSelected}
        />
        <img
          src={image || PROFILE}
          alt=""
          className="w-full h-full object-cover rounded-full"
          width={600}
          height={400}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-100 h-40 transition-all overflow-hidden",
        className,
        isDragOver ? "bg-gray-200" : ""
      )}
      onClick={() => document.getElementById("image")?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        className="hidden"
        type="file"
        accept="image/*"
        id="image"
        onChange={onImageSelected}
      />
      {image ? (
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover rounded-md"
          width={600}
          height={400}
        />
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            Klik / Drag untuk mengunggah gambar
          </p>
        </>
      )}
    </div>
  );
};
