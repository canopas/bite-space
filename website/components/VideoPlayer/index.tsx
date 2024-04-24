import { useState } from "react";
import Image from "next/image";
interface VideoPlayerProps {
  src: string;
  poster: string;
  classes: string;
}

const VideoPlayer = ({ src, poster, classes }: VideoPlayerProps) => {
  const [loaded, setLoaded] = useState(false);

  const handleVideoLoaded = () => {
    setLoaded(true);
  };

  return (
    <div className="h-full w-full">
      {!loaded && (
        <Image
          src={poster}
          alt="Video Thumbnail"
          height={100}
          width={100}
          className={classes}
        />
      )}
      <video
        src={src}
        loop
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        className={`${classes} transition duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadedData={handleVideoLoaded}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
