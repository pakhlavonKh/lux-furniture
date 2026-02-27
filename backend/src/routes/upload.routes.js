import express from "express";
import upload from "../middleware/upload.js";
import { uploadImages } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/", upload.array("images"), uploadImages);

export default router;