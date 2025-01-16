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
import userRoutes from "./routes/userRoutes";
import patientRoutes from "./routes/patientRoutes";
import currentWardDetails from "./routes/currentWardStatusRoute";
import wardBedsStatus from "./routes/wardBedsController";
import outPatientRoutes from "./routes/OutPatientRoutes";
import drugRoutes from "./routes/drugRoutes";
import clinincRoutes from "./routes/clinicRoutes";
import clinincAssignmentRoutes from "./routes/clinicAssigmentRoutes";
import smsRoutes from "./routes/smsRoutes";
// import ticketRoutes from "./routes/ticketRoutes";
/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});
app.use("/admissionbook", admissionBookRoutes);
app.use("/admissionSheet", admissionSheetRoutes);
app.use("/drugChart", drugChartRoutes);
app.use("/users", userRoutes);
app.use("/patient", patientRoutes);
app.use("/warddetails", currentWardDetails);
app.use("/wardBedsController", wardBedsStatus);
app.use("/outPatient", outPatientRoutes);
app.use("/drugs", drugRoutes);
app.use("/clinic", clinincRoutes);
app.use("/clinicassigmnent", clinincAssignmentRoutes);
app.use("/sendsms", smsRoutes);
// app.use("/ticket", ticketRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on part ${port}`);
});
