import { Box, useMediaQuery, useTheme } from "@mui/material";
import { CashierNav } from "components";
import React from "react";
import { Outlet } from "react-router-dom";

const CashierLayout = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  return (
    <Box
      display={isNonMobile ? "flex" : "block"}
      width="100%"
      height="100%"
      sx={{
        background:
          theme.palette.mode === "dark"
            ? theme.palette.primary[800]
            : "#ECECEC",
      }}
    >
      <Box flexGrow={1}>
        <CashierNav />
        <Outlet />
      </Box>
    </Box>
  );
};

export default CashierLayout;
