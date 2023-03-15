import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Modal,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Stack,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import * as React from "react";
import { getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import Grid from "@mui/material/Unstable_Grid2";
import { db } from "../../Firebase/firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const JobPostingApplicants = () => {
  const pageCompanyID = useParams().companyID;
  const pageJobID = useParams().jobID;

  const [job, setJob] = useState([]);
  const [companyName, setCompanyName] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedApplicantStatus, setSelectedApplicantStatus] = useState("");
  const [selectedApplicantId, setSelectedApplicantId] = useState("");
  const [selectedApplicantName, setSelectedApplicantName] = useState("");
  const [changedApplicationStatus, setChangedApplicationStatus] = useState("");
  const [companiesLogo, setCompaniesLogo] = React.useState({});

  const getApplicationStatuses = async (listOfApplicants) => {
    //console.log(listOfApplicants);

    const tempArray = [];

    if (listOfApplicants != null) {
      await Promise.all(
        listOfApplicants.map(async (applicant) => {
          const applicantSnapshot = await getDoc(
            doc(db, "applications", applicant)
          );
          const applicantApplications = applicantSnapshot.data().jobs;

          const applicantNameSnapshot = await getDoc(
            doc(db, "userProfiles", applicant)
          );

          let applicationStatus = "";
          applicantApplications.forEach((jobApplication) => {
            if (jobApplication.jobID === pageJobID) {
              applicationStatus = jobApplication.status;
            }
          });

          tempArray.push({
            applicantId: applicant,
            applicantStatus: applicationStatus,
            applicantFirstName: applicantNameSnapshot.data().values.firstName,
            applicantLastName: applicantNameSnapshot.data().values.lastName,
          });
        })
      );
    } else {
      console.log("no applicants");
    }
    setApplicants(tempArray);
  };

  const getJobData = async () => {
    try {
      // Gets the job data using the jobID from the URL
      const jobsSnapshot = await getDoc(doc(db, "jobs", pageJobID));
      const jobData = jobsSnapshot.data();
      setJob(jobData);
      //console.log(jobData);
      await getApplicationStatuses(jobData.applicants);
    } catch (error) {
      console.log(error);
    }
  };

  const getCompanyName = async () => {
    try {
      // Gets the name of the company from the companyID in job data
      const companySnapshot = await getDoc(doc(db, "companies", pageCompanyID));
      const companyData = companySnapshot.data();
      setCompanyName(companyData);
    } catch (error) {
      console.log(error);
    }
  };

  // loads the logo of a company
  async function loadLogoCompany() {
    const querySnapshot = await getDoc(doc(db, "companies", pageCompanyID));
    setCompaniesLogo(querySnapshot.data().logoPath);
  }

  useEffect(() => {
    console.log(5);
    Promise.all([getJobData(), getCompanyName()])
      .then(() => {
        console.log("Finished loading data");
      })
      .catch((err) => {
        console.log(err);
      });
    loadLogoCompany();
  }, []);

  // To change application status
  // 1. Recruiter will select from interview (green), viewed (orange), rejected (red), and pending (grey default)
  const handleOpen = (status, id, name) => {
    setSelectedApplicantStatus(status);
    setSelectedApplicantId(id);
    setSelectedApplicantName(name);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleStatusChange = (event) => {
    setChangedApplicationStatus(event.target.value);
  };

  const handleSubmit = async () => {
    setSelectedApplicantStatus(changedApplicationStatus);
    // 1. Get changed application status and applicant id
    const newApplicationStatus = changedApplicationStatus;
    const applicantId = selectedApplicantId;
    const jobId = pageJobID;

    // 2. Update doc
    // Change database to directly update doc instead of iterate through the whole array
    const applicantRef = doc(db, "applications", applicantId);
    const applicantSnapshot = await getDoc(
      doc(db, "applications", applicantId)
    );
    const applicantApplications = applicantSnapshot.data().jobs;
    console.log(applicantApplications);

    // get index in array to update
    const applicationIndex = applicantApplications.findIndex(
      (jobIndex) => jobIndex.jobID === jobId
    );
    // set new status with the current jobID

    const applicationStatusToUpdate = {
      address: applicantApplications[applicationIndex].address,
      email: applicantApplications[applicationIndex].email,
      jobID: jobId,
      phoneNumber: applicantApplications[applicationIndex].phoneNumber,
      status: newApplicationStatus,
    };

    applicantApplications[applicationIndex] = applicationStatusToUpdate;

    await updateDoc(applicantRef, { jobs: applicantApplications })
      .then(() => {
        console.log("Array index updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating array index: ", error);
      });

    handleClose(); // close the modal
    window.location.reload();
  };

  return (
    <Grid container direction="row" alignItems="flex-start" justify="center">
      {/* Job information */}
      <Grid xs={12} sm={12} md={6}>
        <Box sx={{ p: 5 }}>
          <Card variant="outlined">
            <Box sx={{ m: 2 }}>
              <Box sx={{ pb: 2 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Grid
                    container
                    spacing={-0.5}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid>
                      {job.companyID === undefined ? (
                        <Box
                          component="img"
                          sx={{
                            // objectFit: "cover",
                            width: "0.25",
                            height: "0.25",
                            mr: 2,
                          }}
                          src="https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FDefault_logo.png?alt=media&token=bd9790a2-63bb-4083-8c4e-fba1a8fca4a3"
                        />
                      ) : (
                        <Box
                          component="img"
                          sx={{
                            // objectFit: "cover",
                            width: "6rem",
                            height: "6rem",
                            mr: 2,
                          }}
                          src={companiesLogo}
                        />
                      )}
                    </Grid>
                    <Grid>
                      <Box xs={12} sm={12} md={6}>
                        <Typography variant="h4">{job.title}</Typography>
                        <Typography sx={{ fontSize: 18 }}>
                          {companyName.name}
                        </Typography>
                        <Typography sx={{ fontSize: 18 }}>
                          {job.location}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Link
                    to={{
                      pathname: `/editJob/${pageJobID}`,
                    }}
                  >
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Link>
                </Stack>

                {job.deadline && (
                  <Typography sx={{ fontSize: 16, color: "#8B8B8B" }}>
                    {new Date(
                      (job.deadline.seconds ?? 0) * 1000 +
                        (job.deadline.nanoseconds ?? 0) / 1000000
                    ).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </Typography>
                )}
              </Box>

              <Divider />
              <Stack spacing={2}>
                <Box sx={{ pt: 2 }}>
                  <Typography sx={{ fontSize: 20 }}>About the job</Typography>
                  <Typography>{job.description}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 20 }}>Requirements</Typography>
                  <Typography>{job.requirement}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 20 }}>Benefits</Typography>
                  <Typography>{job.benefits}</Typography>
                </Box>
              </Stack>
            </Box>
          </Card>
        </Box>
      </Grid>

      {/* List of applicants and their statuses */}
      <Grid xs={12} sm={12} md={6}>
        <Box sx={{ p: 5 }}>
          <Card variant="outlined">
            <Box sx={{ m: 2 }}>
              <Box sx={{ pb: 2 }}>
                <Typography variant="h4">Applicants</Typography>

                {applicants !== null && applicants.length > 0 ? (
                  applicants.map((applicant) => {
                    const hello = "hello";

                    return (
                      <Stack
                        display="flex"
                        direction="row"
                        alignItems="center"
                        justifyContent="space-evenly"
                        sx={{ my: 1 }}
                      >
                        <Box sx={{ width: 150 }}>
                          <Typography>
                            {`${applicant.applicantFirstName} ${applicant.applicantLastName}`}
                          </Typography>
                        </Box>

                        <Card>
                          <CardActionArea
                            onClick={() =>
                              handleOpen(
                                applicant.applicantStatus,
                                applicant.applicantId,
                                `${applicant.applicantFirstName} ${applicant.applicantLastName}`
                              )
                            }
                          >
                            <CardContent
                              sx={{
                                display: "flex",
                                height: 5,
                                width: 200,
                                textAlign: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#FFFFFF",
                                backgroundColor: () => {
                                  switch (applicant.applicantStatus) {
                                    case "interview":
                                      return "#17A500";
                                    case "rejected":
                                      return "#8F0000";
                                    case "viewed":
                                      return "#DE8B50";
                                    default: // pending
                                      return "#A9A9A9";
                                  }
                                },
                              }}
                            >
                              <Typography sx={{ textTransform: "uppercase" }}>
                                {applicant.applicantStatus}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Stack>
                    );
                  })
                ) : (
                  <Typography>No applicants :/</Typography>
                )}
              </Box>
            </Box>
          </Card>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box display="flex" justifyContent="flex-end">
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography variant="h6" component="h2">
              Change application status for {selectedApplicantName}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              The current status is {selectedApplicantStatus}
            </Typography>
            <Stack direction="row" display="flex" alignItems="center">
              <Typography sx={{ mr: 2 }}>
                Change application status to:
              </Typography>
              <Select
                value={changedApplicationStatus}
                onChange={handleStatusChange}
              >
                <MenuItem value="interview">Interview</MenuItem>
                <MenuItem value="viewed">Viewed</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </Stack>
            <Button onClick={handleSubmit}>Submit</Button>
          </Box>
        </Modal>
      </Grid>
    </Grid>
  );
};

export default JobPostingApplicants;
