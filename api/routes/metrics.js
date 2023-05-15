const express = require("express");
const router = express.Router();
const MetricController = require("../controllers/metric");

router.get("/", MetricController.metrics);

module.exports = router;
