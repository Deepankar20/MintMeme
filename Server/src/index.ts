import express from "express";
import cors from "cors";

import { tokenRouter } from "./routes/token";
import {authRouter} from "./routes/auth";
const PORT = process.env.PORT ?? 8080;

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/token", tokenRouter);
app.use("/api/v1/auth/", authRouter);

app.listen(PORT, () => {
  console.log("Server Listening On Port : ", PORT);
});
