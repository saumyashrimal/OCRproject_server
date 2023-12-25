const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Require the 'fs' module
const fileApis = express.Router();
const {detectImage, processData} = require('./utils');
fileApis.use(express.json());
const uploadDirectory = path.join(__dirname, 'uploads'); // Define the path for 'uploads' directory

// Check if the 'uploads' directory exists, if not, create it
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      // Ensure the uploaded file has a JPEG extension
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
      ) {
        // Rename the file with .jpg extension
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
      } else {
        cb(new Error('Only JPEG files are allowed.'));
      }
    },
  });

// Multer upload settings
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
      ) {
        cb(null, true); // Accept the file
      } else {
        cb(new Error('Only JPEG files are allowed.'), false); // Reject the file
      }
    },
  });

// Set up a route to handle file uploads
fileApis.post('/upload', upload.single('image'), (req, res) => {
    console.log("req = ", req.file);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const filePath = req.file.path;
    let cRes = {
        "identification_number": "1 2345 12345 23",
        "name": "Mr. Meenoy",
        "last_name": "kreekoy",
        "date_of_birth": "20/06/1980",
        "date_of_issue": "21/05/2020",
        "date_of_expiry": "21/05/2029"
    };
    // let result = detectImage(filePath);
    // let data = processData(str);
    return res.status(200).send({response: cRes});
  });

module.exports = fileApis;