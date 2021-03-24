import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Paper, Grid, Typography } from "@material-ui/core";
import Select from "react-select";
import axios from "axios";
import CurrencyChart from "./currencyChart";

const useStyles = makeStyles((theme) => ({
  paperStyles: {
    height: window.innerHeight - 80,
    overflow: "auto",
    borderRadius: "12px 0 0 12px",
  },
  paperRightStyles:{
    height: window.innerHeight - 80,
    overflow: "auto",
    borderRadius: "0px 12px 12px 0px",
  },
  root: {
    width: "100%",
    height: "100vh",
    backgroundColor: "rgba(204, 204, 204, 0.93)",
  },
  gridStyles: {
    padding: theme.spacing(4.5),
  },
}));

export default function SelectCurrency(props) {
  const classes = useStyles();
  const [currencyValues, setCurrencyValues] = useState([]);
  const [optionData, setOptionData] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  useEffect(() => {
    getCurrencyData();
  }, []);

  //   Setting option data nd fetching data from api
  const getCurrencyData = () => {
    axios
      .get(`https://api.coindesk.com/v1/bpi/currentprice.json`)
      .then((res) => {
        const responseData = res.data.bpi;
        let optionValues = [];
        Object.values(responseData).map((data, key) => {
          optionValues.push({ value: data.code, label: data.description });
        });
        setOptionData(optionValues);
        setCurrencyValues([responseData]);
      });
  };

  const handleChange = (event) => {
    setSelectedCurrency(event.value);
  };

  const displayAmount = () => {
    let returnData = [];
    Object.values(currencyValues).map((temp, index) => {
      Object.values(temp).map((subTemp, index) => {
        if (subTemp.code === selectedCurrency) {
          returnData.push(
            <Typography key={index} variant="h3" style={{ fontWeight: "bold" }}>
              {subTemp.rate} {subTemp.description}
            </Typography>
          );
        }
      });
    });
    return returnData;
  };

  return (
    <div className={classes.root}>
        <Grid container className={classes.gridStyles}>
          <Grid item xs={6}>
          <Paper className={classes.paperStyles}>
            {currencyValues.length > 0 ? (
              <Box style={{ padding: "32px" }}>
                <Typography
                  variant="h6"
                  style={{ color: "#878787", fontWeight: "bold" }}
                >
                  1 Bitcoin Equals
                </Typography>
                <Box mt={2} width="50%">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    onChange={(event) => handleChange(event)}
                    name="color"
                    options={optionData}
                  />
                </Box>
                <Box mt={4}>{displayAmount()}</Box>
              </Box>
            ) : (
              <Typography
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                No Data
              </Typography>
            )}
            </Paper>
          </Grid>
          <Grid item xs={6}>
          <Paper className={classes.paperRightStyles}>
            <CurrencyChart
              currencyData={currencyValues}
              payload={selectedCurrency}
            />
            </Paper>
          </Grid>
        </Grid>
      
    </div>
  );
}
