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
  return name.replace(/\.[^.]+$/, "") + ".webp";
};

export {
  getFilenameFromURL,
  convertToWebP,
  changeFileExtensionToWebpExtension,
};
