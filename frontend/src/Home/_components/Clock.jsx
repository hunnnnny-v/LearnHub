import { CloudMoon, CloudSun, MoonStar, Sun } from "lucide-react";
import { useEffect, useState } from "react";
function Clock() {
  const [time, setTime] = useState(""); //stores the curr formatted time
  const [icon, setIcon] = useState(""); //stores the react elem as icon and changes dynamically

  useEffect(() => {
    const updateClock = () => {
      const date = new Date(); //curr date and time
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0"); //gets curr hours min and sec from the Date object with atleast 2 digits
      const ampm = hours >= 12 ? "PM" : "AM";
      //determines it is am/pm on if hour is >?12
      const formattedHours = String(hours % 12 || 12).padStart(2, "0"); //in 12-hour format such that 12am is represented as 12
      const currentTime = `${formattedHours}:${minutes}:${seconds} ${ampm}`; //has a string having curr time in format

      setTime(currentTime); //sets the time with formatted curr time

      if (hours >= 6 && hours < 12) {
        setIcon(<CloudSun size={48} />);
      } else if (hours >= 12 && hours < 18) {
        // setIcon(<i className="fas fa-sun"></i>);
        setIcon(<Sun size={48} />);
      } else if (hours >= 18 && hours < 21) {
        // setIcon(<i className="fa-solid fa-cloud-moon"></i>);
        setIcon(<CloudMoon size={48} />);
      } else {
        // setIcon(<i className="fas fa-moon"></i>);
        setIcon(<MoonStar size={48} />);
      }
    };

    // Update the clock and icon every second
    const intervalId = setInterval(updateClock, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-y-2 text-text">
      <div className="">{icon}</div>
      <div className="font-bold text-2xl font-poppins">{time}</div>
    </div>
  );
}

export default Clock;
