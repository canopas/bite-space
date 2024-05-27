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
    <>
      {!loaded ? (
        <Image
          src={poster}
          alt="Video Thumbnail"
          height={100}
          width={100}
          className={classes}
        />
      ) : (
        <video
          src={src}
          loop
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          className={classes}
        >
          Your browser does not support the video tag.
        </video>
      )}
      <video
        src={src}
        muted
        className="hidden"
        onLoadedData={handleVideoLoaded}
      >
        Your browser does not support the video tag.
      </video>
    </>
  );
};

export default VideoPlayer;
