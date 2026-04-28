import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

import authRouter from "./routes/auth.routes.js";
import matchRouter from "./routes/match.routes.js";
import playerRouter from "./routes/player.routes.js";
import scoreRouter from "./routes/score.routes.js";
import startMatchRouter from "./routes/startmatch.routes.js";
import teamRouter from "./routes/team.routes.js";
import scorecardRouter from "./routes/scorecard.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/matches", matchRouter);
app.use("/api/players", playerRouter);
app.use("/api/scores", scoreRouter);
app.use("/api/start-match", startMatchRouter);
app.use("/api/teams", teamRouter);
app.use("/api/scorecards", scorecardRouter);

export { app };