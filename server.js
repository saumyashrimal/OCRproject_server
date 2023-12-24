const express = require("express");
const app = express();
const cors = require('cors');

require("dotenv").config();

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

let fileApis = require("./APIS/FileApis");

app.use("/files", fileApis);

app.listen(8080, () => {
    console.log("server is running on port:8080");
})