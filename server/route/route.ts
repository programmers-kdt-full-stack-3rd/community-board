import express from 'express';
import { doTest } from '../controller/testController';

const router = express.Router();
router.use(express.json());

router.get("/", doTest);

export default router;