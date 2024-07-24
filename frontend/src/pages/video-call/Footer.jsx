import { useAVToggle } from "@100mslive/react-sdk";
import { Eye, EyeOff, Mic, MicOff } from "lucide-react";

function Footer() {
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } =
    useAVToggle();
  return (
    <div className="control-bar">
      <button
        className="bg-accent rounded-full p-3 flex items-center justify-center text-text"
        onClick={toggleAudio}
      >
        {isLocalAudioEnabled ? <Mic /> : <MicOff />}
      </button>
      <button
        className=" bg-accent rounded-full p-3 flex items-center justify-center text-text"
        onClick={toggleVideo}
      >
        {isLocalVideoEnabled ? <Eye /> : <EyeOff />}
      </button>
    </div>
  );
}

export default Footer;
