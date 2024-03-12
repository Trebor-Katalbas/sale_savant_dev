import { Box, useTheme } from "@mui/material";
import { Header, LineSalesChart, PieChart, StatBox } from "components";
import React, { useEffect, useState } from "react";
import { baseUrl } from "state/api";

const Dashboard = () => {
  const theme = useTheme();
  const [eod, setEOD] = useState([]);
  const [sold, setNoSold] = useState([]);

  const fetchEOD = async () => {
    try {
      const response = await fetch(`${baseUrl}home/get-eod`);
      if (response.ok) {
        const data = await response.json();
        const eodWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setEOD(eodWithId);
      } else {
        console.error("Failed to fetch eod data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };
  useEffect(() => {
    fetchEOD();
  }, []);

  const fetchNoSold = async () => {
    try {
      const response = await fetch(`${baseUrl}home/get-noSold`);
      if (response.ok) {
        const data = await response.json();
        const soldWithId = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setNoSold(soldWithId);
      } else {
        console.error("Failed to fetch sold data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };
  useEffect(() => {
    fetchNoSold();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const date = new Date();
  const formattedDate = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  // Check if eod has elements before accessing latestEod
  const latestEod = eod.length > 0 ? eod.slice(-1)[0] : {};

  return (
    <>
      <Box>
        <Header title={"Dashboard"} disp={"none"} />
      </Box>
      <Box width="100%" padding="0 2em">
        <Box
          display="flex"
          gap="1em"
          sx={{
            flexDirection: { xs: "column", sm: "column", md: "row", lg: "row" },
          }}
          width="100%"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "1em",
            }}
          >
            <StatBox
              title={"Net Sales"}
              value={`Php ${latestEod.netSales || 0}`} // Provide a default value if netSales is undefined
              date={formattedDate}
              width="100%"
              height={{
                xs: "15vh",
                sm: "15vh",
                md: "15vh",
                lg: "15vh",
                xl: "18vh",
              }}
              bg={theme.palette.primary[700]}
            />
            <StatBox
              title={"Income"}
              value={`Php ${latestEod.grossIncome || 0}`} // Provide a default value if grossIncome is undefined
              date={formattedDate}
              width="100%"
              height={{
                xs: "15vh",
                sm: "15vh",
                md: "15vh",
                lg: "15vh",
                xl: "18vh",
              }}
              bg={theme.palette.primary[700]}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "1em",
            }}
          >
            <StatBox
              title={"Expenses"}
              value={`Php ${latestEod.expenses || 0}`} // Provide a default value if expenses is undefined
              date={formattedDate}
              width="100%"
              height={{
                xs: "15vh",
                sm: "15vh",
                md: "15vh",
                lg: "15vh",
                xl: "18vh",
              }}
              bg={theme.palette.primary[700]}
            />
            <StatBox
              title={"Refunds"}
              value={`Php ${latestEod.refunds || 0}`} // Provide a default value if refunds is undefined
              date={formattedDate}
              width="100%"
              height={{
                xs: "15vh",
                sm: "15vh",
                md: "15vh",
                lg: "15vh",
                xl: "18vh",
              }}
              bg={theme.palette.primary[700]}
            />
          </div>
        </Box>

        <Box
          gap="1em"
          marginTop="1em"
          display="flex"
          flexDirection={{ xs: "column", sm: "column", md: "row", lg: "row" }}
        >
          <Box
            borderRadius="10px"
            height="360px"
            width={{ xs: "90vw", sm: "60%", md: "60%", lg: "60%" }}
            sx={{ background: theme.palette.secondary[700] }}
          >
            <LineSalesChart
              data={eod.map((item) => ({
                x: formatDate(item.date),
                y: item.grossSales,
              }))}
            />
          </Box>
          <Box
            sx={{
              background: theme.palette.primary[800],
              borderRadius: "10px",
            }}
          >
            <PieChart data={sold.map((item) => ({ id: item.menuItem, value: item.price }))} /> 
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
