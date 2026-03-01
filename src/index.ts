/* IMPORTS */
// External dependencies
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";

/* ROUTE IMPORTS */
// Routes for various features of the application
import admissionBookRoutes from "./routes/admissionBookRoutes";
import admissionSheetRoutes from "./routes/admissionSheetRoutes";
import drugChartRoutes from "./routes/drugChartRoutes";
import outPatientRoutes from "./routes/OutPatientRoutes";
import admissiongeneral from "./routes/admiisionRoutes";
import authRoutes from "./routes/authRoutes";
import clinincAssignmentRoutes from "./routes/clinicAssigmentRoutes";
import clinincRoutes from "./routes/clinicRoutes";
import currentWardDetails from "./routes/currentWardStatusRoute";
import diseasePredictionRoutes from "./routes/diseasePredictionRoutes";
import drugRoutes from "./routes/drugRoutes";
import getMonthlyPatientVisit from "./routes/getMonthlyPatientVisitRoute";
import medicalReports from "./routes/medicalReportRoutes";
import mobileclinicRoutes from "./routes/mobileClinicRoutes";
import patientRoutes from "./routes/patientRoutes";
import smsRoutes from "./routes/smsRoutes";
import staffwardassignment from "./routes/staffWardAssignmemtRoute";
import surgerySchedule from "./routes/surgeriesScheduleRoute";
import userRoutes from "./routes/userRoutes";
import wardBedsStatus from "./routes/wardBedsController";
import getWardBedsDetails from "./routes/wardDetailsDashboardRoute";

// Initialize the Express application
const app = express();

/**
 * CONFIGURATIONS
 * Load environment variables and set up middleware.
 */
dotenv.config();

/**
 * CORS Configuration
 * Defines allowed origins, headers, and methods for cross-origin requests.
 */
const corsOptions = {
  origin: [
    "https://opdipdcare.web.lk",
    "https://www.opdipdcare.web.lk",
    "http://localhost:5173",
    "https://main.d1rnqxbp4u27qa.amplifyapp.com",
    "http://localhost:3000", 
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions)); // Enable CORS with specified options
app.options("*", cors(corsOptions)); // Enable preflight requests for all routes

/* MIDDLEWARE SETUP */
app.use(express.json()); // Parse JSON request bodies
app.use(helmet()); // Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow cross-origin resource sharing
app.use(morgan("common")); // Log HTTP requests
app.use(bodyParser.json()); // Parse JSON using body-parser
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data

/**
 * Session Configuration
 * Sets up session management with a secret key.
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

/* ROUTES REGISTRATION */
// Registering all API routes with their respective paths

app.use("/admissionbook", admissionBookRoutes);
app.use("/admissionsheet", admissionSheetRoutes);
app.use("/drugChart", drugChartRoutes);
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

/* SERVER INITIALIZATION */
// Define the port from environment variables or default to 8000
const port = Number(process.env.PORT) || 8000;

// Start the server and listen on the specified port
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

// Basic home route for testing server status
app.get("/", (req, res) => {
  res.send("This is home route");
});

