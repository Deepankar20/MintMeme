import { Router } from "express";

import { prisma } from "../db/db";

export const tokenRouter = Router();

tokenRouter.post("/create", async () => {});

tokenRouter.post("/image-upload", async () => {});

tokenRouter.get("/:mint", async () => {});

tokenRouter.get("/", async () => {});
