import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */

// import teamRoutes from "./routes/teamRoutes";
import admissionBookRoutes from "./routes/admissionBookRoutes";
import admissionSheetRoutes from "./routes/admissionSheetRoutes";
import drugChartRoutes from "./routes/drugChartRoutes";
// import userRoutes from "./routes/userRoutes";
import patientRoutes from "./routes/patientRoutes";
import currentWardDetails from "./routes/currentWardStatusRoute";
import wardBedsStatus from "./routes/wardBedsController";
import outPatientRoutes from "./routes/OutPatientRoutes";
import drugRoutes from "./routes/drugRoutes";
import clinincRoutes from "./routes/clinicRoutes";
import clinincAssignmentRoutes from "./routes/clinicAssigmentRoutes";
import smsRoutes from "./routes/smsRoutes";
import mobileclinicRoutes from "./routes/mobileClinicRoutes";
import diseasePredictionRoutes from "./routes/diseasePredictionRoutes";
import staffwardassignment from "./routes/staffWardAssignmemtRoute";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import getMonthlyPatientVisit from "./routes/getMonthlyPatientVisitRoute";
import getWardBedsDetails from "./routes/wardDetailsDashboardRoute";
import userRoutes from "./routes/userRoutes";
import surgerySchedule from "./routes/surgeriesScheduleRoute";
import medicalReports from "./routes/medicalReportRoutes";
import admissiongeneral from "./routes/admiisionRoutes";
/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://main.d1rnqxbp4u27qa.amplifyapp.com",
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // allow it always
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // optional but recommended
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

/* ROUTES */

app.use("/admissionbook", admissionBookRoutes);
app.use("/admissionsheet", admissionSheetRoutes);
app.use("/drugChart", drugChartRoutes);
// app.use("/users", userRoutes);
app.use("/patient", patientRoutes);
app.use("/warddetails", currentWardDetails);
app.use("/wardbedscontroller", wardBedsStatus);
app.use("/outPatient", outPatientRoutes);
app.use("/drugs", drugRoutes);
app.use("/clinic", clinincRoutes);
app.use("/clinicassigmnent", clinincAssignmentRoutes);
app.use("/sendsms", smsRoutes);
app.use("/mobileclinic", mobileclinicRoutes);
app.use("/diseaseprediction", diseasePredictionRoutes);
app.use("/staffwardassignment", staffwardassignment);
app.use("/auth", authRoutes);
app.use("/getmonthlypatientvisit", getMonthlyPatientVisit);
app.use("/getwardbedstatus", getWardBedsDetails);
app.use("/getusers", userRoutes);
app.use("/surgery", surgerySchedule);
app.use("/medicalreports", medicalReports);
app.use("/generaladmission", admissiongeneral);
// app.use("/ticket", ticketRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on part ${port}`);
});
app.get("/", (req, res) => {
  res.send("This is home route");
});
