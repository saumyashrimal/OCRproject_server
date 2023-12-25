const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileApis = express.Router();
const {detectImage, processData} = require('./utils');
fileApis.use(express.json());

// Define the path for 'uploads' directory
const uploadDirectory = path.join(__dirname, 'uploads');

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
fileApis.post('/upload', upload.single('image'), async (req, res) => {
    console.log("req = ", req.file);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const filePath = req.file.path;
    let str = await detectImage(filePath);
    let data = processData(JSON.stringify(str));
    res.status(200).send({response: data});
  });

module.exports = fileApis;