import express from "express";

const router = express.Router();
router.use(express.json());

router.get("/", () => {});

export default router;
