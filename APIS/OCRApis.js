const express = require("express");
const OCRApiRoute = express.Router();

OCRApiRoute.use(express.json());


OCRApiRoute.post("/addOCR", async (req,res) => {
    try{
        const detailsCollection = req.app.get("detailsCollection");
        const obj = req.body;
        await detailsCollection.insertOne({obj});

        res.status(200).send("details Added");
    } catch(err) {
        throw(err);
    }
})

OCRApiRoute.get("/getOCRDetails", async (req,res) => {
    try{
        const detailsCollection = req.app.get("detailsCollection");
        const details = detailsCollection.find();
        res.status(200).setDefaultEncoding({
            message: "success",
            response: details
        });
    } catch(err) {
        throw(err);
    }
})

module.exports = OCRApiRoute;







