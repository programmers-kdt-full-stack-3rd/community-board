import express from "express";
import { requireLogin } from "../middleware/auth";
import { upload } from "../utils/upload-image";
import { handleUploadImage } from "../controller/ image_controller";

const router = express.Router();
router.use(express.json());

router.post("/", requireLogin, upload, handleUploadImage);

export default router;
