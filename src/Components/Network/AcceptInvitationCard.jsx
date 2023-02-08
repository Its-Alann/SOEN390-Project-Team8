/* eslint-disable react/function-component-definition */
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { blueGrey, blue } from "@mui/material/colors";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const ColorButtonBlue = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blue[600]),
  backgroundColor: blue[600],
  "&:hover": {
    backgroundColor: blue[700],
  },
}));

const ColorButtonBlueGray = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(blueGrey[400]),
  backgroundColor: blueGrey[400],
  "&:hover": {
    backgroundColor: blueGrey[500],
  },
}));

const card = (
  <>
    <CardHeader
      avatar={
        //source will be the user's image
        <Avatar aria-label="user" sx={{ width: 56, height: 56 }} src="" />
      }
      //title will be the user's name and subheader is their bio
      title="Jane Doe"
      subheader="The next Elon Musk"
    />
    {/*moves the buttons to the right*/}
    <Box display="flex" justifyContent="flex-end">
      <CardActions>
        {/*view profile will go to the user's profile and message will be sent to the */}
        <ColorButtonBlueGray size="medium">Ignore</ColorButtonBlueGray>
        <ColorButtonBlue size="medium">Accept</ColorButtonBlue>
      </CardActions>
    </Box>
  </>
);

export default function OutlinedCard() {
  return (
    <Box sx={{ width: 300, minWidth: 100 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
