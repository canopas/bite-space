"use client";

import React, { useState, useRef, RefObject, useEffect } from "react";
import { StaticImageData } from "next/image";
type InputElementType = HTMLInputElement;

interface FilePreview {
  previewType: string;
  previewUrl: string| ArrayBuffer | null;
  previewName: string;
}

interface Props {
  uploadedFiles?: FilePreview[];
  callback: Function;
  children: (file: {}) => React.ReactNode;
}

export default function MultipleFileUpload({
  uploadedFiles = [] as Array<FilePreview>,
  callback,
  children,
}: Props) {
  const [filesPreview, setFilesPreview] =
    useState<FilePreview[]>(uploadedFiles);
  const [files, setFiles] = useState(uploadedFiles);

  const areArraysEqual = (arr1: any[], arr2: any[]) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  };

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      setFilesPreview(uploadedFiles);
      setFiles(uploadedFiles);
    }
  }, [uploadedFiles]);

  const inputRefs = useRef<Array<RefObject<InputElementType> | null>>(
    new Array().fill(null),
  );
  const selectFile = (index: number) => {
    if (inputRefs.current[index] && inputRefs.current[index]?.current) {
      inputRefs.current[index]?.current?.click();
    }
  };

  const inputsRef = useRef(null);
  const selectFiles = () => {
    if (inputsRef.current) {
      (inputsRef.current as HTMLInputElement).click();
    }
  };

  const add = (
    previewType: any,
    previewUrl: string | ArrayBuffer | null,
    previewName: string,
    file: any,
  ) => {
    // add file
    setFiles((files) => {
      const newFiles = [...files, file];
      return newFiles;
    });
    // add file preview
    setFilesPreview((filesPreview) => {
      return [
        ...filesPreview,
        {
          previewType: previewType,
          previewUrl: previewUrl,
          previewName: previewName,
        },
      ];
    });
  };

  const update = (
    previewType: any,
    previewUrl: string | ArrayBuffer | null,
    previewName: string,
    file: any,
    index: number,
  ) => {
    // update file
    setFiles((files) => {
      const newFiles = [...files];
      newFiles[index] = file;
      return newFiles;
    });
    // update file preview
    setFilesPreview((filesPreview) => {
      const newFiles = [...filesPreview];
      newFiles[index].previewType = previewType;
      newFiles[index].previewUrl = previewUrl;
      newFiles[index].previewName = previewName;
      return newFiles;
    });
  };

  const handleFileChange = async (
    event: any,
    index: number,
    action: string,
  ) => {
    const filesData = event.target.files;
    for (var i = 0; i < filesData.length; i++) {
      try {
        previewFile(filesData[i], index + i, action);
      } catch (error) {
        console.error("error : ", error);
      }
    }
  };

  const previewFile = async (file: any, index: number, action: string) => {
    var obj = {
      previewType: "image",
      previewUrl: "" as string | ArrayBuffer | null,
      previewName: file.name,
    };

    const reader = new FileReader();
    reader.onload = () => {
      obj.previewUrl = reader.result;
      obj.previewName = file.name;

      if (action == "reset") {
        update(obj.previewType, obj.previewUrl, obj.previewName, file, index);
      } else {
        add(obj.previewType, obj.previewUrl, obj.previewName, file);
      }
    };
    reader.onerror = (error) => {
      console.error(`Error while reading file ${file.name}: ${error}`);
    };
    reader.readAsDataURL(file);
  };

  const removeImg = (index: any) => {
    // remove file
    setFiles((files) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      return newFiles;
    });
    // remove file preview
    setFilesPreview((filesPreview) => {
      const newFiles = [...filesPreview];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  callback(files);

  return (
    <div className="flex flex-wrap gap-10">
      {filesPreview.map((item: any, index: any) => (
        <div className="relative flex" key={index}>
          <div className="cursor-pointer" onClick={() => selectFile(index)}>
            {children && children(item)}
            <input
              type="file"
              accept="image/*"
              ref={(element) => {
                inputRefs.current[index] = element
                  ? { current: element }
                  : null;
              }}
              className="hidden"
              onChange={(event) => handleFileChange(event, index, "reset")}
            />
          </div>
          <div
            className="remove-btn absolute right-0 h-5 w-5 cursor-pointer bg-[#eb4034] text-center text-white"
            onClick={() => removeImg(index)}
          >
            <p className="flex h-full w-full rotate-45 items-center justify-center text-xl font-semibold">
              +
            </p>
          </div>
        </div>
      ))}
      <div className="flex">
        <div className="cursor-pointer" onClick={selectFiles}>
          {children({})}
          <input
            type="file"
            accept="image/*"
            ref={inputsRef}
            className="hidden"
            onChange={(event) =>
              handleFileChange(event, filesPreview.length, "add")
            }
            multiple
          />
        </div>
      </div>
    </div>
  );
}
