import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ContactInfoCard = ({ setProfile, profile, visitingProfile }) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const [editButton, setEditButton] = useState(false);
  const [tempDob, setTempDob] = useState("");

  useEffect(() => {
    if (profile.values.dob !== undefined) {
      setTempDob(profile.values.dob);
    }
  }, []);

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 0 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> {t("ContactInformation")}</Typography>{" "}
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{
                  cursor: "pointer",
                  display: visitingProfile ? "none" : "inline",
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item>
              <TextField
                label={t("PhoneNumber")}
                variant="standard"
                size="small"
                value={profile.values.phoneNumber}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, phoneNumber: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
                name="ContactInfoPhoneNumber"
              />
            </Grid>
            <Grid item>
              <TextField
                label={t("Address")}
                variant="standard"
                size="small"
                value={profile.values.address}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, address: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
                name="ContactInfoAddress"
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ marginBottom: "1%" }}>
            <Grid item>
              <TextField
                label={t("City")}
                variant="standard"
                size="small"
                value={profile.values.city}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, city: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
                name="ContactInfoCity"
              />
            </Grid>
            <Grid item>
              <TextField
                label={t("Country")}
                variant="standard"
                size="small"
                value={profile.values.country}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, country: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
                name="ContactInfoCountry"
              />
            </Grid>
            <Grid item>
              <TextField
                label={t("PostalCode")}
                variant="standard"
                size="small"
                value={profile.values.postalCode}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, postalCode: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
                name="ContactInfoPostCode"
              />
            </Grid>
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t("DateofBirth")}
              value={tempDob}
              onChange={(newValue) => {
                setTempDob(newValue.$d.toISOString());
                setProfile({
                  values: { ...profile.values, dob: newValue.$d.toISOString() },
                });
              }}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => <TextField {...params} />}
              InputProps={{
                readOnly: !editButton,
                error: editButton,
              }}
            />
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Box>
  );
};

ContactInfoCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  visitingProfile: PropTypes.bool,
  currentUserEmail: PropTypes.string,
};

export default ContactInfoCard;
