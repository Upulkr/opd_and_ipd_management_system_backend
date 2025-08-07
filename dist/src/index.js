"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
// import teamRoutes from "./routes/teamRoutes";
const admissionBookRoutes_1 = __importDefault(require("./routes/admissionBookRoutes"));
const admissionSheetRoutes_1 = __importDefault(require("./routes/admissionSheetRoutes"));
const drugChartRoutes_1 = __importDefault(require("./routes/drugChartRoutes"));
// import userRoutes from "./routes/userRoutes";
const express_session_1 = __importDefault(require("express-session"));
const OutPatientRoutes_1 = __importDefault(require("./routes/OutPatientRoutes"));
const admiisionRoutes_1 = __importDefault(require("./routes/admiisionRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const clinicAssigmentRoutes_1 = __importDefault(require("./routes/clinicAssigmentRoutes"));
const clinicRoutes_1 = __importDefault(require("./routes/clinicRoutes"));
const currentWardStatusRoute_1 = __importDefault(require("./routes/currentWardStatusRoute"));
const diseasePredictionRoutes_1 = __importDefault(require("./routes/diseasePredictionRoutes"));
const drugRoutes_1 = __importDefault(require("./routes/drugRoutes"));
const getMonthlyPatientVisitRoute_1 = __importDefault(require("./routes/getMonthlyPatientVisitRoute"));
const medicalReportRoutes_1 = __importDefault(require("./routes/medicalReportRoutes"));
const mobileClinicRoutes_1 = __importDefault(require("./routes/mobileClinicRoutes"));
const patientRoutes_1 = __importDefault(require("./routes/patientRoutes"));
const smsRoutes_1 = __importDefault(require("./routes/smsRoutes"));
const staffWardAssignmemtRoute_1 = __importDefault(require("./routes/staffWardAssignmemtRoute"));
const surgeriesScheduleRoute_1 = __importDefault(require("./routes/surgeriesScheduleRoute"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const wardBedsController_1 = __importDefault(require("./routes/wardBedsController"));
const wardDetailsDashboardRoute_1 = __importDefault(require("./routes/wardDetailsDashboardRoute"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const corsOptions = {
    origin: [
        "https://opdipdcare.web.lk",
        "https://www.opdipdcare.web.lk", // <-- ADD THIS IF YOU USE www VERSION
        "http://localhost:5173",
        "https://main.d1rnqxbp4u27qa.amplifyapp.com",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use((0, cors_1.default)(corsOptions)); // CORS FIRST
app.options("*", (0, cors_1.default)(corsOptions)); // Enable preflight requests
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// const corsOptions = {
//   origin: [
//     "https://opdipdcare.web.lk",
//     "https://www.opdipdcare.web.lk",
//     "http://localhost:5173",
//     "https://main.d1rnqxbp4u27qa.amplifyapp.com",
//   ],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"], // allow it always
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // optional but recommended
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
}));
/* ROUTES */
app.use("/admissionbook", admissionBookRoutes_1.default);
app.use("/admissionsheet", admissionSheetRoutes_1.default);
app.use("/drugChart", drugChartRoutes_1.default);
// app.use("/users", userRoutes);
app.use("/patient", patientRoutes_1.default);
app.use("/warddetails", currentWardStatusRoute_1.default);
app.use("/wardbedscontroller", wardBedsController_1.default);
app.use("/outPatient", OutPatientRoutes_1.default);
app.use("/drugs", drugRoutes_1.default);
app.use("/clinic", clinicRoutes_1.default);
app.use("/clinicassigmnent", clinicAssigmentRoutes_1.default);
app.use("/sendsms", smsRoutes_1.default);
app.use("/mobileclinic", mobileClinicRoutes_1.default);
app.use("/diseaseprediction", diseasePredictionRoutes_1.default);
app.use("/staffwardassignment", staffWardAssignmemtRoute_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/getmonthlypatientvisit", getMonthlyPatientVisitRoute_1.default);
app.use("/getwardbedstatus", wardDetailsDashboardRoute_1.default);
app.use("/getusers", userRoutes_1.default);
app.use("/surgery", surgeriesScheduleRoute_1.default);
app.use("/medicalreports", medicalReportRoutes_1.default);
app.use("/generaladmission", admiisionRoutes_1.default);
// app.use("/ticket", ticketRoutes);
/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on part ${port}`);
});
app.get("/", (req, res) => {
    res.send("This is home route");
});
