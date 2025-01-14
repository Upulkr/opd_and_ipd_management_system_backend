"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/* ROUTE IMPORTS */
// import teamRoutes from "./routes/teamRoutes";
const admissionBookRoutes_1 = __importDefault(require("./routes/admissionBookRoutes"));
const admissionSheetRoutes_1 = __importDefault(require("./routes/admissionSheetRoutes"));
const drugChartRoutes_1 = __importDefault(require("./routes/drugChartRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const patientRoutes_1 = __importDefault(require("./routes/patientRoutes"));
const currentWardStatusRoute_1 = __importDefault(require("./routes/currentWardStatusRoute"));
const wardBedsController_1 = __importDefault(require("./routes/wardBedsController"));
const OutPatientRoutes_1 = __importDefault(require("./routes/OutPatientRoutes"));
const drugRoutes_1 = __importDefault(require("./routes/drugRoutes"));
const clinicRoutes_1 = __importDefault(require("./routes/clinicRoutes"));
const clinicAssigmentRoutes_1 = __importDefault(require("./routes/clinicAssigmentRoutes"));
// import ticketRoutes from "./routes/ticketRoutes";
/* CONFIGURATIONS */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
/* ROUTES */
app.get("/", (req, res) => {
    res.send("This is home route");
});
app.use("/admissionbook", admissionBookRoutes_1.default);
app.use("/admissionSheet", admissionSheetRoutes_1.default);
app.use("/drugChart", drugChartRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/patient", patientRoutes_1.default);
app.use("/warddetails", currentWardStatusRoute_1.default);
app.use("/wardBedsController", wardBedsController_1.default);
app.use("/outPatient", OutPatientRoutes_1.default);
app.use("/drugs", drugRoutes_1.default);
app.use("/clinic", clinicRoutes_1.default);
app.use("/clinicassigmnent", clinicAssigmentRoutes_1.default);
// app.use("/ticket", ticketRoutes);
/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on part ${port}`);
});
