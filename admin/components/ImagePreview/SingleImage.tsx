"use client";

import React, { useState, useRef } from "react";

export default function SingleImgPreview({
  accept,
  uploadedFile,
  callback,
  children,
}: any) {
  const [previewFileData, setPreviewFileData] = uploadedFile;
  const [fileObj, setFileObj] = useState(null);

  const fileData = {} as {
    previewType: string;
    previewUrl: string | ArrayBuffer | null;
    previewName: string;
  };

  const inputRef = useRef(null);

  const selectFile = () => {
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).click();
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      previewFile(file);
    }
  };

  const previewFile = async (file: any) => {
    fileData.previewType = "image";
    const reader = new FileReader();

    reader.onload = () => {
      if (file.type.startsWith("image/")) {
        fileData.previewUrl = reader.result;
      } else if (file.type.startsWith("video/")) {
        fileData.previewType = "video";
        fileData.previewUrl = URL.createObjectURL(file);
      }
      fileData.previewName = file.name;
      setFileObj(file);
      setPreviewFileData(fileData);
    };
    reader.onerror = (error) => {
      console.error(`Error while reading file ${file.name}: ${error}`);
    };
    reader.readAsDataURL(file);

    callback(file);
    setFileObj(previewFileData);
  };

  return (
    <div className="flex">
      <div className="cursor-pointer" onClick={selectFile}>
        {children}
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />
      </div>
    </div>
  );
}
