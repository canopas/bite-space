import Image from "next/image";

const NotFound = () => {
  return (
    <div className="h-screen select-none">
      <div className="animated-fade-y flex h-screen w-full">
        <Image
          className="object-cover w-full h-full"
          src="/images/banner/2.webp"
          alt="Not Found Image"
          height={100}
          width={100}
          loading="lazy"
        />
      </div>
      <div className="animated-fade-y absolute top-0 bg-black h-screen w-full bg-opacity-60">
        <div className="container h-full items-center justify-center text-white flex flex-col">
          <div className="text-3xl sm:text-5xl md:text-7xl font-extrabold border-b border-primary pb-2 sm:pb-3 md:pb-5">
            Not Found
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
