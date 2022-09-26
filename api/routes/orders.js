const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

router.get("/", (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate("product", "name _id")
        .exec()
        .then((docs) => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map((order) => {
                    return {
                        ...order._doc,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + order._id,
                        },
                    };
                }),
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.post("/", checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            });
            return order
                .save()
                .then((result) => {
                    console.log(result);
                    res.status(201).json(result);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get("/:orderId", (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .exec()
        .then((order) => {
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + order._id,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

router.patch("/:orderId", checkAuth, (req, res, next) => {
    const id = req.params.orderId;

    Order.remove({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "Delete success",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: { productId: "ID", quantity: "Number" },
                },
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;
