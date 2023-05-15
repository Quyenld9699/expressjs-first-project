const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const app = express();
const morgan = require("morgan"); // to log system work on terminal
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const metricRoutes = require("./api/routes/metrics");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

const swaggerDefinition = {
    info: {
        title: "Test express js",
        version: "1.0.0",
        description: "Test chơi",
    },
    basePath: "/",
};
const options = {
    swaggerDefinition,
    apis: ["./api/routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);

mongoose.connect(`mongodb+srv://quyenld9699:${process.env.DB_PASSWORD}@expressjs-db.uyl3y8e.mongodb.net/?retryWrites=true&w=majority`);
mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//Todo: list api
app.use("/metrics", metricRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Todo: navigate 404
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            msg: error.message,
        },
    });
});

module.exports = app;
