const express = require("express");
const router = express.Router();
const { getCutoffs } = require("../controllers/cutoff.controller");

router.get("/", getCutoffs);

module.exports = router;