const express = require("express");
const router = express.Router();

const { predictCollege } = require("../controllers/prediction.controller");

router.post("/", predictCollege);

module.exports = router;