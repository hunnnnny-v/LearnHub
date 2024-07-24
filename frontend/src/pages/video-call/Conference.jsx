import { selectPeers, useHMSStore } from "@100mslive/react-sdk";
import Peer from "./Peer";
import { Tv } from "lucide-react";

function Conference() {
  const peers = useHMSStore(selectPeers);

  return (
    <div className="">
      <h2 className="font-bold text-3xl self-center items-center flex gap-x-2">
        <Tv className="h-12 w-12 text-accent" />
        Conference
      </h2>
      <div className="peers-container">
        {peers.map((peer) => (
          <Peer key={peer.id} peer={peer} />
        ))}
      </div>
    </div>
  );
}

export default Conference;
