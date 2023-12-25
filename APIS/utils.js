const vision = require("@google-cloud/vision");
const private_key = process.env.private_key;
const client_email = process.env.client_email;

const CONFIG = {
  Credential: {
    private_key,
    client_email,
  },
};

// vision client
const client = new vision.ImageAnnotatorClient(CONFIG);

const detectImage = async (filePath) => {
  let [result] = await client.textDetection(filePath);
  const endRes = result?.fullTextAnnotation?.text;
  console.log("result = ", endRes);
  return endRes;
};

const monthtonumb = new Map();
monthtonumb.set("Jan.", "01");
monthtonumb.set("Feb.", "02");
monthtonumb.set("Mar.", "03");
monthtonumb.set("Apr.", "04");
monthtonumb.set("May.", "05");
monthtonumb.set("Jun.", "06");
monthtonumb.set("Jul.", "07");
monthtonumb.set("Aug.", "08");
monthtonumb.set("Sep.", "09");
monthtonumb.set("Oct.", "10");
monthtonumb.set("Nov.", "11");
monthtonumb.set("Dec.", "12");

const getIdentificationNumber = (dataStr) => {
  var numbers = dataStr.match(/\d+/g);
  var subst = numbers.slice(0, 5);
  var res = subst.join(" ");
  res = res.trim();
  console.log("res = ", res);
  return res;
};

const getFirstName = (dataStr) => {
  var wordarr = dataStr.split(" ");
  for (var i = 0; i < wordarr.length; i++) {
    if (wordarr[i] == "Name") {
      let str =
        wordarr[i + 1] +
        " " +
        wordarr[i + 2].substring(0, wordarr[i + 2].length - 1);
      return str;
    }
  }
};

const getLastName = (dataStr) => {
  var wordarr = dataStr.split(" ");
  for (var i = 0; i < wordarr.length; i++) {
    if (wordarr[i] == "Last") {
      i = i + 2;
      let laststr = wordarr[i].substring(0, wordarr[i].length - 1);
      return laststr;
    }
  }
};

const getBirthDate = (dataStr) => {
  var wordarr = dataStr.split(" ");
  for (var i = 0; i < wordarr.length; i++) {
    if (wordarr[i] == "Birth") {
      let mon = "";
      for (let [key, value] of monthtonumb.entries()) {
        if (key == wordarr[i + 2]) {
          mon = value;
        }
      }
      let birthdate =
        wordarr[i + 1] +
        "/" +
        mon +
        "/" +
        wordarr[i + 3].substring(0, wordarr[i + 3].length - 1);
      return birthdate;
    }
  }
};

const getIssueDate = (dataStr) => {
  var wordarr = dataStr.split(" ");
  for (var i = 0; i < wordarr.length; i++) {
    if (wordarr[i] == "Issue\n") {
      let mon = "";
      for (let [key, value] of monthtonumb.entries()) {
        if (key == wordarr[i - 7]) {
          mon = value;
        }
      }
      let issuedate =
        wordarr[i - 8] +
        "/" +
        mon +
        "/" +
        wordarr[i - 6].substring(0, wordarr[i - 6].length - 1);
      return issuedate;
    }
  }
};

const getExpiryDate = (dataStr) => {
  var wordarr = dataStr.split(" ");

  for (var i = 0; i < wordarr.length; i++) {
    if (wordarr[i] == "Expiry\n") {
      let mon = "";
      for (let [key, value] of monthtonumb.entries()) {
        if (key == wordarr[i - 8]) {
          mon = value;
        }
      }
      let expirydate = wordarr[i - 9] + "/" + mon + "/" + wordarr[i - 7];
      return expirydate;
    }
  }
};

const processData = (dataStr) => {
  const mp = {};
  mp["identification_number"] = getIdentificationNumber(dataStr);
  mp["name"] = getFirstName(dataStr);
  mp["last_name"] = getLastName(dataStr);
  mp["date_of_birth"] = getBirthDate(dataStr);
  mp["date_of_issue"] = getIssueDate(dataStr);
  mp["date_of_expiry"] = getExpiryDate(dataStr);
  return mp;
};

module.exports = { detectImage, processData };
