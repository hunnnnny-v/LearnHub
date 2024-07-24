import { UserButton } from "@clerk/clerk-react";
import React from "react";

const ProtectedPage = () => {
  return <UserButton />; //button useed for rendering a button that interacts with the user interaction handle sign in and sign out,
};

export default ProtectedPage;
