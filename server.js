const express = require("express");
const app = express();
const cors = require('cors');

require("dotenv").config();
const {MongoClient}= require("mongodb");

app.use(express.json());
const OCRApiRoute = require('./APIS/OCRApis');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

const dbUrl = process.env.DATABASE_URL;
let client =  new MongoClient(dbUrl);
client.connect((err, client) => {
    if(err){
        console.info("error occured while connecting to mongo db");
    }
    else {
        console.log("database connected....");
        let databaseObj = client.db("OCR");

        let detailsCollection = databaseObj.collection('Details');
        app.set('detailsCollection', detailsCollection);
    }
})

let fileApis = require("./APIS/FileApis");

app.use("/files", fileApis);
app.use("/OCR", OCRApiRoute);

app.listen(8080, () => {
    console.log("server is running on port:8080");
})