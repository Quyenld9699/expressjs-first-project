const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        msg: "Orders were fetch",
    });
});

router.post("/", (req, res, next) => {
    res.status(200).json({
        msg: "Order post",
    });
});

router.get("/:order Id", (req, res, next) => {
    const id = req.params.productId;
    if (id === "special") {
        res.status(200).json({
            msg: "You discorvered the special ID",
        });
    } else {
        res.status(200).json({
            msg: "You passed an ID",
        });
    }
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;

    res.status(200).json({
        msg: "You update product",
    });
});

module.exports = router;
