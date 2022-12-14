const mongoose = require("mongoose");
const Product = require("../models/product");

exports.product_get_all = (req, res, next) => {
    Product.find()
        .select("name price _id img")
        .exec()
        .then((docs) => {
            console.log(docs);
            const docsLength = docs.length;
            if (docsLength >= 0) {
                res.status(200).json({
                    count: docsLength,
                    products: docs.map((item) => {
                        return {
                            ...item._doc,
                            request: {
                                type: "GET",
                                api: "http://localhost:3000/products/" + item._id,
                            },
                        };
                    }),
                });
            } else {
                res.status(404).json({ message: "No entries found" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.product_create = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        img: req.file.path,
    });

    product
        .save()
        .then((result) => {
            console.log(result);
            res.status(201).json({
                msg: "handling post request to /products",
                product: product,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.product_update_by_id = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.product_get_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then((doc) => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "No valid entry found for id" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.product_delete_by_id = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then((result) => {
            res.status(200).json(result);
            res.status(200).json({
                msg: "You delete product",
            });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
};
