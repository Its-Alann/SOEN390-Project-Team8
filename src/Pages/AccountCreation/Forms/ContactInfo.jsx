import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PropTypes from "prop-types";

const ContactInfo = ({
  setPhoneNumber,
  setAddress,
  setCity,
  setCountry,
  setPostalCode,
  setDob,
  values,
}) => (
  <Grid
    container
    spacing={0}
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: "35vh" }}
    rowSpacing={1}
  >
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Phone number"
        variant="standard"
        value={values.phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Address"
        variant="standard"
        value={values.address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="City"
        variant="standard"
        value={values.city}
        onChange={(e) => setCity(e.target.value)}
      />

      <TextField
        required
        id="standard-required"
        placeholder="Country"
        variant="standard"
        value={values.country}
        onChange={(e) => setCountry(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        id="standard-required"
        placeholder="Postal Code"
        variant="standard"
        value={values.postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date of Birth"
          value={values.dob}
          onChange={(newValue) => {
            setDob(newValue);
          }}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Grid>
  </Grid>
);

ContactInfo.propTypes = {
  setPhoneNumber: PropTypes.func.isRequired,
  setAddress: PropTypes.func.isRequired,
  setCity: PropTypes.func.isRequired,
  setCountry: PropTypes.func.isRequired,
  setPostalCode: PropTypes.func.isRequired,
  dob: PropTypes.func,
  setDob: PropTypes.func,
  values: PropTypes.shape({
    phoneNumber: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    postalCode: PropTypes.string,
    address: PropTypes.string,
    dob: PropTypes.string,
  }),
};

export default ContactInfo;
