import React from "react";
import JoinForm from "./JoinForm";
import { useEffect } from "react";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import Header from "./Header";
import Conference from "./Conference";
import Footer from "./Footer";
import "./styles.css";

const Video = () => {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);

  useEffect(() => {
    window.onunload = () => {
      hmsActions.leave();
    };
  }, [hmsActions]);

  return (
    <main className="text-text font-poppins flex flex-col items-center justify-center w-full">
      {isConnected ? (
        <>
          <Conference />
          <Footer />
        </>
      ) : (
        <JoinForm />
      )}
      <Header />

      <div className="flex flex-col items-center mr-2">
        <h1 className="text-text font-semibol text-xs">
          We use{" "}
          <span className="text-accent">100ms for the video conferencing.</span>{" "}
          This is very basic right now but if you want full features of the
          video calling click on the link below!
        </h1>
        <div className="flex gap-x-2">
          <a
            target="_blank"
            className="text-accent hover:underline mt-3"
            rel="noreferrer"
            href="https://hashir-videoconf-2243.app.100ms.live/meeting/rju-wlyc-oet"
          >
            Your Link
          </a>
          <a
            target="_blank"
            className="text-accent hover:underline mt-3"
            rel="noreferrer"
            href="https://hashir-videoconf-2243.app.100ms.live/meeting/nuq-ispo-qfu"
          >
            Student's Link
          </a>
        </div>
      </div>
    </main>
  );
};

export default Video;
