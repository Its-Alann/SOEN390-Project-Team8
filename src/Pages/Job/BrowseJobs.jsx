import * as React from "react";
import {
  collection,
  query,
  limitToLast,
  getDocs,
  orderBy,
  startAfter,
  endBefore,
  doc,
  getDoc,
  limit,
} from "firebase/firestore";
import {
  Box,
  Container,
  Button,
  Typography,
  Card,
  Stack,
} from "@mui/material/";
import { db } from "../../Firebase/firebase";
import "./Job.css";
import JobCard from "../../Components/Jobs/JobCard";

export const BrowseJobs = () => {
  const [jobs, setJobs] = React.useState([]);
  const [lastJob, setLastJob] = React.useState(null);
  const [firstJob, setFirstJob] = React.useState(null);
  const [companiesName, setCompaniesName] = React.useState({});
  const [companiesLogo, setCompaniesLogo] = React.useState({});

  const jobsPerPage = 5;

  /// Remarks: the following code was written to avoid fetching the entire jobs2 collection to local
  /// because collection of jobs willl grow rapidly. If someone only view first 3 pages, we don't need to fetch the rest.
  /// but the reads of database is still high, so maybe something here is wrong.

  // The purpose of this query is to get jobs sorted descending by published date
  // Firebase does not have desc orderby
  // hence, use the ascending order & limit to last
  // For example I have 7 jobs.
  // 1 2 3 4 5 6 7
  //     x x x x x
  // these will be selected.
  // then shown in reverse order.
  const initialJobsQuery = query(
    collection(db, "jobs2"),
    orderBy("publishedAt"),
    limitToLast(jobsPerPage)
  );

  // The matter with firstJob & lastJob.
  // After a query executed
  // For example I have 7 jobs.
  // 1 2 3 4 5 6 7
  //     x x x x x
  //     L       F
  // x  is selected jobs.
  // L is last job.
  // F is first job.

  // nextJobsQuery end the query before the lastJob
  // For example, now I have 3 as lastJob
  // 1 2 3 4 5 6 7
  // x x
  // these will be selected
  // then
  // L F
  // 1 & 2 become the new lastJob & firstJob
  const nextJobsQuery = query(
    collection(db, "jobs2"),
    orderBy("publishedAt"),
    endBefore(lastJob),
    limitToLast(jobsPerPage)
  );

  // previousJobsQuery start the query after the firstJob
  // For example, now I have 2 as firstJob
  // 1 2 3 4 5 6 7
  //     x x x x x
  // these will be selected// then
  //     L       F
  // 3 & 7 become the new lastJob & firstJob
  const previousJobsQuery = query(
    collection(db, "jobs2"),
    orderBy("publishedAt"),
    startAfter(firstJob),
    limit(jobsPerPage)
  );

  // The alternative way is to fetch the entire collection
  // to the local machine, storing it in a list.
  // It can become heavy as the collection grows.
  async function getJobs(jobsQuery) {
    const jobsSnapshot = await getDocs(jobsQuery);

    // if none document returned, skip
    if (jobsSnapshot.docs.length < 1) {
      return;
    }

    setLastJob(jobsSnapshot.docs[0]);
    setFirstJob(jobsSnapshot.docs[jobsSnapshot.docs.length - 1]);

    const temp = [];
    jobsSnapshot.docs.forEach((document) => {
      temp.push({ ...document.data(), documentID: document.id });
    });
    temp.reverse();
    setJobs(temp);
  }

  // Get companies' name using the companyID of each Job
  // And store them.
  // If the companies' name has already been stored, skip
  function getCompaniesName() {
    const temp = companiesName;
    const temp2 = companiesLogo;

    jobs.forEach(async (job) => {
      const companyRef = doc(db, "companies2", job.companyID);
      const companySnapshot = await getDoc(companyRef);
      if (!temp[job.companyID]) {
        temp[job.companyID] = "querying";
        temp[job.companyID] = companySnapshot.data().name;
        setCompaniesName({ ...temp });
      }
      if (companySnapshot.data().logoPath === "") {
        temp2[job.companyID] =
          "https://firebasestorage.googleapis.com/v0/b/team-ate.appspot.com/o/company-logo%2FHIREME_whitebg.png?alt=media&token=c621d215-a3db-4557-8c06-1618905b5ab0";
      } else temp2[job.companyID] = companySnapshot.data().logoPath;
      setCompaniesLogo({ ...temp2 });
    });
  }

  React.useEffect(() => {
    getCompaniesName();
  }, [jobs]);

  React.useEffect(() => {
    getJobs(initialJobsQuery);
  }, []);

  return (
    <Container sx={{ mb: 10 }}>
      <Box sx={{ pt: 5 }}>
        <Typography variant="h4" sx={{ pb: 2 }}>
          Browse Jobs
        </Typography>
        <Typography>
          This Page list all jobs, {jobsPerPage} per page. Everyone can access
          this page.
        </Typography>

        {jobs.map((job) => {
          // Anti-eslint measure
          const hello = "hello";
          return (
            <JobCard
              key={`JobCard-${job.documentID}`}
              companyID={job.companyID}
              companyName={companiesName[job.companyID]}
              jobID={job.documentID}
              title={job.title}
              city={job.city}
              country={job.country}
              deadlineSeconds={job.deadline.seconds}
              deadlineNanoSeconds={job.deadline.nanoseconds}
              logo={companiesLogo[job.companyID]}
            />
          );
        })}
        <Button id="Button-Previous" onClick={() => getJobs(previousJobsQuery)}>
          Previous
        </Button>
        <Button id="Button-Next" onClick={() => getJobs(nextJobsQuery)}>
          Next
        </Button>
      </Box>
    </Container>
  );
};
export default BrowseJobs;
