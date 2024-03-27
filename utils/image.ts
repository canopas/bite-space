const getFilenameFromURL = (url: string) => {
  const path = new URL(url).pathname;
  return path.substring(path.lastIndexOf("/") + 1);
};

export { getFilenameFromURL };
