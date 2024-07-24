import { useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";

function JoinForm() {
  const hmsActions = useHMSActions();
  const [inputValues, setInputValues] = useState({
    name: "",
    token: "",
  });

  const handleInputChange = (e) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userName = "", roomCode = "" } = inputValues;

    // use room code to fetch auth token
    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

    try {
      await hmsActions.join({ userName, authToken });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="font-poppins flex flex-col items-center justify-center w-full"
    >
      <h2 className="text-text text-3xl font-bold mb-2">Join Room</h2>
      <p className="text-sm font-semibold text-text">
        Current roomcode : <span className="text-accent">{"rju-wlyc-oet"}</span>
      </p>
      <div className="">
        <input
          className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 w-60 bg-background text-text"
          required
          value={inputValues.name}
          onChange={handleInputChange}
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
        />
      </div>
      <div className="input-container">
        <input
          id="room-code"
          className="border-2 border-accent placeholder:text-gray-400 rounded-md p-2 mt-2 w-60 bg-background text-text"
          type="text"
          name="roomCode"
          placeholder="Room code"
          // value={"rju-wlyc-oet"}
          onChange={handleInputChange}
        />
      </div>
      <button className="bg-accent px-4 rounded-md py-1 text-text">Join</button>
    </form>
  );
}

export default JoinForm;
