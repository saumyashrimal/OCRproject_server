const express = require("express");
const OCRApiRoute = express.Router();

OCRApiRoute.use(express.json());

OCRApiRoute.post("/addOCR", async (req, res) => {
  try {
    const detailsCollection = req.app.get("detailsCollection");
    const {
      identification_number,
      name,
      last_name,
      date_of_birth,
      date_of_issue,
      date_of_expiry,
    } = req.body;
    await detailsCollection.insertOne({
      identification_number,
      name,
      last_name,
      date_of_birth,
      date_of_issue,
      date_of_expiry,
    });
    res.status(200).send("details Added");
  } catch (err) {
    throw err;
  }
});

OCRApiRoute.get("/getOCRDetails", async (req, res) => {
  try {
    const detailsCollection = req.app.get("detailsCollection");
    const ans = await detailsCollection.find().toArray();
    res.status(200).send({
      message: "success",
      response: ans,
    });
  } catch (err) {
    throw err;
  }
});

module.exports = OCRApiRoute;
