import {
  DeleteObjectCommand,
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY as string,
  },
});

const bucketUrl =
  "https://bitespace.s3." +
  process.env.NEXT_PUBLIC_AWS_REGION +
  ".amazonaws.com/";

const getFilenameFromURL = (url: string) => {
  const path = new URL(url).pathname;
  return path.substring(path.lastIndexOf("/") + 1);
};

const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create an image element and load the file
    const img = new Image();
    img.onload = () => {
      // Create a canvas and draw the image onto it
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // Convert the canvas content to a WebP blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert image to WebP"));
        }
      }, "image/webp");
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
};

const changeFileExtensionToWebpExtension = (name: string) => {
  return name.replace(/\s+/g, "-").replace(/\.[^.]+$/, "") + ".webp";
};

const uploadFileTos3 = async (bucket: string, file: any, fileName: string) => {
  let uploadParams = {
    Bucket: "bitespace",
    Body: file,
    ContentType: file.type,
    Key: bucket + "/" + fileName,
    ACL: "public-read" as ObjectCannedACL,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    const getObj = new GetObjectCommand({
      Bucket: "bitespace",
      Key: bucket + "/" + fileName,
    });

    const src = await getSignedUrl(s3, getObj);

    const url = src.substring(0, src.indexOf("?"));

    return url;
  } catch (error) {
    console.error("Error while uploading file to s3: ", error);
  }

  return "";
};

const deleteFileFroms3 = async (fileUrl: string) => {
  try {
    const deleteObj = new DeleteObjectCommand({
      Bucket: "bitespace",
      Key: fileUrl.replace(bucketUrl, ""),
    });

    await s3.send(deleteObj);
  } catch (error) {
    console.error("Error while deleting the file from s3: ", error);
  }
};

export {
  getFilenameFromURL,
  convertToWebP,
  changeFileExtensionToWebpExtension,
  uploadFileTos3,
  deleteFileFroms3,
};
