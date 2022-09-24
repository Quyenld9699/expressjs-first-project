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
