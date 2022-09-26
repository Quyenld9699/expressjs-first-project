const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const OrderController = require("../controllers/orders");

router.get("/", OrderController.order_get_all);

router.post("/", checkAuth, OrderController.order_create);

router.get("/:orderId", OrderController.order_get_by_id);

router.patch("/:orderId", checkAuth, OrderController.order_update_by_id);

module.exports = router;
