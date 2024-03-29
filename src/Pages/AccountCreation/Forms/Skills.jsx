import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Skills = ({ setSkills, values }) => {
  // Set the strings based on the language defined by the user
  const { t, i18n } = useTranslation();
  return (
    <Grid
      id="formGrid"
      container
      spacing={0}
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "15vh", minWidth: "50vh" }}
      rowSpacing={1}
    >
      <Grid item xs={12}>
        <TextField
          id="outlined-multiline-static"
          label={t("Description")}
          multiline
          rows={6}
          value={values.skills}
          onChange={(e) => setSkills(e.target.value)}
          style={{ backgroundColor: "white" }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

Skills.propTypes = {
  setSkills: PropTypes.func,
  values: PropTypes.shape({
    skills: PropTypes.string,
  }),
};

export default Skills;
