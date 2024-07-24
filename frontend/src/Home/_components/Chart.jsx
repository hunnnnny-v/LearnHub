import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

//uses rechart library
const data = [
  { name: "2017", react: 32, angular: 37, vue: 60 },
  { name: "2018", react: 42, angular: 42, vue: 54 },
  { name: "2019", react: 51, angular: 41, vue: 54 },
  { name: "2020", react: 60, angular: 37, vue: 28 },
  { name: "2021", react: 51, angular: 31, vue: 27 },
  { name: "2022", react: 95, angular: 44, vue: 49 },
];

//data array containing names property having the year and the values of react and other languages for that particular year.

const Chart = () => {
  return (
    <LineChart width={860} height={300} data={data}>
      <Line type="monotone" dataKey="react" stroke="#9be8fd" strokeWidth={3} />
      <Line
        type="monotone"
        dataKey="angular"
        stroke="#c8b9fe"
        strokeWidth={3}
      />
      <Line type="monotone" dataKey="vue" stroke="#05b5e6" strokeWidth={3} />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};

export default Chart;
