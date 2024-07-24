import axios from "axios";
import { Mailbox, Shell } from "lucide-react";
import React, { useEffect, useState } from "react";

const News = () => {
  const [headlines, setHeadLines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://current-affairs-of-india.p.rapidapi.com/recent",
      headers: {
        "X-RapidAPI-Key": "3c2c9f08fbmsh26f9609ff4e6b1ep187092jsnce5ee0cb3fc8",
        "X-RapidAPI-Host": "current-affairs-of-india.p.rapidapi.com",
      },
    };

    const news = async () => {
      setLoading(true);

      try {
        const response = await axios.request(options);
        setHeadLines(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        setHeadLines(error);
        setLoading(false);
      }
    };

    news();
  }, []);

  // console.log(headlines);
  return (
    <div className="absolute top-12 ml-2 flex flex-col items-center gap-y-2 justify-between mr-2">
      {loading && (
        <div className="flex gap-x-2">
          <Shell className="animate-spin h-10 w-10 text-text" />
          <span className="text-sm text-accent bg-background p-0.5 rounded-r-md">
            Wait we are fetching you the current affairs to keep you on track
            always
          </span>
        </div>
      )}

      {!loading && headlines.length === 0 && (
        <div
          // key={headline}
          className="flex gap-x-1 bg-background rounded-r-md p-0.5"
        >
          <Mailbox className="h-5 w-5 text-accent" />
          <h1 className="text-text text-xs font-semibold">
            Oops the API we use might be down!
          </h1>
        </div>
      )}

      {!loading &&
        headlines.length !== 0 &&
        headlines.slice(0, 5).map((headline) => (
          <div
            key={headline}
            className="flex gap-x-1 bg-background rounded-r-md p-0.5"
          >
            <Mailbox className="h-5 w-5 text-accent" />
            <h1 className="text-text text-xs font-semibold">{headline}</h1>
          </div>
        ))}
    </div>
  );
};

export default News;
