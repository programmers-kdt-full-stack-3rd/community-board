import express from "express";
import { requireLogin } from "../middleware/auth";
import { upload } from "../utils/upload-image";
import { handleUploadImage } from "../controller/image_comtroller";

const router = express.Router();
router.use(express.json());

router.post("/", requireLogin, upload.single("image"), handleUploadImage);

export default router;
