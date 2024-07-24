import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";//library
import React from "react";
import "./styles.css";

function Header() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);//hook is used to check the user is currently connected to a room . 
  const hmsActions = useHMSActions();//accessed the highfive sdk.

  return (
    <header>
      {isConnected && (
        <button
          id="leave-btn"
          className="btn-danger"
          onClick={() => hmsActions.leave()}//indicates to leave the room
        >
          Leave Room
        </button>
      )}
    </header>
  );
}

export default Header;
