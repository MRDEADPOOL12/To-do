import React from "react";
import { Box, CircularProgress } from "@mui/material";

export const Loading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <CircularProgress />
    </Box>
  );
}; 