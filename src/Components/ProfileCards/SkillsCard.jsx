import { React, useState } from "react";
import { Grid, Box, Card, CardContent, Typography, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";

const SkillsCard = ({ profile }) => {
  const skills = [profile.values.skills];
  const [editButton, setEditButton] = useState(false);
  return (
    <Box>
      <Card variant="outlined" sx={{ mx: 5 }}>
        <CardContent>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h5"> Skills </Typography>
            </Grid>
            <Grid item>
              <EditIcon
                onClick={() => setEditButton(!editButton)}
                style={{ cursor: "pointer" }}
              />
            </Grid>
          </Grid>
          {/* Would like to turn this into tags that can be deleted */}
          <Grid container spacing={1}>
            {skills.map((data) => (
              <Grid item>
                <Chip color="info" label={data} variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

SkillsCard.propTypes = {
  profile: PropTypes.objectOf(PropTypes.any),
};

export default SkillsCard;