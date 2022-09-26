## Create nodemon.json

```json
{
    "env": {
        "DB_PASSWORD": <enter password here>
    }
}

```

## Validation data

```js
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
```

## Modify data response

```js
router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id")
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
});
```

## Mapping data when query

```js
Order.find().select("product quantity _id").populate("product", "name _id").exec().then().catch();
```

## Upload images

```js
// in products.js router
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getMilliseconds() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
});

router.post("/", upload.single("productImg"), (req, res, next) => {
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
});

// in app.js
app.use("/uploads", express.static("uploads"));
```

## Authentication

    nodemon.json like this:

```json
{
    "env": {
        "DB_PASSWORD": <password mongo>,
        "JWT_KEY":  <a random string>
    }
}
```

    you must to write check-authentication function check token valid
