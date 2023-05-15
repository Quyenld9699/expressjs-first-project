const express = require("express");

const promethusClient = require("prom-client");

const collectDefaultMetric = promethusClient.collectDefaultMetrics;

collectDefaultMetric({ timeout: 5000 });

exports.counter = new promethusClient.Counter({
    name: "node_request_oper_total",
    help: "Total number of processed requests",
});

exports.histogram = new promethusClient.Histogram({
    name: "node_request_duration_second",
    help: "Total number of processed requests",
    buckets: [1, 2, 5, 6, 10],
});

exports.metrics = (req, res) => {
    try {
        res.set("Content-Type", promethusClient.register.contentType);
        promethusClient.register
            .metrics()
            .then((metrics) => {
                res.send(metrics);
            })
            .catch((error) => {
                console.error("Error retrieving metrics:", error);
                res.status(500).send("Error retrieving metrics");
            });
    } catch (err) {
        console.log(err);
    }
};
