import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";
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
    console.log(tempArray);
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

  useEffect(() => {
    console.log(5);
    Promise.all([getJobData(), getCompanyName()])
      .then(() => {
        console.log("Finished loading data");
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // For application statuses
  // 1. Get the array of applications from jobs
  // 2. Get the names of the applicants from userProfiles
  // 3. If the job ID exists for the user in applications, then display the applicant status

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
      jobID: jobId,
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
    <Stack direction="row" alignItems="flex-start" justifyContent="center">
      {/* Job information */}
      <Box sx={{ width: 700, p: 5 }}>
        <Card variant="outlined">
          <Box sx={{ m: 2 }}>
            <Box sx={{ pb: 2 }}>
              <Stack spacing={-0.5}>
                <Typography variant="h4">{job.title}</Typography>
                <Typography sx={{ fontSize: 18 }}>
                  {companyName.name}
                </Typography>
                <Typography sx={{ fontSize: 18 }}>{job.location}</Typography>
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
      {/* List of applicants and their statuses */}
      <Box sx={{ width: 500, p: 5 }}>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
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
    </Stack>
  );
};

export default JobPostingApplicants;
