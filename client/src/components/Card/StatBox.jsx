import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { FlexBetween } from "components";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const StatBox = ({ title, value, increase, description, date, width, height, bg }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      width={width}
      height={height}
      sx={{ background: [bg], padding: "1em", borderRadius: "5px", }}
    >
      <FlexBetween>
        <Typography
          variant="h5"
          sx={{ color: theme.palette.secondary[200], fontWeight: 500 }}
        >
          {title}
        </Typography>
      </FlexBetween>

      <Typography
        variant="h3"
        fontWeight="600"
        sx={{ textAlign: "center", padding: "0.5em 0" }}
      >
        {value}
      </Typography>
      <FlexBetween gap="1rem">
        <div>
          {increase > 0 ? (
            <>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: "#00A94E", display:"flex", alignItems:"center" }}
              >
                {increase}%
                <TrendingUpIcon/>
              </Typography>
            </>
          ) : increase < 0 ? (
            <>
              <Typography variant="h5" fontStyle="italic" sx={{ color: "#CB001E", display:"flex", alignItems:"center" }}>
                {increase}%
                <TrendingDownIcon/>
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h5"
                fontStyle="italic"
                sx={{ color: "#000" }}
              >
                {increase}
              </Typography>
            </>
          )}
        </div>
        <Typography>{description || date}</Typography>
      </FlexBetween>
    </Box>
  );
};

export default StatBox;
