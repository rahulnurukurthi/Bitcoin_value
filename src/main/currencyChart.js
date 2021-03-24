import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import axios from "axios";
import Select from "react-select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function CurrencyChart(props) {
  const [chartData, setChartData] = useState([]);
  const [selectedStartYear, setSelectedStartYear] = useState("2013");
  const [selectedEndYear, setSelectedEndYear] = useState("2014");

  useEffect(() => {
    getCurrencyData();
  }, [props.payload, selectedStartYear, selectedEndYear]);

  //   Setting option data nd fetching data from api
  const getCurrencyData = () => {
    axios
      .get(
        `https://api.coindesk.com/v1/bpi/historical/close.json?currency=${props.payload}&start=${selectedStartYear}-09-01&end=${selectedEndYear}-09-10`
      )
      .then((res) => {
        const responseData = res.data.bpi;
        let optionValues = [];
        Object.values(responseData).map((data, key) => {
          optionValues.push({ name: "MAR", value: data });
        });
        setChartData(optionValues);
      });
  };

  const optionData = [
    { value: "2013", label: "2013" },
    { value: "2014", label: "2014" },
    { value: "2015", label: "2015" },
    { value: "2016", label: "2016" },
    { value: "2017", label: "2017" },
  ];

  const handleChange = (event, indicator) => {
    if (indicator === "start") {
      setSelectedStartYear(event.value);
    } else {
      setSelectedEndYear(event.value);
    }
  };

  return (
    <Box p={4}>
      <Box mt={2} display="flex">
        <Box width="30%">
          <Select
            className="basic-single"
            classNamePrefix="select"
            onChange={(event) => handleChange(event, "start")}
            name="first"
            placeholder="Select Start Year"
            options={optionData}
          />
        </Box>
        <Box ml={4} width="30%">
          <Select
            className="basic-single"
            classNamePrefix="select"
            onChange={(event) => handleChange(event, "end")}
            name="first"
            placeholder="Select End Year"
            options={optionData}
          />
        </Box>
      </Box>
      <Box mt={4}>
        <LineChart
          width={props.chartWidth !== undefined ? props.chartWidth : 472}
          height={props.chartHeight !== undefined ? props.chartHeight : 232}
          data={chartData}
          margin={{
            top: 14,
            right: 2,
            left: 2,
            bottom: 2,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="value" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </Box>
    </Box>
  );
}
