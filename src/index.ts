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
// app.use("/teams", teamRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on part ${port}`);
});
