const express = require('express');
const router = express.Router();
router.use(express.json());

const { doTest } = require('../controller/testController');

router.get("/", doTest);

module.exports = router;