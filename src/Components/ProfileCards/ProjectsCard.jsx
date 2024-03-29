/* eslint-disable react/prop-types */
import { React, useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

const ProjectsCard = ({
  profile,
  setProfile,
  cardNum,
  isLast,
  visitingProfile,
}) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();

  const projTitle = `proj${cardNum}title`;
  const projDesc = `proj${cardNum}description`;
  const [editButton, setEditButton] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);

  const handleClickOpen = () => {
    setDeleteAlert(true);
  };

  const handleClose = () => {
    setDeleteAlert(false);
  };

  const handleClearCardInfo = () => {
    handleClose();
    const newCardNum = profile.values.projectNum - 1;
    setProfile({
      values: {
        ...profile.values,
        projectNum: newCardNum,
      },
    });
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 0 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> {t("Project")}</Typography>
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
                label={t("ProjectTitle")}
                name="ProjectTitle"
                variant="standard"
                size="small"
                value={profile.values[projTitle]}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, [projTitle]: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item sx={{ mr: "auto" }}>
              <TextField
                label={t("ProjectDescription")}
                name="ProjectDescription"
                variant="standard"
                size="small"
                multiline
                maxRows={4}
                value={profile.values[projDesc]}
                onChange={(e) =>
                  setProfile({
                    values: { ...profile.values, [projDesc]: e.target.value },
                  })
                }
                InputProps={{
                  readOnly: !editButton,
                  error: editButton,
                }}
              />
            </Grid>
            {isLast && (
              <>
                {cardNum > 0 && (
                  <DeleteIcon
                    sx={{ ml: "auto", mt: "auto", cursor: "pointer" }}
                    onClick={handleClickOpen}
                    name="projDel"
                  />
                )}

                <Dialog open={deleteAlert} onClose={handleClose}>
                  <DialogContent>
                    <DialogContentText>
                      {t("Areyousureyouwanttodeletethiscard?")}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>{t("Cancel")}</Button>
                    <Button onClick={handleClearCardInfo} name="projPopupDel">
                      {t("Delete")}
                    </Button>
                  </DialogActions>
                </Dialog>

                <AddIcon
                  sx={{
                    ml: "1%",
                    mt: "auto",
                    cursor: "pointer",
                    display: visitingProfile ? "none" : "inline",
                  }}
                  onClick={() => {
                    const newCardNum = profile.values.projectNum + 1;
                    console.log(newCardNum);
                    setProfile({
                      values: {
                        ...profile.values,
                        projectNum: newCardNum,
                      },
                    });
                  }}
                  name="projAdd"
                />
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

ProjectsCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  profile: PropTypes.objectOf(PropTypes.any),
  setProfile: PropTypes.func,
  visitingProfile: PropTypes.bool,
};

export default ProjectsCard;
