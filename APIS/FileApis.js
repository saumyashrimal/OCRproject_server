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

    let result = detectImage(filePath);
    console.log("GCP response = ", result);
    // let str = `'บัตรประจําตัวประชาชน Thai National ID Card\n' +
    // '0 1234 56789 10 1\n' +
    // 'เลขประจําตัวประชาชน\n' +
    // 'Identification Number\n' +
    // 'ชื่อตัวและชื่อสกุล\n' +
    // 'Name\n' +
    // 'FO\n' +
    // 'Koyruk\n' +
    // 'Last Name\n' +
    // 'เกิดวันที่\n' +
    // '14 ม.ค. 2523\n' +
    // 'Date of Birth\n' +
    // '14 Jan 1980\n' +
    // 'ที่อยู่ 2300 คาโลรามา วอชิงตัน ดี.ซี. 20007\n' +
    // '2 ม.ค. 2566\n' +
    // 'วันออกบัตร\n' +
    // '2 Jan 2028\n' +
    // 'Date of Issue\n' +
    // 'นาย หมีน้อยคอยรัก\n' +
    // 'Mr. Meenoy\n' +
    // '(นายคน บุญคุ้ม)\n' +
    // 'เจ้าพนักงานออกบัตร\n' +
    // '180\n' +
    // '170\n' +
    // '1)\n' +
    // '1 ม.ค. 2573\n' +
    // 'วันบัตรหมดอายุ\n' +
    // '1Jan 2032\n' +
    // 'Date of Expiry\n' +
    // '180\n' +
    // '170\n' +
    // '160'`
    // let data = processData(str);
    // console.log("data = ", data);
    return res.status(200).send('File uploaded successfully.');
  });

module.exports = fileApis;